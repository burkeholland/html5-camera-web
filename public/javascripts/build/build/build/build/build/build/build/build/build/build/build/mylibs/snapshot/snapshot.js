(function() {

  define(['jQuery', 'Kendo', 'mylibs/pictures/pictures'], function($, kendo, effects, filters, snapshot, utils, file) {
    var $container, create, develop, polaroid, preview, pub, svg;
    polaroid = false;
    preview = {};
    $container = {};
    svg = [];
    create = function(src) {
      var animation;
      animation = {
        effects: "slideIn:down fadeIn",
        show: true,
        duration: 1000
      };
      return $.publish("/pictures/create", [src, null, false, true, animation]);
    };
    develop = function(opacity) {
      if (opacity < 1) {
        opacity = opacity + .01;
        $image.css("opacity", opacity);
      } else {
        $.unsubscribe("/shake/beta");
        $.unsubscribe("/shake/gamma");
      }
      return opacity;
    };
    return pub = {
      init: function(sender, container) {
        preview = sender;
        $container = $("#" + container);
        $.subscribe("/polaroid/change", function(e) {
          if (e.currentTarget.checked) {
            return polaroid = true;
          } else {
            return polaroid = false;
          }
        });
        return $.subscribe("/snapshot/create", function(src) {
          return create(src);
        });
      }
    };
  });

}).call(this);
