(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera'], function($, kendo) {
    var captureImage, pub;
    captureImage = function() {
      var canvas, ch, ctx, cw, img, video;
      $("#videoDrawer").empty();
      canvas = $('<canvas></canvas>').get(0);
      video = document.getElementById("stream");
      ctx = canvas.getContext("2d");
      cw = canvas.clientWidth;
      ch = canvas.clientHeight;
      ctx.drawImage(video, 0, 0, cw, ch);
      img = canvas.toDataURL("image/png");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return $("#videoDrawer").append($('<img></img>').attr('src', img));
    };
    return pub = {
      init: function($controls) {
        $.subscribe('/camera/takePicture', function(pub) {
          return pub.takePicture(true);
        });
        return $controls.on("click", "button", function() {
          return $.publish($(this).data("event"), [pub]);
        });
      },
      takePicture: function(countdown) {
        if (countdown) return captureImage();
      }
    };
  });

}).call(this);
