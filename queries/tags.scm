; Tags for opam files

; Package name (the 'name' field)
(variable
  name: (ident) @_name
  (#eq? @_name "name")
  value: (atom
    (string) @name)) @definition.package

; Package version (the 'version' field)
(variable
  name: (ident) @_version
  (#eq? @_version "version")
  value: (atom
    (string) @name)) @definition.version

; Dependencies with options - matches package names in depends/conflicts/depopts
(variable
  name: (ident) @_field
  (#match? @_field "^(depends|conflicts|depopts)$")
  value: (list
    (option_value
      value: (atom
        (string) @name)))) @reference.dependency

; Plain dependencies - matches package names in depends/conflicts/depopts
(variable
  name: (ident) @_field
  (#match? @_field "^(depends|conflicts|depopts)$")
  value: (list
    (atom
      (string) @name))) @reference.dependency

; Generic variable definitions (for navigation)
(variable
  name: (ident) @name) @definition.variable

; Section definitions
(section
  kind: (ident) @name) @definition.section
