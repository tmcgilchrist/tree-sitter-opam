import XCTest
import SwiftTreeSitter
import TreeSitterOpam

final class TreeSitterOpamTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_opam())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading opam grammar")
    }
}
