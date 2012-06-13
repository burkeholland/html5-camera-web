(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/utils'], function(utils) {
    var blobBuiler, compare, dataURIToBlob, errorHandler, fileSystem, myPicturesDir, pub;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    fileSystem = {};
    myPicturesDir = {};
    blobBuiler = {};
    compare = function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };
    dataURIToBlob = function(dataURI) {
      var ab, blob, byteString, bytes, ia, mimeString, _i, _len;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      ab = new ArrayBuffer(byteString.length, 'binary');
      ia = new Uint8Array(ab);
      for (_i = 0, _len = byteString.length; _i < _len; _i++) {
        bytes = byteString[_i];
        ia[_i] = byteString.charCodeAt(_i);
      }
      blobBuiler = new BlobBuilder();
      blobBuiler.append(ab);
      return blob = blobBuiler.getBlob(mimeString);
    };
    errorHandler = function(e) {
      var msg;
      msg = '';
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
      }
      console.log('Error: ' + msg);
      return $.publish("/msg/error", ["Access to the file system could not be obtained."]);
    };
    return pub = {
      init: function(kb) {
        var success;
        window.webkitStorageInfo.requestQuota(PERSISTENT, kb * 1024, function(grantedBytes) {
          return window.requestFileSystem(PERSISTENT, grantedBytes, success, errorHandler);
        });
        return success = function(fs) {
          fs.root.getDirectory("MyPictures", {
            create: true
          }, function(dirEntry) {
            var animation, dirReader, entries, read;
            myPicturesDir = dirEntry;
            entries = [];
            dirReader = fs.root.createReader();
            animation = {
              effects: "zoomIn fadeIn",
              show: true,
              duration: 1000
            };
            read = function() {
              return dirReader.readEntries(function(results) {
                var entry, _i, _j, _len, _len2, _results;
                if (!results.length) {
                  console.info(entries);
                  entries.sort(compare);
                  _results = [];
                  for (_i = 0, _len = entries.length; _i < _len; _i++) {
                    entry = entries[_i];
                    _results.push($.publish("/pictures/create", [entry.toURL(), entry.name, false, false, null]));
                  }
                  return _results;
                } else {
                  for (_j = 0, _len2 = results.length; _j < _len2; _j++) {
                    entry = results[_j];
                    if (entry.isFile) entries.push(entry);
                  }
                  return read();
                }
              });
            };
            return read();
          }, errorHandler);
          fileSystem = fs;
          return console.info("Got Storage!");
        };
      },
      save: function(name, dataURI) {
        return fileSystem.root.getFile(name, {
          create: true
        }, function(fileEntry) {
          return fileEntry.createWriter(function(fileWriter) {
            var blob;
            fileWriter.onwriteend = function(e) {
              return console.info("save completed");
            };
            fileWriter.onerror = function(e) {
              return console.error("Write failed: " + e.toString());
            };
            blob = dataURIToBlob(dataURI);
            return fileWriter.write(blob);
          });
        }, errorHandler);
      },
      "delete": function(name) {
        return fileSystem.root.getFile(name, {
          create: false
        }, function(fileEntry) {
          return fileEntry.remove(function() {
            return $.publish("/file/deleted/" + name);
          }, errorHandler);
        }, errorHandler);
      },
      download: function(img) {
        var blob, canvas, ctx, dataURL, height, width;
        width = img.width;
        height = img.height;
        img.removeAttribute("width", 0);
        img.removeAttribute("height", 0);
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        dataURL = canvas.toDataURL();
        img.width = width;
        img.height = height;
        return blob = dataURIToBlob(dataURL);
      }
    };
  });

}).call(this);
