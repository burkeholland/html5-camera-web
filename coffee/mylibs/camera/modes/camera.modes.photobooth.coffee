define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera',
  'text!mylibs/camera/views/photostrip.html'
], ($, kendo, camera, photostrip) ->

	images = []
	camera = {}
	canvas = {}

	createStrip = (counter, images, ctx) ->

		image = new Image()
		image.src = images[counter]
		image.width = 200
		image.height = 150
		
		image.onload = ->

			y = (counter * 150) + ((counter * 10) + 10)
			ctx.drawImage(image, 10, y, image.width, image.height)


			if counter == images.length - 1
				draw(ctx)
			
			else
				createStrip(++counter, images, ctx)

	draw = (ctx) ->

		# get the image data from the canvas
		imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		ctx.putImageData(imgData, 0, 0)

		# save the image as a data url
		src = canvas.toDataURL("image/jpeg")

		div = $(photostrip)
		div.find("img").attr("src", src);

		$("#photobooth").append(div)

		div.kendoStop(true).kendoAnimate({ effects: "slideIn:down fadeIn", show: true, duration: 1000 });
		
	
	create = ( photoNumber ) ->

		if photoNumber > 0

			camera.countdown(3, -> 

				images.push(camera.capture())
				create(--photoNumber)
				
			)
		
		else
			
			counter = 0
	
			# TODO: Do i need to dispose of this?
			canvas = $("<canvas width=220 height=650 style=color:fff></canvas>").get(0)
			ctx = canvas.getContext("2d")

			ctx.fillStyle = "rgb(255,255,255)"
			ctx.fillRect(0, 0, 220, 650) 

			# for each image in our collection, add it to a canvas and then export the image
			createStrip(counter, images, ctx)
				
	
	pub = 
		
		init: ( theCamera ) ->
			
			# get a reference to the camera
			camera = theCamera
			
			# subscribe to the photobooth event
			$.subscribe("/camera/photobooth", ->
				
				# create the photobooth strip, passing in the number
				# of photos we want it to take
				images = []
		
				create(4, images);
			)	

)
