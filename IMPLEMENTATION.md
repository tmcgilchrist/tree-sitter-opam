# tree-sitter-opam Implementation Notes

## Overview

This is a fully-featured tree-sitter grammar for opam package manager files, built following the conventions from tree-sitter-dune and official tree-sitter grammars like tree-sitter-rust.

## Grammar Features

### Core Syntax Elements

1. **Variables**: `name: value` pairs
   - Field names (identifiers)
   - Values (atoms, lists, groups, options, operations)

2. **Sections**: Nested structures with optional names
   - `section { items }`
   - `section "name" { items }`

3. **Values**:
   - Atoms: identifiers, booleans, integers, strings
   - Lists: `[value1 value2 ...]`
   - Groups: `(value1 value2 ...)`
   - Options: `value {option1 option2}`

4. **Operations**:
   - Relational: `=`, `!=`, `>=`, `>`, `<=`, `<`, `~`
   - Logical: `&` (AND), `|` (OR)
   - Prefix: `!` (NOT), `?` (DEFINED)
   - Environment: `=`, `+=`, `=+`, `:=`, `=:`, `=+=`

5. **String Literals**:
   - Regular: `"string"`
   - Triple-quoted: `"""multi-line string"""`
   - Escape sequences: `\n`, `\r`, `\t`, `\\`, `\"`, `\xHH`, `\DDD`

6. **Comments**:
   - Line comments: `# comment`
   - Block comments: `(* comment *)`

### Design Decisions

1. **Conflict Resolution**: Added explicit conflict between `relop` and `envop` since both use `=`
2. **Precedence Levels**: Carefully ordered to match opam semantics
3. **String Handling**: Simplified triple-quoted string parsing to avoid unsupported regex lookahead
4. **Identifier Pattern**: Follows opam lexer spec: `(id | '_') ('+' (id | '_'))* (':' id)?`

## File Structure

```
tree-sitter-opam/
├── grammar.js              # Grammar definition
├── src/                    # Generated C parser
│   ├── parser.c
│   ├── grammar.json
│   └── node-types.json
├── queries/                # Editor integration
│   ├── highlights.scm      # Syntax highlighting
│   ├── injections.scm      # Language injections
│   └── tags.scm            # Symbol tagging
├── test/
│   ├── corpus/
│   │   └── basic.txt       # Test cases
│   └── example.opam        # Real-world example
├── bindings/               # Language bindings
│   ├── rust/
│   └── node/
└── package.json            # npm package configuration
```

## Testing

All tests passing at 100%:
- Simple variables
- Lists with options
- Nested structures
- Comments (line and block)
- Logical operations
- Environment bindings
- Prefix operations

Successfully parses real opam files from the opam repository.

## References

- opam file format: https://github.com/ocaml/opam/tree/master/src_ext/opam-file-format
- opam lexer: src_ext/opam-file-format/src/opamLexer.mll
- opam parser: src_ext/opam-file-format/src/opamBaseParser.mly

## Next Steps

Potential enhancements:
- Add more comprehensive test cases
- Shell command injection for build/install fields
- Integration with Emacs tree-sitter mode
- Publish to npm registry
