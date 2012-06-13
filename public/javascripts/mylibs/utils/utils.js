(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/BlobBuilder.min', 'mylibs/utils/FileSaver.min', 'mylibs/utils/canvg', 'mylibs/utils/rgbcolor'], function($, kendo) {
    var canvas, dataURIFromImg, pub;
    canvas = {};
    dataURIFromImg = function(img) {
      var ctx, imgData, src;
      ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imgData, 0, 0);
      return src = canvas.toDataURL("image/png");
    };
    return pub = {
      blobFromDataURI: function(dataURI) {
        var ab, blob, blobBuiler, byteString, bytes, ia, mimeString, _i, _len;
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
      },
      blobFromSrc: function(src) {
        var uri;
        uri = dataURIFromSrc(src);
        return this.blobFromDataURI(uri);
      },
      blobFromImg: function(img) {
        var blob, uri;
        canvas.width = img.width;
        canvas.height = img.height;
        uri = dataURIFromImg(img);
        return blob = this.blobFromDataURI(uri);
      },
      init: function() {
        return canvas = document.createElement("canvas");
      },
      getAnimationFrame: function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
          return window.setTimeout(callback, 1000 / 60);
        };
      }
    };
  });

}).call(this);
