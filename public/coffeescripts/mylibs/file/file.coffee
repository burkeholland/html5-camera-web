define([

  'jQuery'
  'Kendo'
  'mylibs/utils/utils'

], ($, kendo, utils) ->

  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem

  fileSystem = {}
  myPicturesDir = {}
  blobBuiler = {}

  compare = (a,b) ->
    
    if a.name < b.name
      return -1
  
    if a.name > b.name
      return 1
  
    return 0

  errorHandler = (e) ->

    msg = ''

    switch e.code
      when FileError.QUOTA_EXCEEDED_ERR
        msg = 'QUOTA_EXCEEDED_ERR'
      when FileError.NOT_FOUND_ERR
        msg = 'NOT_FOUND_ERR'
      when FileError.SECURITY_ERR
        msg = 'SECURITY_ERR'
      when FileError.INVALID_MODIFICATION_ERR
        msg = 'INVALID_MODIFICATION_ERR'
      when FileError.INVALID_STATE_ERR
        msg = 'INVALID_STATE_ERR'
      else
        msg = 'Unknown Error'

    console.log('Error: ' + msg);


    $.publish("/msg/error", ["Access to the file system could not be obtained."])    

  pub = 

    init: (kb) ->

      window.webkitStorageInfo.requestQuota PERSISTENT, kb * 1024, (grantedBytes) ->
        
        window.requestFileSystem PERSISTENT, grantedBytes, success, errorHandler

      success = (fs) ->

        fs.root.getDirectory "MyPictures", create: true, (dirEntry) ->

          myPicturesDir = dirEntry

          entries = []
          dirReader = fs.root.createReader()
          animation = effects: "zoomIn fadeIn", show: true, duration: 1000

          read = ->

            dirReader.readEntries (results) ->

              if not results.length

                console.info entries
                entries.sort(compare)

                for entry in entries

                  $.publish "/pictures/create", [entry.toURL(), entry.name, false, false, null]

              else

                for entry in results

                  if entry.isFile

                    entries.push entry

                read()

          read()

        , errorHandler

        fileSystem = fs
        
        console.info("Got Storage!")

    save: (name, dataURI) ->

      fileSystem.root.getFile name,  create: true, (fileEntry) ->

        fileEntry.createWriter (fileWriter) ->

          fileWriter.onwriteend = (e) ->

              console.info "save completed"

          fileWriter.onerror = (e) ->

              console.error "Write failed: " + e.toString()

          blob = utils.blobFromDataURI(dataURI)

          fileWriter.write blob
              
      , errorHandler

    delete: (name) ->

      fileSystem.root.getFile name, create: false, (fileEntry) ->

        fileEntry.remove ->

            $.publish("/file/deleted/#{name}")

        , errorHandler

      , errorHandler

    download: (img) ->

      # gotta blow the image back up to it's correct size
      width = img.width
      height = img.height

      img.removeAttribute("width", 0) 
      img.removeAttribute("height", 0)

      canvas = document.createElement("canvas")
      ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0, img.width, img.height)

      dataURL = canvas.toDataURL();

      img.width = width
      img.height = height

      blob = utils.blobFromDataURI(dataURL)

      saveAs(blob)

)