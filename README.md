# tree-sitter-opam

Tree-sitter grammar for [opam](https://opam.ocaml.org/) package manager files.

## Overview

This grammar provides syntax highlighting and parsing support for opam package definition files used in the OCaml ecosystem.

## Features

- Full support for opam file format (version 2.0+)
- Variables, sections, and nested structures
- Logical and relational operations
- Environment variable bindings
- Comments (both `#` line comments and `(* *)` block comments)
- String literals (regular and triple-quoted)

## Installation

Nothing published to package repositories just yet, it's still in development.

## Usage

### With tree-sitter CLI

```bash
tree-sitter parse example.opam
```

### With editors

#### Emacs

This grammar can be used with Emacs 29+ tree-sitter integration or with packages like `tree-sitter-mode`.

#### Neovim

Configure with `nvim-treesitter`:

```lua
parser_config.opam = {
  install_info = {
    url = "https://github.com/tmcgilchrist/tree-sitter-opam",
    files = {"src/parser.c"},
  },
  filetype = "opam",
}
```

## Development

### Testing

```bash
tree-sitter test
```

### Parsing a file

```bash
tree-sitter parse example.opam
```

### Playground

```bash
tree-sitter build --wasm
tree-sitter playground
```

## License

MIT
