# Solve Strategy

## Lexical References

By default, a lexical reference resolves to a variable, virtual or method slot, except where type expressions are expected. If the lexical reference does not resolve to either of these, then it can still resolve to a module or type.

As a convenience, to desambiguate namespace and local, the programmer may use the `n_` prefix to alias the module:

```
Imports n_App = App
App = New n_App.App
n_App.F App
```

## Conversions

When `CType` or `CTryCast` result into `ConversionValue`, adjust the corresponding properties: `byCType` and `byTryCast`.