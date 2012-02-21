define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'libs/vintage/vintage'
], ($, kendo) ->
	
	pub =
		init: ->
					
		applyPreset: ($img, preset) ->
			
			$img.vintage(preset: preset)
			
		updateImage: (effect) ->
			
			$image.vintage(effect)
)
