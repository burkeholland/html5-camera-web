(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/customize/customize', 'mylibs/effects/effects'], function($, kendo, camera, customize, effects) {
    var pub;
    return pub = {
      init: function() {
        camera.init("stream", "controls", "countdown", "snapshots");
        customize.init("customize");
        return effects.init();
      }
    };
  });

}).call(this);
