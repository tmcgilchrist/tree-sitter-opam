/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * Tree-sitter grammar for opam package manager files
 *
 * Based on opam file format specification from:
 * https://github.com/ocaml/opam/tree/master/src_ext/opam-file-format
 */

const PREC = {
  COMMENT: 0,
  STRING: 1,
  ATOM: 2,
  PFXOP: 3,
  RELOP: 4,
  ENVOP: 5,
  AND: 6,
  OR: 7,
  OPTION: 8,
};

module.exports = grammar({
  name: 'opam',

  extras: ($) => [$.comment, /\s+/],

  conflicts: ($) => [
    [$.relop, $.envop],
  ],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) => choice($.variable, $.section),

    // Variables: ident: value
    variable: ($) =>
      seq(
        field('name', $.ident),
        ':',
        field('value', $.value),
      ),

    // Sections: ident { items } or ident "string" { items }
    section: ($) =>
      seq(
        field('kind', $.ident),
        optional(field('name', $.string)),
        '{',
        field('items', repeat($._item)),
        '}',
      ),

    // Values
    value: ($) =>
      choice(
        $.atom,
        $.group,
        $.list,
        $.option_value,
        $.logop_value,
        $.relop_value,
        $.env_binding,
        $.prefix_relop,
        $.pfxop_value,
      ),

    // Atoms (base values)
    atom: ($) => choice($.ident, $.bool, $.int, $.string),

    // Groups: (value1 value2 ...)
    group: ($) =>
      prec(
        PREC.ATOM,
        seq('(', field('values', repeat($.value)), ')'),
      ),

    // Lists: [value1 value2 ...]
    list: ($) =>
      prec(
        PREC.ATOM,
        seq('[', field('values', repeat($.value)), ']'),
      ),

    // Options: value {value1 value2 ...}
    option_value: ($) =>
      prec.right(
        PREC.OPTION,
        seq(
          field('value', $.value),
          '{',
          field('options', repeat($.value)),
          '}',
        ),
      ),

    // Logical operations: value & value, value | value
    logop_value: ($) =>
      choice(
        prec.left(
          PREC.AND,
          seq(field('left', $.value), '&', field('right', $.value)),
        ),
        prec.left(
          PREC.OR,
          seq(field('left', $.value), '|', field('right', $.value)),
        ),
      ),

    // Relational operations: atom relop atom
    relop_value: ($) =>
      prec(
        PREC.RELOP,
        seq(
          field('left', $.atom),
          field('operator', $.relop),
          field('right', $.atom),
        ),
      ),

    // Environment bindings: atom envop atom
    env_binding: ($) =>
      prec(
        PREC.ENVOP,
        seq(
          field('variable', $.atom),
          field('operator', $.envop),
          field('value', $.atom),
        ),
      ),

    // Prefix relational operators: relop atom (e.g., < "4.07.0")
    prefix_relop: ($) =>
      prec(
        PREC.RELOP,
        seq(field('operator', $.relop), field('value', $.atom)),
      ),

    // Prefix operators: !value, ?value
    pfxop_value: ($) =>
      prec(
        PREC.PFXOP,
        seq(field('operator', $.pfxop), field('value', $.value)),
      ),

    // Relational operators: =, !=, >=, >, <=, <, ~
    relop: ($) => choice('=', '!=', '>=', '>', '<=', '<', '~'),

    // Logical operators (already covered inline)

    // Prefix operators: !, ?
    pfxop: ($) => choice('!', '?'),

    // Environment update operators: =, +=, =+, :=, =:, =+=
    envop: ($) => choice('=', '+=', '=+', ':=', '=:', '=+='),

    // Boolean literals
    bool: ($) => choice('true', 'false'),

    // Integer literals
    int: ($) => token(seq(optional('-'), /[0-9_]+/)),

    // String literals
    string: ($) =>
      choice(
        // Regular quoted string
        seq(
          '"',
          repeat(choice($._string_content, $.escape_sequence)),
          '"',
        ),
        // Triple-quoted string (simplified handling)
        seq('"""', alias(repeat(choice($._string_content_triple, $.escape_sequence)), 'string_content'), '"""'),
      ),

    _string_content: ($) =>
      token.immediate(prec(PREC.STRING, /[^"\\]+/)),

    _string_content_triple: ($) =>
      token.immediate(prec(PREC.STRING, choice(
        /[^"\\]+/,
        /"[^"]/,
        /""[^"]/,
      ))),

    escape_sequence: ($) =>
      token.immediate(
        prec(
          PREC.STRING,
          seq(
            '\\',
            choice(
              /[\\'"nrtb ]/,
              /[0-9]{3}/,
              /x[0-9a-fA-F]{2}/,
              /\r?\n[ \t]*/,
            ),
          ),
        ),
      ),

    // Identifiers
    ident: ($) => {
      // ichar = alpha | digit | ['_' '-']
      // id = ichar* alpha ichar*
      // ident = (id | '_') ('+' (id | '_'))* (':' id)?
      const id = /[a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/;

      // Simplified pattern for identifiers
      return token(
        seq(
          choice(id, '_'),
          repeat(seq('+', choice(id, '_'))),
          optional(seq(':', id)),
        ),
      );
    },

    // Comments
    comment: ($) =>
      choice(
        // Line comments starting with #
        token(prec(PREC.COMMENT, seq('#', /[^\n]*/))),
        // Block comments (* ... *)
        token(prec(PREC.COMMENT, seq('(*', /[^*]*\*+(?:[^)*][^*]*\*+)*/, ')'))),
      ),
  },
});
