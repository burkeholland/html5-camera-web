define([
  'jQuery', # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'libs/face/ccv'
  'libs/face/face'
], ($, kendo) ->

    face = {}

    draw = (canvas, element, effect) ->
        texture = canvas.texture(element)
        canvas.draw(texture)

        effect()

        canvas.update()
        texture.destroy()

    faceCore = (video, canvas, prop) ->

        if face.lastCanvas != canvas                      
            face.ctx = canvas.getContext "2d"
            face.ccv = null

        face.ctx.drawImage(video, 0, 0, video.width, video.height)
        face.backCtx.drawImage(video, 0, 0, face.backCanvas.width, face.backCanvas.height)
        
        comp = ccv.detect_objects {
            canvas: face.backCanvas,
            cascade: cascade,
            interval: 4,
            min_neighbors: 1
        }

    trackFace = (video, canvas, prop) ->

        aspectWidth = video.width / face.backCanvas.width
        aspectHeight = video.height / face.backCanvas.height

        comp = faceCore video, canvas, prop

        for i in comp
            face.ctx.drawImage(prop, i.x * aspectWidth, i.y * aspectHeight, i.width * aspectWidth, i.height * aspectHeight)

    trackHead = (video, canvas, prop) ->

        aspectWidth = video.width / face.backCanvas.width
        height = (video.height / video.width) * face.backCanvas.width
        aspectHeight = height / face.backCanvas.height

        comp = faceCore video, canvas, prop

        for i in comp
            face.ctx.drawImage(prop, i.x * aspectWidth, (i.y * aspectHeight) - ((i.height * aspectHeight) / 2), i.width * aspectWidth, i.height * aspectHeight)     

    pub = 

        init: ->

            face.backCanvas = document.createElement "canvas"
            face.backCanvas.width = 200

            face.lastCanvas = {}

            face.backCtx = face.backCanvas.getContext "2d"

            face.props = {}

            face.props.glasses = new Image()
            face.props.glasses.src = "images/glasses.png"

            face.props.sombraro = new Image()
            face.props.sombraro.src = "images/sombraro.png"

            face.props.horns = new Image()
            face.props.horns.src = "images/horns.png"

            ###
            face.images.glasses = "images/glasses.png"
            face.images.hipster = "images/hipster.png"
            face.images.halo = "images/halo.png"
            face.images.sombrero = "images/sombrero.png"
            face.images.horns = "images/horns.png"
            ###

        data: [

                {

                    name: "normal"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = ->
                            canvas
                        draw(canvas, element, effect)

                }


                {
                    name: "bulge"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = -> 
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, .65 
                        draw(canvas, element, effect)
                }

                {
                    name: "pinch"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, -.65
                        draw(canvas, element, effect)
                }

                {
                    name: "swirl"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.swirl canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, 3
                        draw(canvas, element, effect)
                }

                {
                    name: "zoomBlur"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.zoomBlur canvas.width / 2,  canvas.height / 2, 2, canvas.height / 5
                        draw(canvas, element, effect)
                }

                {
                    name: "blockhead"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.blockhead canvas.width / 2,  canvas.height / 2, 200, 300, 1
                        draw(canvas, element, effect)
                }

                {
                    name: "mirrorLeft"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.mirror 0
                        draw(canvas, element, effect)
                }

                {
                    name: "mirrorPinch"
                    kind: "webgl"
                    filter: (canvas, element) ->
                        effect = -> 
                            canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, -.65 
                            canvas.mirror 0            
                        draw(canvas, element, effect)
                }

                {
                    name: "mirrorTop"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.mirror 1.57841
                        draw(canvas, element, effect)
                }

                {
                    name: "quadRotate"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadRotate 0, 1, 2, 3
                        draw(canvas, element, effect)
                }

                {
                    name: "colorHalfTone"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.colorHalftone canvas.width / 2,  canvas.height / 2, .30, 3
                        draw(canvas, element, effect)
                }

                {
                    name: "pixelate"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.pixelate canvas.width / 2,  canvas.height / 2, 5
                        draw(canvas, element, effect)
                }    

                {
                    name: "hopePoster"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.hopePoster()
                        draw(canvas, element, effect)
                }

                {
                    name: "photocopy"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.photocopy .5, frame
                        draw(canvas, element, effect)
                }

                {
                    name: "oldFilm"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.oldFilm frame
                        draw(canvas, element, effect)
                }

                {
                    name: "vhs"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.vhs frame
                        draw(canvas, element, effect)
                }
                 
                {               
                    name: "quadColor"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.quadColor [ 1, .2, .1 ], [ 0, .8, 0 ], [ .25, .5, 1 ], [ .8, .8, .8 ]
                        draw(canvas, element, effect)
                }


                {
                    name: "kaleidoscope"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.kaleidoscope canvas.width / 2,  canvas.height / 2, 200, 0
                        draw(canvas, element, effect)
                }

                {
                    name: "invert"
                    kind: "webgl"
                    filter: (canvas, element) -> 
                        effect = ->
                            canvas.invert()
                        draw(canvas, element, effect)
                }

                {
                    name: "chromeLogo"
                    kind: "webgl"
                    filter: (canvas, element, frame) -> 
                        effect = ->
                            canvas.chromeLogo canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5
                        draw(canvas, element, effect)
                }

                {
                    name: "glasses"
                    kind: "face"
                    filter: (canvas, video) ->

                        trackFace video, canvas, face.props.glasses
                        
                }

                # {
                #     name: "horns"
                #     type: "face"
                #     filter: (canvas, video) ->
                        
                #         trackHead video, canvas, face.props.horns
                # }
        ]
            
)
