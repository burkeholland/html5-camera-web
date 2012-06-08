(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var presets;
    return presets = function(width, height) {
      var centerX, centerY;
      centerX = width / 2;
      centerY = height / 2;
      return [
        {
          type: "none",
          method: "normal"
        }, {
          type: "shader",
          method: "bulgePinch",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 1.5,
            strength: 65
          }
        }, {
          type: "shader",
          method: "bulgePinch",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 2,
            strength: -.65
          }
        }, {
          type: "shader",
          method: "ink",
          hasFrames: false,
          params: {
            strength: .5
          }
        }, {
          type: "shader",
          method: "swirl",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 2,
            angle: -5
          }
        }, {
          type: "shader",
          method: "zoomBlur",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            strength: .8
          }
        }, {
          type: "shader",
          method: "colorHalftone",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            angle: .30,
            size: 3
          }
        }, {
          type: "shader",
          method: "hexagonalPixelate",
          hasFrames: false,
          params: {
            centerX: centerX,
            centery: centerY,
            scale: 8
          }
        }, {
          type: "shader",
          method: "blockhead",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            width: 200,
            height: 200,
            strength: .5
          }
        }, {
          type: "shader",
          method: "oldFilm",
          hasFrames: true,
          params: {
            frame: 0
          },
          range: {
            min: 0,
            max: 200,
            start: 0,
            step: 1
          }
        }, {
          type: "shader",
          method: "vhs",
          hasFrames: true,
          params: {
            frame: 0
          },
          range: {
            min: 0,
            max: 200,
            start: 0,
            step: 1
          }
        }
      ];
    };
  });

}).call(this);
