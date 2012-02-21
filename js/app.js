(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/customize/customize'], function($, kendo, camera, customize) {
    var pub;
    return pub = {
      init: function() {
        camera.init("stream", "takePicture", "countdown", "videoDrawer");
        return customize.init("customize");
      }
    };
  });

}).call(this);
