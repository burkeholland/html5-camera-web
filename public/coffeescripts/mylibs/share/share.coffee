define([
  'jQuery'  # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'mylibs/utils/utils'
  'text!mylibs/share/views/tweet.html'
], ($, kendo, utils, template) ->
        
    shareWindow = {}
    twitter_token = ""
    $window = {}
    events = {}

    viewModel = kendo.observable({
        src: ""
        twitter: false
        tweet: ->
            
            callback = ->

                blob = utils.blobFromImg($("#imageToShare")[0])
            
                fd = new FormData()
                fd.append("file", blob)

                $.ajax({ 
                    url: "share/tweet", 
                    data: fd, 
                    type: "POST", 
                    processData: false,
                    contentType: false
                })

            openCenteredWindow(null, callback)
    })

    openCenteredWindow = (url, callback) ->
        y = 700 
        C = window.screenX or 0 
        B = if C then $(window).width() else screen.availWidth
        A = 520 
        u = window.screenY || 0 
        x = if u then $(window).height() else screen.availHeight
        v = C + (B - y) / 2
        z = u + (x - A) / 2
        
        childWindow = window.open("authenticate/twitter", "auth", "resizable=yes,toolbar=no,scrollbars=yes,status=no,width=" + y + ",height=" + A + ",left=" + v + ",top=" + z)
        
        checkWindow = ->
            if childWindow and childWindow.closed
                window.clearInterval(intervalID)
                
                window.APP.twitter = sessionStorage.getItem("twitter")
        
                callback()

        intervalID = window.setInterval(checkWindow, 500)
            
    pub =
        
        twitter_token: ""

        tweet: (src) ->

            viewModel.set("src", src)
            $window.open()

        init: ->

            # check to see if we are logged in to twitter
            window.APP.twitter = sessionStorage.getItem("twitter")

            $content = $(template)

            $window = $content.kendoWindow
                visible: false
                modal: true
                title: ""
                animation: 
                    open:
                        effects: "slideIn:up fadeIn"
                        duration: 500
                    close:
                        effects: "slide:up fadeOut"
                        duration: 500
            .data("kendoWindow").center()

            kendo.bind $content, viewModel

            $.subscribe("/share/download", ($img) ->    
                img = new Image()
                img.src = $img.src
                
                src = utils.elToDataURI(img)
                utils.saveImage(src)
                
                delete img
                
            )
            
            $.subscribe("/share/tweet", (src) ->
            
                template = kendo.template(tweet)
                tweet = template({src: src })
                
                shareWindow.content(tweet).open().center()
                
            )
            
            
            $('#twitter-sign-in').click( (e) ->            
            
                # open a new child window and sign in!
                openCenteredWindow("twitter")
                
                e.preventDefault()
                
            )
                               
            download: (el) ->

                # we need to write the element containing the image to a canvas
                # then we can save it back as a data url. we need to do it again
                # so that the css filters are applied.

                dataURI = utils.elToDataURI(el);

                # attach the dataURI to the data-uri attribute on the save button
                $("#{downloadView} > button").data("uri", dataURI)
            
            
)
