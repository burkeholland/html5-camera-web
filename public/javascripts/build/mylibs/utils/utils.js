(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/BlobBuilder.min', 'mylibs/utils/canvg', 'mylibs/utils/rgbcolor'], function($, kendo) {
    var canvas, pub;
    canvas = {};
    return pub = {
      init: function() {
        canvas = document.createElement("canvas");
        return canvas.toDataURI = function(el) {
          var ctx, imgData, src;
          ctx = canvas.getContext("2d");
          ctx.drawImage(el, 0, 0, el.width, el.height);
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          return src = canvas.toDataURL("image/jpeg");
        };
      },
      toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
      },
      elToDataURI: function(el) {
        canvas.width = el.width;
        canvas.height = el.height;
        return canvas.toDataURI(el);
      },
      svgToDataURI: function(svg) {
        var src, svg_xml;
        svg_xml = (new XMLSerializer()).serializeToString(svg);
        canvg(canvas, svg_xml);
        return src = canvas.toDataURL("image/jpeg");
      },
      getAnimationFrame: function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
          return window.setTimeout(callback, 1000 / 60);
        };
      }
    };
  });

}).call(this);
