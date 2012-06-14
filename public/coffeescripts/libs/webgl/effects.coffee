define([
  'jQuery', # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'libs/face/ccv'
  'libs/face/face'
], ($, kendo) ->

    face = {
        
        props: 
            glasses: new Image()
            horns: new Image()
            hipster: new Image()
            sombraro: new Image()
            backCanvas: {}
            width: 200

        backCanvas: document.createElement "canvas"

        comp: []

        lastCanvas: {}

        backCtx: {}
    }
     
    timeStripsBuffer = []
    ghostBuffer = []

    draw = (canvas, element, effect) ->
        texture = canvas.texture(element)
        canvas.draw(texture)

        effect()

        canvas.update()
        texture.destroy()

    faceCore = (video, canvas, prop, callback) ->

        if face.lastCanvas != canvas                      
            face.ctx = canvas.getContext "2d"
            face.ccv = null

        face.ctx.drawImage(video, 0, 0, video.width, video.height)
        face.backCtx.drawImage(video, 0, 0, face.backCanvas.width, face.backCanvas.height)

        if not pub.isPreview

            comp = ccv.detect_objects {
                canvas: face.backCanvas,
                cascade: cascade,
                interval: 4,
                min_neighbors: 1
            }

        else [{ x: video.width * .375, y: video.height * .375, width: video.width / 4, height: video.height / 4 }]

    trackFace = (video, canvas, prop, xoffset, yoffset, xscaler, yscaler) ->

        aspectWidth = video.width / face.backCanvas.width
        face.backCanvasheight = (video.height / video.width) * face.backCanvas.width
        aspectHeight = video.height / face.backCanvas.height

        comp = faceCore video, canvas, prop

        if comp.length
            face.comp = comp

        for i in face.comp
            face.ctx.drawImage prop, 
                (i.x * aspectWidth) - (xoffset * aspectWidth), 
                (i.y * aspectHeight) - (yoffset * aspectHeight),
                (i.width * aspectWidth) * xscaler, 
                (i.height * aspectWidth) * yscaler


    trackHead = (video, canvas, prop, xOffset, yOffset, width, height) ->

        aspectWidth = video.width / face.backCanvas.width
        face.backCanvasheight = (video.height / video.width) * face.backCanvas.width
        aspectHeight = video.height / face.backCanvas.height

        comp = faceCore video, canvas, prop

        if comp.length
            face.comp = comp

        for i in face.comp
            face.ctx.drawImage prop, 
            i.x * aspectWidth - (xOffset * aspectWidth), 
            (i.y * aspectHeight) - (yOffset * aspectHeight), 
            (i.width * aspectWidth) + (width * aspectWidth), 
            (i.height * aspectHeight) + (height * aspectHeight)     

    pub = 

        isPreview: true

        clearBuffer: ->

            timeStripsBuffer = []
            ghostBuffer = []

        init: ->

            face.backCtx = face.backCanvas.getContext "2d"

            face.props.glasses.src = "images/glasses.png"
            face.props.horns.src = "images/horns.png"
            face.props.hipster.src = "images/hipster.png"
            face.props.sombraro.src = "images/sombraro.png"


        data: [

                {

                    name: "Normal"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = ->
                            canvas
                        draw(canvas, element, effect)

                }

                {
                    name: "Bulge"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = -> 
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, .65 
                        draw(canvas, element, effect)
                }

                {
                    name: "Pinch"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, -.65
                        draw(canvas, element, effect)
                }

                {
                    name: "Swirl"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.swirl canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, 3
                        draw(canvas, element, effect)
                }

                {
                    name: "Zoom Blur"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.zoomBlur canvas.width / 2,  canvas.height / 2, 2, canvas.height / 5
                        draw(canvas, element, effect)
                }

                {
                    name: "Blockhead"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.blockhead canvas.width / 2,  canvas.height / 2, 200, 300, 1
                        draw(canvas, element, effect)
                }

                {
                    name: "Mirror Left"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.mirror 0
                        draw(canvas, element, effect)
                }

                {
                    name: "Mirror Pinch (Evil)"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = -> 
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, -.65 
                            canvas.mirror 0            
                        draw(canvas, element, effect)
                }

                {
                    name: "Mirror Top"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.mirror Math.PI * .5
                        draw(canvas, element, effect)
                }

                {
                    name: "Mirror Bottom"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.mirror Math.PI * 1.5
                        draw(canvas, element, effect)
                }                

                {
                    name: "Mirror Tube"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = ->
                            canvas.mirrorTube canvas.width / 2, canvas.height / 2, canvas.height / 4
                        draw(canvas, element, effect)
                }

                {
                    name: "Quad"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadRotate 0, 0, 0, 0
                        draw(canvas, element, effect)
                }

                {               
                    name: "Quad Color"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadColor [ 1, .2, .1 ], [ 0, .8, 0 ], [ .25, .5, 1 ], [ .8, .8, .8 ]
                        draw(canvas, element, effect)
                }

                {
                    name: "Comix"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadRotate 0, 0, 0, 0
                            canvas.denoise 50
                            canvas.ink .5
                        draw(canvas, element, effect)
                }

                {
                    name: "I Dont' Know"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadRotate 0, 0, 0, 0
                            canvas.denoise 50
                            canvas.ink 1
                            canvas.quadColor [ 1, .2, .1 ], [ 0, .8, 0 ], [ .25, .5, 1 ], [ .8, .8, .8 ]
                        draw(canvas, element, effect) 
                }

                {
                    name: "Color Half Tone"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.colorHalftone canvas.width / 2,  canvas.height / 2, .30, 3
                        draw(canvas, element, effect)
                }

                {
                    name: "Pixelate"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.pixelate canvas.width / 2,  canvas.height / 2, 5
                        draw(canvas, element, effect)
                }    

                {
                    name: "Hope Poster"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.hopePoster()
                        draw(canvas, element, effect)
                }

                {
                    name: "Photocopy"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.photocopy .5, frame
                        draw(canvas, element, effect)
                }

                {
                    name: "Old Film"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.oldFilm frame
                        draw(canvas, element, effect)
                }

                {
                    name: "VHS"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.vhs frame
                        draw(canvas, element, effect)
                }

                {
                    name: "Time Strips"
                    kind: "webgl"
                    filter: (canvas, element, frame) ->

                        effect = ->

                            createBuffers = (length) ->
                                while timeStripsBuffer.length < length
                                    timeStripsBuffer.push canvas.texture(element)

                            createBuffers(32)
                            timeStripsBuffer[frame++ % timeStripsBuffer.length].loadContentsOf(element)
                            canvas.timeStrips(timeStripsBuffer, frame)
                            canvas.matrixWarp([-1, 0, 0, 1], false, true)

                        draw(canvas, element, effect)

                }

                {
                    name: "Your Ghost"
                    kind: "webgl"
                    filter: (canvas, element, frame) ->

                        effect = ->

                            createBuffers = (length) ->
                                while ghostBuffer.length < length
                                    ghostBuffer.push canvas.texture(element)

                            createBuffers(32)
                            ghostBuffer[frame++ % ghostBuffer.length].loadContentsOf(element)
                            canvas.matrixWarp([1, 0, 0, 1], false, true)
                            canvas.blend ghostBuffer[frame % ghostBuffer.length], .5
                            canvas.matrixWarp([-1, 0, 0, 1], false, true)

                        draw(canvas, element, effect)

                }

                {
                    name: "Chromed"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.chromeLogo canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5
                        draw(canvas, element, effect)
                }

                {
                    name: "Kaleidoscope"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.kaleidoscope canvas.width / 2,  canvas.height / 2, 200, 0
                        draw(canvas, element, effect)
                }

                {
                    name: "Inverted"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.invert()
                        draw(canvas, element, effect)
                }

                {
                    name: "In Disguise"
                    kind: "face"
                    filter: (canvas, video) ->

                        trackFace video, canvas, face.props.glasses, 0, 0, 1, 1
                        
                }

                {
                    name: "Horns"
                    kind: "face"
                    filter: (canvas, video) ->

                        trackHead video, canvas, face.props.horns, 0, 25, 0, 0
                }

                
                {
                    name: "Hipsterizer"
                    kind: "face"
                    filter: (canvas, video) ->

                        trackFace video, canvas, face.props.hipster, 0, 0, 1, 2.2
                }

                # {
                #     name: "Sombraro"
                #     kind: "face"
                #     filter: (canvas, video) ->

                #         trackFace video, canvas, face.props.sombraro, 75, 25, 4, 2
                # }

                
        ]
            
)
