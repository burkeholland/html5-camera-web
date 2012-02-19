(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera'], function($, kendo, camera) {
    var pub;
    return pub = {
      init: function() {
        return camera.init("stream", $("#controls"));
      }
    };
  });

}).call(this);
