(function() {

  define(['jQuery', 'Kendo', 'mylibs/effects/effects', 'mylibs/effects/filters', 'text!mylibs/camera/views/snapshot.html', 'mylibs/utils/utils'], function($, kendo, effects, filters, snapshot, utils) {
    var $container, camera, create, develop, polaroid, pub;
    polaroid = false;
    camera = {};
    $container = {};
    create = function() {
      return camera.countdown(3, function() {
        var $image, d, div, filter, opacity, preset, presets, src, targetColumn;
        src = camera.capture();
        div = $(snapshot);
        $image = div.find(".picture").attr("src", src).data("vintagesource", src).on("click", function() {
          return $.publish("/customize", [this]);
        }).css("opacity", 0);
        div.on("click", "a", function() {
          return utils.saveImage($image.attr("src"));
        });
        targetColumn = camera.targetColumn();
        div.appendTo($container);
        $container.masonry('reload');
        d = filters.presets;
        presets = (function() {
          var _ref, _results;
          _ref = filters.presets;
          _results = [];
          for (filter in _ref) {
            preset = _ref[filter];
            _results.push(preset);
          }
          return _results;
        })();
        div.find(".presets").kendoDropDownList({
          dataSource: {
            data: presets
          },
          dataTextField: "filter",
          dataValueField: "filter",
          change: function() {
            preset = this.value();
            if (preset === "normal") {
              return $image.css("-webkit-filter", "");
            } else {
              return $image.css("-webkit-filter", "" + filters.presets[preset].filter + "(" + filters.presets[preset].value + ")");
            }
          }
        });
        div.kendoStop(true).kendoAnimate({
          effects: "slideIn:down fadeIn",
          show: true,
          duration: 1000
        });
        if (polaroid) {
          opacity = 0;
          return $.subscribe("/shake/beta", function() {
            opacity = parseFloat($image.css("opacity"));
            if (opacity < 1) {
              opacity = opacity + .03;
              return $image.css("opacity", opacity);
            } else {
              return $.unsubscribe("/shake/beta");
            }
          });
        } else {
          return $image.css("opacity", 1);
        }
      });
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
      init: function(sender, $picturesContainer) {
        camera = sender;
        $container = $picturesContainer;
        $.subscribe("/camera/snapshot", function() {
          return create();
        });
        return $.subscribe("/polaroid/change", function(e) {
          if (e.currentTarget.checked) {
            return polaroid = true;
          } else {
            return polaroid = false;
          }
        });
      }
    };
  });

}).call(this);
