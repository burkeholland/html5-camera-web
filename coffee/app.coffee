self = this
$ = jQuery
self.app = do ($) ->
		effects = ["none", "default", "sepia", "grayscale", "green"]
		img = ""
		
		vintageDefaults = 
			vignette: 
				black:	0
				white:	0
			noise: 				false
			screen: 			
				blue: false
				green: false
				red: false
			desaturate: 		false
			allowMultiEffect: 	true
			mime: 				'image/jpeg'
			viewFinder: 		false
			curves: 			false
			blur: 				false
			callback: ->
				$('#saveImage').removeClass('disabled');
					
		startCamera = () ->
			
			if navigator.webkitGetUserMedia
			
				navigator.webkitGetUserMedia("video", 
				(stream) ->
					video = document.getElementById("stream")
					video.src = window.webkitURL.createObjectURL(stream)
				(err) -> console.log("Your thing is not a thing."))
			
			else 
				
				$("<div />")
					.kendoWindow({
						modal: true,
						title: "Soooo.....this is awkward."
					})
					.closest(".k-window").find(".k-window-actions").remove().end().end()
					.append($("#templates").find("#sorry").clone())
					.data("kendoWindow")
						.center().open()
			
		customize = () ->
		
			$image = $(this)
		
			content = kendo.template($("#customizeTemplate").html())
		
			$("#customize").html(content($image.attr("src")))
			
			vintage = $image.data("vintage");
			
			$(".slider").each( -> 
			
				$slider = $(this)
			
				optionValue = vintage ? 0
				options = $slider.data("option").split(".")
			
				if $.isObject
					$.each(options, ->
						optionValue = optionValue[this]
					)
				
				$slider.kendoSlider({
					min: $slider.data("min") ? 0,
					max: $slider.data("max") ? 10,
					smallStep: parseFloat($slider.data("smallstep")) ? 1,
					largeStep: parseFloat($slider.data("largestep")) ? 5,
					value: optionValue,
					tickPlacement: "none",
					change: (value) -> 
						updateImage($image, vintage, options, value)
				})
			)
			
			win = $("#customize").data("kendoWindow")
			
			win.open().center()
			
		fadeInOut = (num) ->
			
			counters = $("#countdown span")
			index = counters.length - num
			
			$(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
				if num > 1
					num--
					fadeInOut(num)
				else
					pub.takePicture()
			)
			
		updateImage = ($image, vintage, options, e) ->
			
			effect = vintageDefaults
			
			if options[0] == "vignette"
				effect.vignette[options[1]] = e.value
			else if options[0] == "screen"
				effect.screen[options[1]] = e.value
			else
				effect[options[0]] = e.value
			
			img = ("#preview");
			$(img).vintage(effect)
				
		pub = 
		
			init: () ->
			
				# create the customize window
				$("#customize").kendoWindow({ visible: false, modal: true })
		
				# attach event listeners to the video drawer
				$("#videoDrawer").delegate("img", "click", -> customize.call(this))
		
				# compile templates
				content = kendo.template($("#customizeTemplate").html())
		
				# fire up the camera
				startCamera()


			startCountdown: (startVal) ->
				
				fadeInOut(3)

			takePicture: ->
				
				$("#videoDrawer").empty()
			
				video = document.getElementById("stream")
				canvas = document.getElementById("canvas")
				
				ctx = canvas.getContext("2d")
				cw = canvas.clientWidth
				ch = canvas.clientHeight
				
				ctx.drawImage(video, 0, 0, cw, ch)

				img    = canvas.toDataURL("image/png")

				pub.applyEffect effect for effect in effects
				
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
			applyEffect: (effect) ->
				
				div = $("#templates").find(".image").clone()
				
				image = div.find("img")
				caption = div.find(".caption")
				
				image.attr("src", img)
				
				image.kendoDraggable({ hint: -> $("#draggable").clone() })
				
				caption.html(effect)
						
				$("#videoDrawer").append(div)
				
				options = {}
				if effect != "none"
					$(image).vintage({ 
						preset: effect, 
						callback: ->
							$(image).data("vintage", this)
					})
				
			 	
	 	
		
