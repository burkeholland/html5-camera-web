(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(['jQuery', 'Kendo', 'mylibs/effects/presets'], function($, kendo, presets) {
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
    applyEffect = function($image, effect) {
      $image.vintage(effect);
      return $image.data("vintage", effect);
    };
    return pub = {
      init: function() {
        return $.subscribe("/image/update", function($image, effect, value) {
          return updateImage($image, effect, value);
        });
      },
      presets: function() {
        var key, _ref, _results;
        _ref = presets.effects;
        _results = [];
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          _results.push({
            preset: key
          });
        }
        return _results;
      },
      applyPreset: function($img, preset) {
        return applyEffect($img, presets.effects[preset]);
      }
    };
  });

}).call(this);
