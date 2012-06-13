define([
  'jQuery', # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'mylibs/utils/utils'
  'libs/webgl/effects'
  'libs/webgl/glfx.min'
], ($, kendo, utils, effects) ->
    
    $container = {}
    canvas = {}
    webgl = {}
    video = {}
    paused = true
    preview = {}
    width = 460
    height = 340
    frame = 0
    currentCanvas = {}
    
    draw = ->
        utils.getAnimationFrame()(draw)
        update()
        
    update = ->

        if not paused
            
            # get the 2d canvas context and draw the image
            # this happens at the curent framerate
            ###
            canvas2d = canvas.getContext('2d')
            canvas2d.clearRect()
            canvas2d.drawImage(video, 0, 0, video.width, video.height)
            ###
            
            frame = if frame == 200 then 0 else ++frame

            if preview.kind == "face"
                preview.filter(canvas, video)
            else
                preview.filter(webgl, video, frame)

    pub =
        
        init: (container, v) ->
            
            $container = $("##{container}")
            
            $header = $container.find(".header")
            $preview = $container.find(".body")
            $mask = $container.find(".mask")
            $footer = $container.find(".footer")

            video = v
            
            canvas = document.createElement("canvas")

            webgl = fx.canvas()

            # $preview.append(webgl)
            $preview.append(canvas)
            $preview.append(webgl)
            
            $.subscribe("/preview/show", (e) ->
                
                $.extend(preview, e)

                if preview.kind == "face"
                    $(webgl).hide()
                    $(canvas).show()
                    currentCanvas = canvas
                else
                    $(webgl).show()
                    $(canvas).hide()
                    currentCanvas = webgl

                #$.preview.find("canvas").remove()
                #$.preview.append(canvas)

                paused = false
                
                video.width = canvas.width =  width
                video.height = canvas.height = height
                
                $header.kendoStop(true).kendoAnimate({ effects: "fadeIn", show: true, duration: 500 })
                $preview.kendoStop(true).kendoAnimate({ effects: "zoomIn fadeIn", show: true, duration: 500})
                $footer.kendoStop(true).kendoAnimate({ effects: "slideIn:up fadeIn", show: true, duration: 500, complete: ->
                    $("footer").kendoStop(true).kendoAnimate({ effects: "fadeIn", show: true, duration: 200 })
                })
                
            )
            
            $container.find("#effects").click(->
                
                paused = true

                $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })
                $header.kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 500 })
                $preview.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })
                $footer.kendoStop(true).kendoAnimate({ effects: "slide:down fadeOut", hide: true, duration: 500 })
                
                $.publish("/previews/show")
                
            )
            
            # listen for the snapshot event
            $.subscribe "/preview/snapshot", ->
                
                callback = ->
                    
                    $mask.fadeIn 50, -> 
                        $mask.fadeOut 900
                        $.publish("/snapshot/create", [currentCanvas.toDataURL()])
                    
                $.publish("/camera/countdown", [3, callback])

            $.subscribe "/preview/photobooth", ->

                images = []
                photoNumber = 4

                callback = ->

                    --photoNumber

                    $mask.fadeIn 50, -> 
                        $mask.fadeOut 900, ->

                            if trackingFace
                                images.push canvas.toDataURL()
                            else
                                images.push webgl.toDataURL()

                            if photoNumber > 0

                                $.publish "/camera/countdown", [3, callback]

                            else

                                $.publish("/photobooth/create", [images])

                $.publish "/camera/countdown", [3, callback]
                        
            draw()
    
)
