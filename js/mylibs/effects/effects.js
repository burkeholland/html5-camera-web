(function() {

  define(['jQuery', 'Kendo', 'mylibs/effects/presets', 'libs/vintage/vintage'], function($, kendo, presets) {
    var applyEffect, pub, updateImage, vintageDefaults;
    vintageDefaults = {
      vignette: {
        black: 0,
        white: 0
      },
      noise: false,
      screen: {
        blue: false,
        green: false,
        red: false,
        strength: 0
      },
      desaturate: false,
      allowMultiEffect: true,
      mime: 'image/jpeg',
      viewFinder: false,
      curves: false,
      blur: false,
      preset: "custom",
      callback: function() {}
    };
    updateImage = function($image, options, value) {
      var effect;
      effect = vintageDefaults;
      if (options[0] === "vignette") {
        effect.vignette[options[1]] = value;
      } else if (options[0] === "screen") {
        effect.screen[options[1]] = value;
      } else {
        effect[options[0]] = value;
      }
      return $image.vintage(effect);
    };
    applyEffect = function(effect) {
      return $image.vintage(effect);
    };
    return pub = {
      init: function() {
        return $.subscribe("/image/update", function($image, effect, value) {
          return updateImage($image, effect, value);
        });
      },
      applyPreset: function($img, preset) {
        return $img.vintage(presets.effects[preset]);
      }
    };
  });

}).call(this);
