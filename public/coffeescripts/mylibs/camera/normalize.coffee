define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
], ($, kendo) ->

	# normalizes navigator.getUserMedia per @mtaylor

	# normalize the window URL
	window.URL or (window.URL = window.webkitURL or window.msURL or window.oURL)
	
	# detect if {video: true} or "video" style options
	# by creating an iframe and blowing it up
	# style jacked from @kangax
	navigator.getUserMedia or (navigator.getUserMedia = navigator.webkitGetUserMedia or navigator.mozGetUserMedia or navigator.msGetUserMedia)
	
	optionStyle = ((win) ->
	
		#only test if there is something to test
		return unless navigator.getUserMedia
	
		el = document.createElement("iframe")
		root = document.body or document.documentElement
	
		string = true
		object = true

		

		string: string
		object: object
			
	)(window)
	
	options = (opts) ->
	
		stringOptions = []
			  
		if optionStyle.string and not optionStyle.object
			
			for o of opts
				stringOptions.push o  if opts[o] is true
	    	
			stringOptions.join " "
	 
		else
		
			opts
	
	
)