define([
  'jQuery',	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'mylibs/effects/effects'
  'mylibs/file/file'
  'mylibs/share/twitpic'
  'text!mylibs/pictures/views/picture.html'
], ($, kendo, effects, file, twitpic, picture) ->
	
	$container = {}

	pub = 
		
		init: (containerId) ->
			
			$container = $("##{containerId}")

			$container.masonry()

			$.subscribe "/pictures/reload", ->

				pub.reload()

			$.subscribe "/pictures/create", (src, name, polaroid, save, animation, photoStrip) ->

				# get the template
				$div = $(picture)

				# get the image element from the template assigning the source
				$img = $div.find(".picture")
					.attr("src", src) # assign the source 
					.css("opacity", 1)

				if save
					name = name || new Date().getTime() + ".png"
					if photoStrip
						name = "p_" + name
					file.save name, src

				# this callback is used to set the img source from the customize window
				callback = ->
					$img.attr "src", arguments[0] 
					file.save name, arguments[0]

				#if not name.substring(0,1) == "p"
				$img.on("click", -> $.publish("/customize", [ this, callback ]) ) # bind the click event
				$img.addClass("pointer")

				$img.load ->

					$container.masonry("reload")

				presets = effects.presets()

				if polaroid

					opacity = 0;

					$.subscribe "/shake/beta", -> 
						opacity = parseFloat($wrap.css("opacity"))
						if opacity < 1
							opacity = opacity + .03
							$img.css("opacity", opacity)
						else 
							$.unsubscribe("/shake/beta")

				else
					
					if save

						file.save name, $img.attr("src")
		
				# add the source to the download link
				$div.on("click", ".download", ->
		    		file.download $img[0]
				)	
		
		
				$div.on("click", ".tweet", ->
		    		intent = new Intent("http://webintents.org/share", "image/*", $img.attr("src"))
		    		window.navigator.startActivity(intent, (data) ->)
				)

				$div.on "click", ".trash", ->

					$.subscribe "/file/deleted/#{name}", ->

						$div.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500, complete: ->
							$div.remove()
							$container.masonry "reload"
						})

						$.unsubscribe("file/deleted/#{name}")

					file.delete(name)

				$container.append($div)

		reload: ->

			$container.masonry("reload")
	
)
