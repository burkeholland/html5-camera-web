define([
  'jQuery', # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
], ($, kendo) ->

    draw = (canvas, element, effect) ->
        texture = canvas.texture(element)
        canvas.draw(texture)

        effect()

        canvas.update()
        texture.destroy()


    [
        {

            name: "normal"
            filter: (canvas, element) ->
                effect = ->
                    canvas
                draw(canvas, element, effect)

        }


        {
            name: "bulge"
            filter: (canvas, element) ->
                effect = -> 
                    canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, .65                
                draw(canvas, element, effect)
        }

        {
            name: "pinch"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.bulgePinch canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, -.65
                draw(canvas, element, effect)
        }

        {
            name: "swirl"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.swirl canvas.width / 2,  canvas.height / 2, (canvas.width / 2) / 2, 3
                draw(canvas, element, effect)
        }

        {
            name: "zoomBlur"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.zoomBlur canvas.width / 2,  canvas.height / 2, 5
                draw(canvas, element, effect)
        }

        {
            name: "blockhead"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.blockhead canvas.width / 2,  canvas.height / 2, 200, 300, 1
                draw(canvas, element, effect)
        }

        {
            name: "mirrorLeft"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.mirror 0
                draw(canvas, element, effect)
        }

        {
            name: "mirrorTop"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.mirror 1.57841
                draw(canvas, element, effect)
        }

        {
            name: "quadRotate"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.quadRotate 0, 1, 2, 3
                draw(canvas, element, effect)
        }

        {
            name: "colorHalfTone"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.colorHalftone canvas.width / 2,  canvas.height / 2, .30, 3
                draw(canvas, element, effect)
        }

        {
            name: "pixelate"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.pixelate canvas.width / 2,  canvas.height / 2, 5
                draw(canvas, element, effect)
        }    

        {
            name: "hopePoster"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.hopePoster()
                draw(canvas, element, effect)
        }

        {
            name: "photocopy"
            filter: (canvas, element, frame) -> 
                effect = ->
                    canvas.photocopy .5, frame
                draw(canvas, element, effect)
        }

        {
            name: "oldFilm"
            filter: (canvas, element, frame) -> 
                effect = ->
                    canvas.oldFilm frame
                draw(canvas, element, effect)
        }

        {
            name: "vhs"
            filter: (canvas, element, frame) -> 
                effect = ->
                    canvas.vhs frame
                draw(canvas, element, effect)
        }
         
        {               
            name: "quadColor"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.quadColor [ 1, .2, .1 ], [ 0, .8, 0 ], [ .25, .5, 1 ], [ .8, .8, .8 ]
                draw(canvas, element, effect)
        }


        {
            name: "kaleidoscope"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.kaleidoscope canvas.width / 2,  canvas.height / 2, 200, 0
                draw(canvas, element, effect)
        }

        {
            name: "invert"
            filter: (canvas, element) -> 
                effect = ->
                    canvas.invert()
                draw(canvas, element, effect)
        }

        {
            name: "chromeLogo"
            filter: (canvas, element, frame) -> 
                effect = ->
                    canvas.chromeLogo canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5
                draw(canvas, element, effect)
        }

        {
            name: "wetTable"
            filter: (canvas, element, frame) ->
                effect = ->
                    canvas.wetTable()
                draw(canvas, element, effect)

        }

    ]
        
)
