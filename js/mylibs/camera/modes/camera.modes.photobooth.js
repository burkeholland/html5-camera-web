(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'text!mylibs/camera/views/photostrip.html'], function($, kendo, camera, photostrip) {
    var canvas, create, createStrip, draw, images, pub;
    images = [];
    camera = {};
    canvas = {};
    createStrip = function(counter, images, ctx) {
      var image;
      image = new Image();
      image.src = images[counter];
      image.width = 200;
      image.height = 150;
      return image.onload = function() {
        var y;
        y = (counter * 150) + ((counter * 10) + 10);
        ctx.drawImage(image, 10, y, image.width, image.height);
        if (counter === images.length - 1) {
          return draw(ctx);
        } else {
          return createStrip(++counter, images, ctx);
        }
      };
    };
    draw = function(ctx) {
      var div, imgData, src;
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imgData, 0, 0);
      src = canvas.toDataURL("image/jpeg");
      div = $(photostrip);
      div.find("img").attr("src", src);
      $("#photobooth").append(div);
      return div.kendoStop(true).kendoAnimate({
        effects: "slideIn:down fadeIn",
        show: true,
        duration: 1000
      });
    };
    create = function(photoNumber) {
      var counter, ctx;
      if (photoNumber > 0) {
        return camera.countdown(3, function() {
          images.push(camera.capture());
          return create(--photoNumber);
        });
      } else {
        counter = 0;
        canvas = $("<canvas width=220 height=650 style=color:fff></canvas>").get(0);
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, 220, 650);
        return createStrip(counter, images, ctx);
      }
    };
    return pub = {
      init: function(theCamera) {
        camera = theCamera;
        return $.subscribe("/camera/photobooth", function() {
          images = [];
          return create(4, images);
        });
      }
    };
  });

}).call(this);
