define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera.events'
], ($, kendo, events) ->
	
	pub =
		
		init: (id, $controls) ->
	
			# check if getUserMedia exsists
			if navigator.webkitGetUserMedia
	
				# try and get the stream
				navigator.webkitGetUserMedia("video", 
	
				# we have the stream
				(stream) ->
					
					# initlialize camera events
					events.init($controls);
	
					# apply the stream to the video object
					video = document.getElementById(id)
					video.src = window.webkitURL.createObjectURL(stream)
	
				# webRTC is supported, but we did trying to get the stream
				(err) -> console.log("Your thing is not a thing."))
			
			else 
				
				# browser is unsupported or webRTC is not enabled. show snarky overlay.
				$("<div />")
					.kendoWindow({
						modal: true,
						title: "Soooo.....this is awkward."
					})
					.closest(".k-window").find(".k-window-actions").remove().end().end()
					.append(awkward)
					.data("kendoWindow")
						.center().open()
)
