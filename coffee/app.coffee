define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'mylibs/camera/camera'
], ($, kendo, camera) ->
		pub = 
			init: ->
				# get the camera stream. this throws up a popup window if the 
				# webRTC is not supported.
				camera.init("stream", $("#controls"))

)
