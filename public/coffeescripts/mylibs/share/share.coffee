define([
  'jQuery'  # lib/jquery/jquery
  'Kendo'   # lib/underscore/underscore
  'mylibs/utils/utils'
  'text!mylibs/share/views/download.html'
  'text!mylibs/share/views/tweet.html'
], ($, kendo, utils, downloadView, tweet) ->
    

    ###
    shareWindow = {}
    twitter_token = ""
    
    openCenteredWindow = (url) ->
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
                
                twitter = sessionStorage.getItem("twitter")
                
                if (twitter)
                    $(".tweet").show()
        
        intervalID = window.setInterval(checkWindow, 500)
                
  
        
    
    pub =
        
        twitter_token: ""
    
        init: ->

            # create the download popup window but don't show it, just
            # store a reference to it that we can use later

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

            # the download goes via the HTML5 FileWorker spec so there's no prompt
            # provide that prompt here and set the download name

            shareWindow = $("<div id='share'></div>").kendoWindow({
                                modal: true
                                visible: false
                             }).data("kendoWindow")
                               
                               
            download: (el) ->

                # we need to write the element containing the image to a canvas
                # then we can save it back as a data url. we need to do it again
                # so that the css filters are applied.

                dataURI = utils.elToDataURI(el);

                # attach the dataURI to the data-uri attribute on the save button
                $("#{downloadView} > button").data("uri", dataURI)
    ###
            
            
)
