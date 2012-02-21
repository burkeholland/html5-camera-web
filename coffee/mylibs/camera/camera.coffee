define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera.events',
  'text!mylibs/camera/views/awkward.html'
], ($, kendo, events, awkward) ->
	
	pub =
		
		init: (videoId, buttonId, countdownId, containerId) ->
	
			# initlialize camera events
			events.init(videoId, buttonId, countdownId, containerId);		
	
			# check if getUserMedia exsists
			if navigator.webkitGetUserMedia
	
				$.publish("/camera/turnOn")
				
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
