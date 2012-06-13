define([
  # Load the original jQuery source file
  'order!libs/jquery/jquery.min',
  'order!libs/jquery/pubsub',
  'order!libs/jquery/bootstrap.min',
  'order!libs/jquery/jquery.masonry.min'
], ->
  # Tell Require.js that this module returns a reference to jQuery
  return $
)