define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'text!mylibs/camera/views/snapshot.html',
  'mylibs/effects/effects',
  'libs/vintage/vintage'
], ($, kendo, camera, snapshot, effects) ->
	
	# function globals
	$button = {}
	$video = {} 
	$container = {}
	$countdown = {}
	
	turnOn = ->
		
		# try and get the stream
		navigator.webkitGetUserMedia("video", 

			# we have the stream
			(stream) ->
			
				# apply the stream to the video object
				$video.attr("src", window.webkitURL.createObjectURL(stream))

		# webRTC is supported, but we did trying to get the stream
		(err) -> console.log("Your thing is not a thing."))
		
	
	captureImage = ->
		
		# empty the parent container
		$container.empty()
	
		# create a canvas for drawing to
		canvas = $("<canvas width='500' height='400'></canvas>").get(0)
	
		# get the video element
		video = document.getElementById("stream")
		
		# create the drawing context
		ctx = canvas.getContext("2d")
		
		# draw the current video frame to a canvas
		ctx.drawImage(video, 0, 0, video.width, video.height)

		# get the image data from the canvas
		imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		ctx.putImageData(imgData, 0, 0)
		
		# save the image as a data url
		src = canvas.toDataURL("image/jpeg")
		
		# apply the default presets
		applyEffect effect, src for effect in ["none", "vintage", "sepia", "green", "grayscale"]

	applyEffect = (effect, src) ->

		# get the template
		div = $(snapshot)

		# get the image element from the template assigning the source
		image = div.find("img")
					.attr("src", src)	# assign the source
					.on("click", -> $.publish("/customize", [ effect, this ]) )	# bind the click event

		# apply the effect to the image
		if effect != "none"
			effects.applyPreset(image, effect)

		# append the image to the container
		div.find(".caption").text(effect).
			end().appendTo($container)
	
		
	countdown = (num) ->
		
		# get the counters element 
		counters = $countdown.find("span")
		index = counters.length - num
		
		# countdown to 1 before taking the image. fadeout numbers along the way.
		$(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
			if num > 1
				num--
				countdown(num)
			else
				captureImage()
		)
	
	pub = 
		
		init: (videoId, buttonId, countdownId, containerId) ->
			
			# jump into the DOM and get the jQuery objects for the associated ids
			$button = $("##{buttonId}")
			$video = $("##{videoId}")
			$container = $("##{containerId}")
			$countdown = $("##{countdownId}")
			
			# subscribe to the turn on event
			$.subscribe("/camera/turnOn", () ->
				turnOn()
			)
			
			# subscribe to the take picture event
			$.subscribe('/camera/takePicture', () ->
				countdown(3)
			)
			
			# attach events to the controls element
			$button.on("click", ->
				$.publish($(this).data("event"))
			)
	
)
