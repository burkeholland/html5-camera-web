define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'mylibs/effects/effects',
  'text!mylibs/camera/views/snapshot.html'
], ($, kendo, camera, effects, snapshot) ->
	
	camera = {}
	$container = {}
	
	create = ->
		
		camera.countdown(3, ->
			
			# capture returns a data url to an image
			src = camera.capture()
			
			# get the template
			div = $(snapshot)

			# get the image element from the template assigning the source
			image = div.find("img")
						.attr("src", src) # assign the source
						.data("vintagesource", src)	# cache the original image 
						.on("click", -> $.publish("/customize", [ this ]) )	# bind the click event

			# append the image to the container
			div.appendTo($container)

			presets = effects.presets();

			# make the drop down a kendo ui dropdown
			div.find(".presets").kendoDropDownList(
				dataSource:
					data: presets
				dataTextField: "preset"
				change: ->
					effects.applyPreset(image, this.value())
			)

			div.kendoStop(true).kendoAnimate({ effects: "slideIn:down fadeIn", show: true, duration: 1000 });
			
		)
	
	pub =
		
		init: ( theCamera, containerId ) ->
			
			camera = theCamera
			
			$container = $("##{containerId}")
			
			# listen for the snapshot event
			$.subscribe("/camera/snapshot", ->
				create()
			)
	
	
)
