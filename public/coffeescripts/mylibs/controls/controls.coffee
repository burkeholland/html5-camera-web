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
			
			$controls.on("change", "input", (e) -> 
                # listen for the polaroid check change
                $.publish( "/polaroid/change", [e] )
			)
			
			# check to see if device orientation is supported
			if window.DeviceOrientationEvent || window.OrientationEvent
			    
			    # show the polaroid opt-in
			    $(".polaroid-container").show();
			    
    			previousAlpha = 0
    			previousGamma = 0
    			previousBeta = 0
			
    			#Listen for the deviceorientation event and handle the raw data
    			window.addEventListener('deviceorientation', (eventData) ->
    			# gamma is the left-to-right tilt in degrees, where right is positive
    				if (eventData.gamma - previousGamma) > 40 or (previousGamma - eventData.gamma) > 40 
    					$.publish("/shake/gamma")
    				if (eventData.beta - previousBeta) > 40 or (previousBeta - eventData.beta) > 40
    					$.publish("/shake/beta")
    			, false);
)
