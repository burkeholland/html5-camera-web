(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/snapshot/snapshot', 'mylibs/photobooth/photobooth', 'mylibs/controls/controls', 'mylibs/customize/customize', 'mylibs/effects/effects', 'mylibs/file/file', 'mylibs/share/share', 'text!intro.html', 'mylibs/pictures/pictures', 'mylibs/preview/preview', 'mylibs/preview/selectPreview'], function($, kendo, camera, snapshot, photobooth, controls, customize, effects, file, share, intro, pictures, preview, selectPreview) {
    var pub;
    return pub = {
      init: function() {
        $.subscribe('/camera/unsupported', function() {
          return $('#pictures').append(intro);
        });
        return camera.init("countdown", function() {
          var $canvas;
          pictures.init("pictures");
          preview.init("camera", camera.video);
          selectPreview.init("previews", camera.canvas, camera.video);
          selectPreview.draw();
          snapshot.init(preview, "pictures");
          $canvas = $('#screen');
          photobooth.init(460, 340);
          controls.init("controls");
          customize.init("customize");
          effects.init();
          return file.init(50000);
        });
      }
    };
  });

}).call(this);
