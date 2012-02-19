define([
  # Load the original jQuery source file
  'order!libs/kendo/kendo.all.min'
], ->
  # Tell Require.js that this module returns a reference to jQuery
  return kendo
)
