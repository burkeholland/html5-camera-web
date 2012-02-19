define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera'
], ($, kendo) ->
	
	captureImage = ->
		
		$("#videoDrawer").empty()
	
		canvas = $('<canvas></canvas>').get(0)
	
		video = document.getElementById("stream")
		
		ctx = canvas.getContext("2d")
		cw = canvas.clientWidth
		ch = canvas.clientHeight
		
		ctx.drawImage(video, 0, 0, cw, ch)

		img = canvas.toDataURL("image/png")
				
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		$("#videoDrawer").append($('<img></img>').attr('src', img))
	
	pub = 
		
		init: ($controls) ->
			
			# subscribe to the take picture event
			$.subscribe('/camera/takePicture', (pub) ->
				pub.takePicture(true)
			)
			
			# attach events to the controls element
			$controls.on("click", "button", ->
				$.publish($(this).data("event"), [pub])
			)
			
		takePicture: (countdown) ->

			if (countdown)

				captureImage()
	
)
