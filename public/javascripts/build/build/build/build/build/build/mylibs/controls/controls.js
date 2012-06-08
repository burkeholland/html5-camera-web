(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      init: function(controlsId) {
        var $controls, previousAlpha, previousBeta, previousGamma;
        $controls = $("#" + controlsId);
        $controls.on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
        $controls.on("change", "input", function(e) {
          return $.publish("/polaroid/change", [e]);
        });
        if (window.DeviceOrientationEvent || window.OrientationEvent) {
          $(".polaroid-container").show();
          previousAlpha = 0;
          previousGamma = 0;
          previousBeta = 0;
          return window.addEventListener('deviceorientation', function(eventData) {
            if ((eventData.gamma - previousGamma) > 40 || (previousGamma - eventData.gamma) > 40) {
              $.publish("/shake/gamma");
            }
            if ((eventData.beta - previousBeta) > 40 || (previousBeta - eventData.beta) > 40) {
              return $.publish("/shake/beta");
            }
          }, false);
        }
      }
    };
  });

}).call(this);
