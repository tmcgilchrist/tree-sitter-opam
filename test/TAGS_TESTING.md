# Tags Query Testing Documentation

This document describes the tags queries implemented for the tree-sitter-opam grammar and how to test them.

## What are Tags?

Tags queries power code navigation and symbol search in editors by marking up "definitions" and "references". This enables features like:

- **Go to definition** - Jump to where a symbol is defined
- **Symbol search** - Find all definitions in a file or project
- **Document outline** - Show a tree of symbols in a sidebar
- **Breadcrumbs** - Display current location in the document structure

## Implemented Tags

### 1. `@definition.package`
Captures the package name from the `name` field.

**Example:**
```opam
name: "my-package"
       ^^^^^^^^^^^^ - Tagged as @definition.package
```

### 2. `@definition.version`
Captures the package version from the `version` field.

**Example:**
```opam
version: "1.0.0"
          ^^^^^^ - Tagged as @definition.version
```

### 3. `@reference.dependency`
Captures package names in dependency-related fields:
- `depends` - Runtime dependencies
- `conflicts` - Conflicting packages
- `depopts` - Optional dependencies

Works with both plain package names and packages with version constraints.

**Examples:**
```opam
depends: [
  "ocaml"              # Tagged as @reference.dependency
  "dune" {>= "2.0"}    # Tagged as @reference.dependency
  "base" {>= "v0.14" & < "v0.16"}  # Tagged as @reference.dependency
]

conflicts: [
  "bad-package"        # Tagged as @reference.dependency
]

depopts: [
  "optional-lib"       # Tagged as @reference.dependency
]
```

### 4. `@definition.variable`
Generic fallback that captures all variable field names for navigation.

### 5. `@definition.section`
Captures section names like `build`, `install`, `url`.

## Testing

### Automated Test

Run the test script:

```bash
./test/test-tags.sh
```

This tests:
1. Package name is correctly tagged as `@definition.package`
2. Version is correctly tagged as `@definition.version`
3. All dependencies are correctly tagged as `@reference.dependency`
4. Build commands are NOT incorrectly tagged as dependencies

### Manual Testing

You can manually test the tags query using:

```bash
tree-sitter query queries/tags.scm test/example.opam
```

Or test against the dedicated tags test file:

```bash
tree-sitter query queries/tags.scm test/tags-test.opam
```

## Test Files

- **test/tags-test.opam** - Comprehensive test file covering all tag types
- **test/test-tags.sh** - Automated test script
- **test/example.opam** - Real-world example file

## Expected Output

When running the query on `test/tags-test.opam`, you should see:

- 1 `@definition.package` capture for "test-package"
- 1 `@definition.version` capture for "1.2.3"
- 7 `@reference.dependency` captures:
  - 4 from `depends`: "ocaml", "dune", "base", "lwt"
  - 2 from `conflicts`: "bad-package", "another-bad"
  - 1 from `depopts`: "optional-lib"
- Multiple `@definition.variable` captures for field names
- 0 incorrect captures from `build` or `install` sections

## Implementation Notes

The tags query uses predicates to filter matches:
- `(#eq? @_name "name")` - Exact match for specific field names
- `(#match? @_field "^(depends|conflicts|depopts)$")` - Regex match for dependency fields

This ensures that only relevant package names are tagged as dependencies, avoiding false positives from build commands or other string values.
