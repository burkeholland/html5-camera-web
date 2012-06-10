define([
  'jQuery'	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'text!mylibs/photobooth/views/photostrip.html'
], ($, kendo, photostrip) ->

	images = []
	canvas = {}

	createStrip = (counter, images, ctx, width, height) ->

	    image = new Image()
	    image.src = images[counter]
	    image.width = width
	    image.height = height

	    image.onload = ->

	        y = (counter * height) + ((counter * 20) + 20)
	        ctx.drawImage(image, 20, y, image.width, image.height)

	        if counter == images.length - 1

	            # get the image data from the canvas
	            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	            
	            ctx.putImageData(imgData, 0, 0)

	            # save the image as a data url
	            src = canvas.toDataURL()

	            animation = effects: "slideIn:down fadeIn", show: true, duration: 1000 

	            $.publish "/pictures/create", [ src, null, false, true, animation, true ]

	        else

	            createStrip(++counter, images, ctx, width, height)
				
	
	pub = 
		
		init: ( width, height ) ->
			
			canvas = $("<canvas style=color:fff></canvas>")[0]
			
			# subscribe to the photobooth event
			$.subscribe "/photobooth/create", (images) ->

				counter = 0

				canvas.width = width + 40
				canvas.height = (height * images.length) + (images.length * 20) + 20 

				# TODO: Do i need to dispose of this?
				ctx = canvas.getContext("2d")

				ctx.fillStyle = "rgb(255,255,255)"
				ctx.fillRect(0, 0, canvas.width, canvas.height) 

				# for each image in our collection, add it to a canvas and then export the image
				img = createStrip(counter, images, ctx, width, height)
                            
                        

)
