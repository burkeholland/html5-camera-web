define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'mylibs/customize/customize'
], ($, kendo, camera, customize) ->
		pub = 
			init: ->
				# get the camera stream. this throws up a popup window if the 
				# webRTC is not supported.
				camera.init("stream", "takePicture", "countdown", "videoDrawer")
				
				# initialilize the customize window
				customize.init("customize")

)
