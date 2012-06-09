(function() {

  define(['jQuery', 'Kendo', 'text!mylibs/photobooth/views/photostrip.html'], function($, kendo, photostrip) {
    var canvas, createStrip, images, pub;
    images = [];
    canvas = {};
    createStrip = function(counter, images, ctx, width, height) {
      var image;
      image = new Image();
      image.src = images[counter];
      image.width = width;
      image.height = height;
      return image.onload = function() {
        var animation, imgData, src, y;
        y = (counter * height) + ((counter * 20) + 20);
        ctx.drawImage(image, 20, y, image.width, image.height);
        if (counter === images.length - 1) {
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          src = canvas.toDataURL();
          animation = {
            effects: "slideIn:down fadeIn",
            show: true,
            duration: 1000
          };
          return $.publish("/pictures/create", [src, null, false, true, animation, true]);
        } else {
          return createStrip(++counter, images, ctx, width, height);
        }
      };
    };
    return pub = {
      init: function(width, height) {
        canvas = $("<canvas style=color:fff></canvas>")[0];
        return $.subscribe("/photobooth/create", function(images) {
          var counter, ctx, img;
          counter = 0;
          canvas.width = width + 40;
          canvas.height = (height * images.length) + (images.length * 20) + 20;
          ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgb(255,255,255)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          return img = createStrip(counter, images, ctx, width, height);
        });
      }
    };
  });

}).call(this);
