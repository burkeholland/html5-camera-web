(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/effects/effects', 'text!mylibs/camera/views/snapshot.html'], function($, kendo, camera, effects, snapshot) {
    var $container, create, pub;
    camera = {};
    $container = {};
    create = function() {
      return camera.countdown(3, function() {
        var div, image, presets, src;
        src = camera.capture();
        div = $(snapshot);
        image = div.find("img").attr("src", src).data("vintagesource", src).on("click", function() {
          return $.publish("/customize", [this]);
        });
        div.appendTo($container);
        presets = effects.presets();
        div.find(".presets").kendoDropDownList({
          dataSource: {
            data: presets
          },
          dataTextField: "preset",
          change: function() {
            return effects.applyPreset(image, this.value());
          }
        });
        return div.kendoStop(true).kendoAnimate({
          effects: "slideIn:down fadeIn",
          show: true,
          duration: 1000
        });
      });
    };
    return pub = {
      init: function(theCamera, containerId) {
        camera = theCamera;
        $container = $("#" + containerId);
        return $.subscribe("/camera/snapshot", function() {
          return create();
        });
      }
    };
  });

}).call(this);
