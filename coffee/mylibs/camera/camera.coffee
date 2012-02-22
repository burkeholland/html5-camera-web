define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/camera/camera.events',
  'text!mylibs/camera/views/awkward.html'
], ($, kendo, events, awkward) ->
	
	normalize = () ->
		
		# normalizes navigatorGetUserMedia per @mtaylor

		window.URL or (window.URL = window.webkitURL or window.msURL or window.oURL)
		
		navigator.getUserMedia or (navigator.getUserMedia = navigator.webkitGetUserMedia or navigator.mozGetUserMedia or navigator.msGetUserMedia)
		
		optionStyle = ((win) ->
		
		  return unless navigator.getUserMedia
		
		  el = document.createElement("iframe")
		  root = document.body or document.documentElement
		  string = true
		  object = true
		
		  nop = ->

		  root.appendChild el
		  f = win.frames[win.frames.length - 1]
		  f.navigator.getUserMedia or (f.navigator.getUserMedia = f.navigator.webkitGetUserMedia or f.navigator.mozGetuserMedia or f.navigator.msGetUserMedia)
		  
		  try
		    f.navigator.getUserMedia
		      video: true
		    , nop
		  catch e
		    object = false
		    try
		      f.navigator.getUserMedia "video", nop
		    catch e
		      string = false
		  finally
		    root.removeChild el
		    el = null
		  string: string
		  object: object
		)(window)
		
		norm = (opts) ->
		
		  stringOptions = []
		
		  if optionStyle.string and not optionStyle.object
		    for o of opts
		      stringOptions.push o  if opts[o] is true
		    stringOptions.join " "
		  else
		    opts
	
	pub =
		
		init: (videoId, buttonId, countdownId, containerId) ->
	
			# initlialize camera events
			events.init(videoId, buttonId, countdownId, containerId);		
	
			# normalize the getUserMedia for cross browser
			norm = normalize()
			
			# check if getUserMedia exsists
			if navigator.getUserMedia
	
				$.publish("/camera/turnOn", [norm])
				
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
)
