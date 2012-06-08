(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'text!mylibs/camera/views/photostrip.html'], function($, kendo, camera, photostrip) {
    var $container, canvas, create, createStrip, draw, imageHeight, imageWidth, images, photoCount, pub;
    images = [];
    camera = {};
    canvas = {};
    $container = {};
    imageWidth = 0;
    imageHeight = 0;
    photoCount = 0;
    createStrip = function(counter, images, ctx) {
      var image;
      image = new Image();
      image.src = images[counter];
      image.width = imageWidth;
      image.height = imageHeight;
      return image.onload = function() {
        var y;
        y = (counter * imageHeight) + ((counter * 20) + 20);
        ctx.drawImage(image, 20, y, image.width, image.height);
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
      div.appendTo($container);
      $container.masonry('reload');
      return div.kendoStop(true).kendoAnimate({
        effects: "slideIn:down fadeIn",
        show: true,
        duration: 1000
      });
    };
    create = function(photoNumber) {
      var counter, ctx, height, width;
      if (photoNumber > 0) {
        return camera.countdown(3, function() {
          images.push(camera.capture());
          return create(--photoNumber);
        });
      } else {
        counter = 0;
        width = imageWidth + 40;
        height = (imageHeight * photoCount) + (photoCount * 20) + 20;
        canvas = $("<canvas width=" + width + " height=" + height + " style=color:fff></canvas>").get(0);
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, width, height);
        return createStrip(counter, images, ctx);
      }
    };
    return pub = {
      init: function(theCamera, canvasWidth, canvasHeight, $picturesContainer) {
        imageWidth = canvasWidth;
        imageHeight = canvasHeight;
        camera = theCamera;
        $container = $picturesContainer;
        return $.subscribe("/camera/photobooth", function() {
          images = [];
          photoCount = 4;
          return create(photoCount, images);
        });
      }
    };
  });

}).call(this);
