# Filename: main.js

require.config(
  paths: 
    jQuery: 'libs/jquery/jquery'
    Kendo: 'libs/kendo/kendo'
)

require([

  # Load our app module and pass it to our definition function
  'app',

  'order!libs/jquery/jquery.min',
  'order!libs/kendo/kendo.all.min'
], (app) ->
	app.init()
)