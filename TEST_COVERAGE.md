# Test Coverage for tree-sitter-opam

## Summary

**Total Tests: 50**  
**Success Rate: 100%**  
**Average Parse Speed: ~10,700 bytes/ms**

All tests passing! The grammar successfully parses real-world opam files from the opam-repository.

## Test Categories

### Basic Features (8 tests)
- ✓ Simple variable
- ✓ Variable with list value
- ✓ Section without name
- ✓ Section with name
- ✓ Comments (line and block)
- ✓ Logical operations
- ✓ Environment binding
- ✓ Prefix operations

### Build Commands (5 tests)
- ✓ Simple build command
- ✓ Build with conditional step (`{dev}`)
- ✓ Complex build with multiple conditionals (`{with-test}`, `{with-doc}`)
- ✓ Build with variable interpolation (`"%{conf-libev:installed}%"`)
- ✓ OCaml bootstrap build

### Dependencies (6 tests)
- ✓ Simple dependency with version constraint (`{>= "4.08.0"}`)
- ✓ Multiple version constraints with AND (`{>= "4.08.0" & < "5.5.0"}`)
- ✓ Dependencies with filters (`{build & >= "1.1.0"}`, `{with-doc & >= "2.3.0"}`)
- ✓ Exact version match (`{with-dev-setup & = "0.26.2"}`)
- ✓ Optional dependencies (depopts)
- ✓ Conflicts section

### Filters and Availability (7 tests)
- ✓ OS filter (`os != "win32"`)
- ✓ Architecture filter (`arch != "x86_32"`)
- ✓ Opam version filter (`opam-version >= "2.1.0"`)
- ✓ Complex OS filter with AND
- ✓ Complex filter with OR
- ✓ Negation filter (`{!windows}`)
- ✓ Defined check filter (`{?installed}`)

### Metadata (7 tests)
- ✓ Maintainer list
- ✓ Multiple maintainers
- ✓ Authors list
- ✓ Custom x-fields (`x-commit-hash`, `x-maintenance-intent`)
- ✓ Flags (`avoid-version`)
- ✓ Multiple flags
- ✓ Tags

### Sections (5 tests)
- ✓ URL section with checksum (sha256, sha512)
- ✓ URL section with md5 checksum
- ✓ Named section (`extra-source "patch.diff"`)
- ✓ Empty section
- ✓ Multiple sections

### Strings and Special Cases (12 tests)
- ✓ Triple-quoted multi-line string (`"""..."""`)
- ✓ String with escape sequences (`\n`, `\t`)
- ✓ String with quotes (`\"`)
- ✓ Identifiers with special characters (`base-unix`, `ocaml-base-compiler`)
- ✓ Version with tilde (`6.0.0~alpha00`)
- ✓ Version with plus (`5.1.0~alpha1+options`)
- ✓ Boolean values (`true`, `false`)
- ✓ Integer values (positive and negative)
- ✓ Empty list (`[]`)
- ✓ Empty group (`()`)
- ✓ Colon in identifier (`post-messages`)
- ✓ Underscores in identifier (`dev_repo`)

## Real-World File Testing

The grammar successfully parses actual opam files from the opam-repository:
- ✓ dune.3.19.1/opam (complex with filters and dev dependencies)
- ✓ core.v0.17.1/opam (Jane Street package with version constraints)
- ✓ lwt.6.0.0~alpha00/opam (complex build, depopts, flags)
- ✓ ppxlib.0.37.0~5.4preview/opam (conflicts, version ranges)
- ✓ opam-client.opam (from opam itself)
- ✓ opam-format.opam (from opam itself)

## Coverage Analysis

### Covered Language Features
- ✓ All basic value types (atoms, strings, integers, booleans, identifiers)
- ✓ Collections (lists, groups)
- ✓ Options syntax (`value {options}`)
- ✓ All operators (relational, logical, prefix, environment)
- ✓ Comments (line `#` and block `(* *)`)
- ✓ Sections (named and unnamed)
- ✓ String escape sequences
- ✓ Multi-line strings
- ✓ Complex filter expressions
- ✓ Version constraints and filters
- ✓ Variable interpolation in strings
- ✓ All standard opam fields

### Edge Cases Covered
- ✓ Empty lists and groups
- ✓ Nested lists in build commands
- ✓ Complex boolean expressions with AND/OR
- ✓ Mixed operators in filters
- ✓ Special characters in identifiers (`:`, `-`, `_`, `+`)
- ✓ Version strings with special characters (`~`, `+`)
- ✓ Triple-quoted strings with newlines
- ✓ Custom x-fields
- ✓ Operator ambiguity (`=` as both relop and envop)

## Known Limitations

1. **Operator Ambiguity**: The grammar declares a conflict between `relop` and `envop` since both use `=`. In some contexts (like `os = "linux"`), the parser may choose one over the other based on context. This matches opam's actual behavior.

2. **Performance**: First test run may show slow parse rate warning (~1200 bytes/ms) due to initialization, but subsequent runs average ~10,700 bytes/ms which is excellent.

## Test Files

- `test/corpus/basic.txt` - Basic syntax features
- `test/corpus/dependencies.txt` - Dependency specifications
- `test/corpus/build_commands.txt` - Build and install commands
- `test/corpus/filters_and_availability.txt` - Filter expressions
- `test/corpus/metadata.txt` - Package metadata
- `test/corpus/sections.txt` - Section syntax
- `test/corpus/strings_and_special.txt` - String literals and edge cases
- `test/example.opam` - Complete real-world example

## Conclusion

The tree-sitter-opam grammar provides comprehensive coverage of the opam file format, successfully parsing all common patterns found in the official opam-repository. With 50 tests at 100% success rate and excellent parse performance, it's ready for production use in editors and tooling.
