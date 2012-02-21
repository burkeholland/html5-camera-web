define([
  'jQuery',	# lib/jquery/jquery
  'Kendo', 	# lib/underscore/underscore
  'text!mylibs/customize/views/customize.html'
], ($, kendo, template) ->
	
	# function globals
	$window = {}
	
	customizeEffect = (sender) ->
		
		$image = $(sender)
	
		content = kendo.template(template)
	
		$window.element.empty()
						.append(content($image.attr("src")))
		
		vintage = $image.data("vintage");
		
		$(content).find(".slider").each( -> 
		
			$slider = $(this)
		
			optionValue = vintage ? 0
			options = $slider.data("option").split(".")
		
			if $.isObject
				$.each(options, ->
					optionValue = optionValue[this]
				)
			
			$preview = $("#preview")
			
			$slider.kendoSlider({
				min: $slider.data("min") ? 0,
				max: $slider.data("max") ? 10,
				smallStep: parseFloat($slider.data("smallstep")) ? 1,
				largeStep: parseFloat($slider.data("largestep")) ? 5,
				value: optionValue,
				tickPlacement: "none",
				change: (value) -> 
					$.publish("/image/update", [ $preview, options, value.value ])
			})
		)
		
		$window.open().center()
	
	pub = 
		
		init: (containerId) ->
			
			# jump in the DOM and grab elements
			# $container = $("##{containerId}")
			
			# subscribe to events
			$.subscribe('/customize', ( effect, sender ) ->
				customizeEffect( sender )
			)
			
			# create the customize window
			$window = $("<div id='customize'></div>").kendoWindow( 
				visible: false
				modal: true 
				title: "Customize Your Image"
				animation: 
					open:
						effects: "slideIn:right fadeIn"
						duration: 500
					close:
						effects: "slide:right fadeOut"
						duration: 500
			).data("kendoWindow").center()
)