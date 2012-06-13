# Filename: main.js

require.config(
  paths: 
    jQuery: 'libs/jquery/jquery'
    Kendo: 'libs/kendo/kendo'
    WebGL: 'libs/webgl/glfx'
)

require([

  # Load our app module and pass it to our definition function
  'app',

], (app) ->
	app.init()
)