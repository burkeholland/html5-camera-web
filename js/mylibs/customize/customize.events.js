(function() {

  define(['jQuery', 'Kendo', 'text!mylibs/customize/views/customize.html'], function($, kendo, template) {
    var $window, customizeEffect, pub;
    $window = {};
    customizeEffect = function(sender) {
      var $image, content, vintage;
      $image = $(sender);
      content = kendo.template(template);
      $window.element.empty().append(content($image.attr("src")));
      vintage = $image.data("vintage");
      $(content).find(".slider").each(function() {
        var $preview, $slider, optionValue, options, _ref, _ref2, _ref3, _ref4;
        $slider = $(this);
        optionValue = vintage != null ? vintage : 0;
        options = $slider.data("option").split(".");
        if ($.isObject) {
          $.each(options, function() {
            return optionValue = optionValue[this];
          });
        }
        $preview = $("#preview");
        return $slider.kendoSlider({
          min: (_ref = $slider.data("min")) != null ? _ref : 0,
          max: (_ref2 = $slider.data("max")) != null ? _ref2 : 10,
          smallStep: (_ref3 = parseFloat($slider.data("smallstep"))) != null ? _ref3 : 1,
          largeStep: (_ref4 = parseFloat($slider.data("largestep"))) != null ? _ref4 : 5,
          value: optionValue,
          tickPlacement: "none",
          change: function(value) {
            return $.publish("/image/update", [$preview, options, value.value]);
          }
        });
      });
      return $window.open().center();
    };
    return pub = {
      init: function(containerId) {
        $.subscribe('/customize', function(effect, sender) {
          return customizeEffect(sender);
        });
        return $window = $("<div id='customize'></div>").kendoWindow({
          visible: false,
          modal: true,
          title: "Customize Your Image",
          animation: {
            open: {
              effects: "slideIn:up fadeIn",
              duration: 500
            },
            close: {
              effects: "slide:up fadeOut",
              duration: 500
            }
          }
        }).data("kendoWindow").center();
      }
    };
  });

}).call(this);
