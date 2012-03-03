define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/normalize',
  'mylibs/controls/controls',
  'mylibs/camera/modes/camera.modes.snapshot',
  'mylibs/camera/modes/camera.modes.photobooth',
  'text!mylibs/camera/views/awkward.html'
], ($, kendo, normalize, controls, snapshot, photobooth, awkward) ->

	$counter = {}
	canvas = {}
	video = {}

	
	# draw the stream to the canvas at the max framerate
	draw = (canvas, ctx, video) ->
			
		ctx.drawImage(video, 0, 0, video.width, video.height)

	turnOn = () ->

		hollaback = (stream) ->		  
	
			# $video = $("<video id='stream' width='500' height='400'></video>")
			# $("#video").append($video)
			
			video = document.createElement("video")
			videoDiv = document.createElement('div')
			document.body.appendChild(videoDiv)
			
			videoDiv.appendChild(video)
     
			videoDiv.setAttribute("style", "display:none;")
			
			canvas = document.getElementById("screen")
			
			video.width = canvas.width
			video.height = canvas.height
				
			# we have the stream
			$(video).attr("src", if (window.URL and window.URL.createObjectURL) then window.URL.createObjectURL(stream) else stream)
			# $(video).attr("prop", if (window.URL and window.URL.createObjectURL) then window.URL.createObjectURL(stream) else stream)
			
			ctx = canvas.getContext('2d')
			
			# start the video
			video.play()
			
			window.setInterval(->
				draw(canvas, ctx, video)
			, 1000 / 67)
		
		errback = ->

			# webRTC is supported, but we did trying to get the stream
			console.log("Your thing is not a thing.")

		if navigator.getUserMedia

			navigator.getUserMedia normalize(

				video: true
				audio: false

		 	), hollaback, errback

	pub =
		
		init: (videoId, buttonsId, countdownId, containerId) ->
			
			# check if getUserMedia exsists
			if navigator.getUserMedia
	
				# jump into the DOM and grab the needed elements
				$counter = $("##{countdownId}")
	
				# initialize the controls element
				controls.init(buttonsId)
	
				# intitalize snapshot mode
				snapshot.init(this, containerId);
				
				# initialize photobooth mode
				photobooth.init(this);
	
				# turn on the camera
				turnOn()
				
			else 
				
				# browser is unsupported or webRTC is not enabled. show snarky overlay.
				$window = $("<div />")
					.kendoWindow(
						visible: false
						modal: true
						title: "Soooo.....this is awkward."
					 )
					.closest(".k-window").find(".k-window-actions").remove().end().end()
					.append(awkward)
					.data("kendoWindow")
						.center().open()
		
		countdown: ( num, hollaback ) ->

			# get the counters element 
			counters = $counter.find("span")
			index = counters.length - num

			# countdown to 1 before taking the image. fadeout numbers along the way.
			$(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
				if num > 1
					num--
					pub.countdown( num, hollaback )
				else
					$(canvas).fadeOut(500).fadeIn(300, -> 
						$(canvas).show()
					
						if $.isFunction( hollaback )
							hollaback()
					)
			)
			
		capture: (callback) ->

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
)
