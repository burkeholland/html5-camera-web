define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'text!mylibs/camera/views/snapshot.html',
  'mylibs/effects/effects',
  'mylibs/effects/presets'
], ($, kendo, camera, snapshot, effects, presets) ->
	
	# function globals
	$button = {}
	$video = {} 
	$container = {}
	$countdown = {}
	effectsList = []
	
	turnOn = (norm) ->
		
		hollaback = (stream) ->		  
			# we have the stream
			$video.attr("src", (if (window.URL and window.URL.createObjectURL) then window.URL.createObjectURL(stream) else stream))
			
		errback = ->

			# webRTC is supported, but we did trying to get the stream
			console.log("Your thing is not a thing.")

			video = document.getElementById("video")

		if navigator.getUserMedia

			navigator.getUserMedia norm(

				video: true
				audio: false

		 	), hollaback, errback

	captureImage = (callback) ->
	
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
		
		return src;
		
	attachSnapshot = (src) ->
		
		# get the template
		div = $(snapshot)

		# get the image element from the template assigning the source
		image = div.find("img")
					.attr("src", src) # assign the source
					.data("vintagesource", src)	# cache the original image
					.on("click", -> $.publish("/customize", [ effect, this ]) )	# bind the click event

		# append the image to the container
		div.appendTo($container)
		
		div.kendoStop(true).kendoAnimate({ effects: "slideIn:down fadeIn", show: true, duration: 1000 });
		
		applyEffect(div, image)

	applyEffect = (div, image) ->

		if effectsList.length == 0
			

		# make the drop down a kendo ui dropdown
		div.find(".presets").kendoDropDownList(
			dataSource:
				data: effectsList
			dataTextField: "preset"
			change: ->
				effects.applyPreset(image, this.value())
		)
		
	countdown = ( num, hollaback ) ->
		
		# get the counters element 
		counters = $countdown.find("span")
		index = counters.length - num
		
		# countdown to 1 before taking the image. fadeout numbers along the way.
		$(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
			if num > 1
				num--
				countdown( num, hollaback )
			else
				if $.isFunction( hollaback )
					hollaback()
		)
	
	startPhotoBooth = ->
		
	photoBooth = ( photoNumber ) ->
		
		if photoNumber > 0
			
			photoNumber--
			
			countdown(3, -> 
				
				images.push(captureImage())
							
				photoBooth(photoNumber)
			
			)
			

			
	pub = 
		
		init: (videoId, buttonsId, countdownId, containerId) ->
			
			# jump into the DOM and get the jQuery objects for the associated ids
			$video = $("##{videoId}")
			$container = $("##{containerId}")
			$countdown = $("##{countdownId}")
			
			# subscribe to the turn on event
			$.subscribe("/camera/turnOn", (norm) ->
				turnOn(norm)
			)
			
			# subscribe to the take picture event
			$.subscribe('/camera/takePicture', () ->
				countdown(3, captureImage(attachSnapshot))
			)
			
			# subscribe to the photobooth event
			$.subscribe("/camera/takePicturePB", () ->
				photoBooth(3)
			)
				
			
			# attach events to the controls element
			$("##{buttonsId}").on("click", "button", ->
				$.publish($(this).data("event"))
			)
	
)
