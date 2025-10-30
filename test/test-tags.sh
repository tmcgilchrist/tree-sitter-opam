#!/bin/bash
# Test script to validate tags queries

set -e

echo "Testing tags queries..."
echo

# Run the tags query
OUTPUT=$(tree-sitter query queries/tags.scm test/tags-test.opam 2>&1 | grep -v "Warning:" | grep -v "Please run" | grep -v "configuration")

# Test 1: Check for definition.package
echo "Test 1: Checking for @definition.package..."
if echo "$OUTPUT" | grep -q "definition.package.*test-package"; then
    echo "✓ PASS: Found package definition 'test-package'"
else
    echo "✗ FAIL: Package definition not found"
    exit 1
fi

# Test 2: Check for definition.version
echo "Test 2: Checking for @definition.version..."
if echo "$OUTPUT" | grep -q "definition.version.*1.2.3"; then
    echo "✓ PASS: Found version definition '1.2.3'"
else
    echo "✗ FAIL: Version definition not found"
    exit 1
fi

# Test 3: Check for all dependency references
echo "Test 3: Checking for @reference.dependency..."
DEPS=("ocaml" "dune" "base" "lwt" "bad-package" "another-bad" "optional-lib")
for dep in "${DEPS[@]}"; do
    if echo "$OUTPUT" | grep -q "name.*\"$dep\""; then
        echo "✓ PASS: Found dependency '$dep'"
    else
        echo "✗ FAIL: Dependency '$dep' not found"
        exit 1
    fi
done

# Test 4: Ensure build commands are NOT tagged as dependencies
echo "Test 4: Checking that build commands are not tagged as dependencies..."
if echo "$OUTPUT" | grep "reference.dependency" | grep -q "make"; then
    echo "✗ FAIL: Build command 'make' incorrectly tagged as dependency"
    exit 1
else
    echo "✓ PASS: Build commands not tagged as dependencies"
fi

echo
echo "All tags tests passed! ✓"
