define([
  # Load the original jQuery source file
  'order!libs/jquery/jquery.min',
  'order!libs/jquery/pubsub',
  'order!libs/jquery/vintage'
], ->
  # Tell Require.js that this module returns a reference to jQuery
  return $
)