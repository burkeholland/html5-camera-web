define([
  'jQuery' 	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'mylibs/camera/camera'
  'mylibs/snapshot/snapshot'
  'mylibs/photobooth/photobooth'
  'mylibs/controls/controls'
  'mylibs/customize/customize'
  'mylibs/effects/effects'
  'mylibs/utils/utils'
  'mylibs/file/file'
  'mylibs/share/share'
  'text!intro.html'
  'mylibs/pictures/pictures'
  'mylibs/preview/preview'
  'mylibs/preview/selectPreview'
], ($, kendo, camera, snapshot, photobooth, controls, customize, effects, utils, file, share, intro, pictures, preview, selectPreview) ->
	
		pub = 
		    
			init: ->
			    
			    # all UI elements as modules must be created as instances here
			    # in the application main controller file

		        # initalize the utils
				utils.init()
				
				$.subscribe('/camera/unsupported', ->
				    $('#pictures').append(intro)
				)
				
				# initialize the camera
				camera.init utils, "countdown", ->

					pictures.init("pictures")

					preview.init("camera", camera.video)

					# initialize the preview selection
					selectPreview.init("previews", camera.canvas, camera.video)

					# draw the video to the previews with webgl textures
					selectPreview.draw()

					# initialize snapshots 
					snapshot.init(preview, "pictures")

					$canvas = $('#screen')

					# initialize photobooth
					photobooth.init 460, 340

					# initialize the buttons
					controls.init("controls")

					# initialilize the customize window
					customize.init("customize")

					# initialize effects library
					effects.init()

					# initialize the file system
					file.init(50000)

)
