; Highlights for opam files

; Comments
(comment) @comment

; Keywords (field names)
(variable name: (ident) @keyword)
(section kind: (ident) @keyword)

; Strings
(string) @string
(escape_sequence) @string.escape

; Numbers
(int) @number

; Booleans
(bool) @boolean

; Operators
(relop) @operator
(pfxop) @operator
(envop) @operator
"&" @operator
"|" @operator

; Punctuation
["{" "}"] @punctuation.bracket
["[" "]"] @punctuation.bracket
["(" ")"] @punctuation.bracket
":" @punctuation.delimiter

; Identifiers (variable values)
(ident) @variable
