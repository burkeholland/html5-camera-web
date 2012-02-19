define([
  # Load the original jQuery source file
  'order!libs/jquery/jquery.min',
  'order!libs/jquery/pubsub'
], ->
  # Tell Require.js that this module returns a reference to jQuery
  return $
)