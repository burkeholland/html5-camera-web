define([
  'jQuery'	# lib/jquery/jquery
  'Kendo' 	# lib/underscore/underscore
  'text!mylibs/customize/views/customize.html'
  'libs/webgl/glfx.min'
], ($, kendo, template) ->
	
	$window = {}
	webgl = fx.canvas()
	oldImage = new Image()
	canvas = {}	
	texture = {}
	callback = {}

	viewModel = kendo.observable
		
		effects:

			brightnessContrast:
				filter: "brightnessContrast"
				brightness:
					isParam: true
					value: 0
			
				contrast: 
					isParam: true
					value: 0

			vignette:
				filter: "vignette"
				size:
					isParam: true
					value: 0

				amount:
					isParam: true
					value: 0

			hueSaturation:
				filter: "hueSaturation"
				hue:
					isParam: true
					value: 0
				saturation: 
					isParam: true
					value: 0

			noise:
				filter: "noise"
				noise:
					isParam: true
					value: 0

			denoise:
				filter: "denoise"
				denoise:
					isParam: true
					value: 100
						

		change: ->

			webgl.draw(texture)

			filters = []

			for own key, value of viewModel.effects
				if (viewModel.effects[key].filter)

					filter = viewModel.effects[key]
					params = []

					for own key, value of filter
						if filter[key].isParam
							params.push(filter[key].value)

					filters.push({ name: filter.filter, params: params })

			console.info filters

			for filter in filters
				webgl[filter.name].apply(webgl, filter.params)
			
			webgl.update()

		yep: ->

			callback(webgl.toDataURL())
			$window.close()

		nope: ->

			$window.close()

		reset: ->

			this.set "effects.brightnessContrast.brightness.value", 0
			this.set "effects.brightnessContrast.contrast.value", 0
			this.set "effects.vignette.size.value", 0
			this.set "effects.vignette.amount.value", 0
			this.set "effects.hueSaturation.hue.value", 0
			this.set "effects.hueSaturation.saturation.value", 0


	customizeEffect = (image, saveFunction) ->

		viewModel.reset()

		oldImage.src = image.src

		# the save function comes from the caller
		callback = saveFunction
		
		oldImage.onload = ->

			canvas.width = oldImage.width
			canvas.height = oldImage.height

			ctx = canvas.getContext("2d")

			ctx.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height)

			texture = webgl.texture(canvas)

			webgl.draw(texture).update()

			$window.open().center()		

	pub = 
			
		init: (containerId) ->
			
			# subscribe to events
			$.subscribe('/customize', ( sender, saveFunction ) ->
				customizeEffect sender, saveFunction
			)

			$content = $(template)

			webgl.className = "reflection"

			canvas = document.createElement("canvas")

			$content.find(".canvas").append(webgl)

			$window = $content.kendoWindow
				visible: false
				modal: true
				title: ""
				open: ->
					$.publish("/app/pause")
				close: ->
					$.publish("/app/resume")
				animation: 
					open:
						effects: "slideIn:up fadeIn"
						duration: 500
					close:
						effects: "slide:up fadeOut"
						duration: 500
			.data("kendoWindow").center()

			kendo.bind($content, viewModel)
)
