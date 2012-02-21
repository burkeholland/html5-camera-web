define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/customize/customize.events'
], ($, kendo, events) ->
	
	pub = 
		
		init: (containerId) ->
			
			#initialize events
			events.init(containerId)
			
)
