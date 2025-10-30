package tree_sitter_opam_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_opam "github.com/tmcgilchrist/tree-sitter-opam/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_opam.Language())
	if language == nil {
		t.Errorf("Error loading opam grammar")
	}
}
