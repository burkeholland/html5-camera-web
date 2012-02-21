(function() {

  define(['jQuery', 'Kendo', 'libs/vintage/vintage'], function($, kendo) {
    var pub;
    return pub = {
      init: function() {},
      applyPreset: function($img, preset) {
        return $img.vintage({
          preset: preset
        });
      },
      updateImage: function(effect) {
        return $image.vintage(effect);
      }
    };
  });

}).call(this);
