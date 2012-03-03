define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'mylibs/effects/presets'
], ($, kendo, presets) ->
	
	vintageDefaults = 
		vignette: 
			black:	0
			white:	0
		noise: 	false
		screen: 		
			blue: 	false
			green: 	false
			red: 	false
			strength: 0
		desaturate: 		false
		allowMultiEffect: 	true
		mime: 				'image/jpeg'
		viewFinder: 		false
		curves: 			false
		blur: 				false
		preset:				"custom"
		callback: ->
	
	
	updateImage = ($image, options, value) ->

		effect = vintageDefaults
	
		if options[0] == "vignette"
			effect.vignette[options[1]] = value
		else if options[0] == "screen"
			effect.screen[options[1]] = value
		else
			effect[options[0]] = value
	
		$image.vintage(effect)
		
	applyEffect = (effect) ->
		
		$image.vintage(effect)
	
	pub =
		
		init: ->			
			# subscribe to events
			$.subscribe("/image/update", ($image, effect, value) -> 
				updateImage($image, effect, value)
			)
		
		presets: ->
			
			preset: key for own key of presets.effects

					
		applyPreset: ($img, preset) ->
			
			$img.vintage(presets.effects[preset])
)
