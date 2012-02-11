self = this
$ = jQuery
self.app = do ($) ->
		effects = ["none", "default", "sepia", "grayscale", "green"]
		img = ""
		
		startCamera = () ->
			
			if !navigator.webkitGetUserMedia
			
				$("#main").hide()
				
				sorry = $("#templates").find("#sorry").clone()
			
				$("body").append(sorry)
			
			else 
				
				$("#main").show()
			
				navigator.webkitGetUserMedia("video", 
				(stream) ->
					video = document.getElementById("stream")
					video.src = window.webkitURL.createObjectURL(stream)
				(err) -> console.log("Your thing is not a thing."))
			
		customize = (sender) ->
		
			content = kendo.template($("#customizeTemplate").html())
		
			$("#customize").html(content(sender.src))
			
			win = $("#customize").data("kendoWindow")
			
			win.open().center()
			
		fadeInOut = (num) ->
			
			counters = $("#countdown h1")
			index = counters.length - num
			
			$(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
				if num > 1
					num--
					fadeInOut(num)
				else
					pub.takePicture()
			)
		
		pub = 
		
			init: () ->
			
				# create the customize window
				$("#customize").kendoWindow({ visible: false, modal: true })
		
				# attach event listeners to the video drawer
				$("#videoDrawer").delegate("img", "click", -> customize(this))
		
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
					$(image).vintage({ preset: effect })
					
				
			 	
	 	
		