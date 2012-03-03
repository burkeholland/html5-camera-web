define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
], ($, kendo) ->
	
	pub = 
		
		init: ( controlsId ) ->
			
			$controls = $("##{controlsId}")
		
			# listen for the button click events
			$controls.on("click", "button", ->
				$.publish($(this).data("event"))
			)
)
