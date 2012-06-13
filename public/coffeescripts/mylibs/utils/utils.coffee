define([
  'jQuery'  # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'mylibs/utils/BlobBuilder.min'
  'mylibs/utils/FileSaver.min'
  'mylibs/utils/canvg'
  'mylibs/utils/rgbcolor'
], ($, kendo) ->

    canvas = {}

    dataURIFromImg = (img) ->
            
        # create the drawing context
        ctx = canvas.getContext("2d")

        # draw the current video frame to a canvas
        ctx.drawImage(img, 0, 0, img.width, img.height)

        # get the image data from the canvas
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        ctx.putImageData(imgData, 0, 0)

        # save the image as a data url
        src = canvas.toDataURL("image/png")

    pub =
    
        blobFromDataURI: (dataURI) -> 
            
            if dataURI.split(',')[0].indexOf('base64') >= 0
                byteString = atob(dataURI.split(',')[1])
            else
                byteString = unescape(dataURI.split(',')[1])
            
            mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            
            ab = new ArrayBuffer(byteString.length, 'binary')
            
            ia = new Uint8Array(ab)
            
            for bytes in byteString
                ia[_i] = byteString.charCodeAt(_i)
            
            blobBuiler = new BlobBuilder()
             
            blobBuiler.append(ab);
            
            blob = blobBuiler.getBlob(mimeString)

        blobFromSrc: (src) ->

            uri = dataURIFromSrc(src)

            this.blobFromDataURI uri 
            

        blobFromImg: (img) ->
        
            canvas.width = img.width
            canvas.height = img.height
            
            uri = dataURIFromImg(img)

            blob = this.blobFromDataURI(uri) 

        init: -> 
            
            # initialize the drawing canvas
            canvas = document.createElement("canvas")

        getAnimationFrame: ->
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (callback, element) ->
                return window.setTimeout(callback, 1000 / 60)
)
