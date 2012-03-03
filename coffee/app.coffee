define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'mylibs/customize/customize',
  'mylibs/effects/effects'
], ($, kendo, camera, customize, effects) ->
	
		pub = 
			init: ->
				# get the camera stream. this throws up a popup window if the 
				# webRTC is not supported.
				camera.init("stream", "controls", "countdown", "snapshots")
				
				# initialilize the customize window
				customize.init("customize")
				
				# initialize effects library
				effects.init()

)
