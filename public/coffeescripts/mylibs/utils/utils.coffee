define([
  'jQuery'  # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'mylibs/utils/BlobBuilder.min'
  'mylibs/utils/FileSaver.min'
  'mylibs/utils/canvg'
  'mylibs/utils/rgbcolor'
], ($, kendo) ->
    
    canvas = {}

    pub =
    
        init: -> 
            
            # initialize the drawing canvas
            canvas = document.createElement("canvas")
            
            canvas.toDataURI = (el) ->
                
                # create the drawing context
                ctx = canvas.getContext("2d")

                # draw the current video frame to a canvas
                ctx.drawImage(el, 0, 0, el.width, el.height)

                # get the image data from the canvas
                imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                ctx.putImageData(imgData, 0, 0)

                # save the image as a data url
                src = canvas.toDataURL("image/jpeg")
    
        # prep the image for download by making it a blob
        toArray: (list) ->

            Array.prototype.slice.call list || [], 0
            

        elToDataURI: (el) ->
            
            canvas.width = el.width
            canvas.height = el.height
            
            canvas.toDataURI(el)
            
        svgToDataURI: (svg) ->
            
                svg_xml = (new XMLSerializer()).serializeToString(svg);
            
                # load '../path/to/your.svg' in the canvas with id = 'canvas'
                canvg(canvas, svg_xml)

                # save the image as a data url
                src = canvas.toDataURL("image/jpeg")
                
        getAnimationFrame: ->
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (callback, element) ->
                return window.setTimeout(callback, 1000 / 60)
)
