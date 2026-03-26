#include "tree_sitter/parser.h"

enum TokenType {
  BLOCK_COMMENT,
};

void *tree_sitter_opam_external_scanner_create(void) { return NULL; }

void tree_sitter_opam_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_opam_external_scanner_serialize(void *payload,
                                                     char *buffer) {
  return 0;
}

void tree_sitter_opam_external_scanner_deserialize(void *payload,
                                                   const char *buffer,
                                                   unsigned length) {}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

static void skip_whitespace(TSLexer *lexer) {
  while (lexer->lookahead == ' ' || lexer->lookahead == '\t' ||
         lexer->lookahead == '\n' || lexer->lookahead == '\r') {
    lexer->advance(lexer, true);
  }
}

bool tree_sitter_opam_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  if (!valid_symbols[BLOCK_COMMENT]) {
    return false;
  }

  skip_whitespace(lexer);

  // Look for '(' followed by '*'
  if (lexer->lookahead != '(') {
    return false;
  }
  advance(lexer);
  if (lexer->lookahead != '*') {
    return false;
  }
  advance(lexer);

  // We're inside a block comment at depth 1
  int depth = 1;

  while (depth > 0 && !lexer->eof(lexer)) {
    if (lexer->lookahead == '(') {
      advance(lexer);
      if (lexer->lookahead == '*') {
        advance(lexer);
        depth++;
      }
    } else if (lexer->lookahead == '*') {
      advance(lexer);
      if (lexer->lookahead == ')') {
        advance(lexer);
        depth--;
      }
    } else {
      advance(lexer);
    }
  }

  if (depth == 0) {
    lexer->result_symbol = BLOCK_COMMENT;
    return true;
  }

  return false;
}
