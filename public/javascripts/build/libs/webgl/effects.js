(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var draw;
    draw = function(canvas, element, effect) {
      var texture;
      texture = canvas.texture(element);
      canvas.draw(texture);
      effect();
      canvas.update();
      return texture.destroy();
    };
    return [
      {
        name: "normal",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas;
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "bulge",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, .65);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "quadPinch",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            canvas.bulgePinch(canvas.width / 4, canvas.height / 4, canvas.width / 2, -.65);
            canvas.bulgePinch(canvas.width / 4, (canvas.height / 4) + (canvas.height / 2), canvas.width / 2, -.65);
            canvas.bulgePinch((canvas.width / 4) + (canvas.width / 2), canvas.height / 4, canvas.width / 2, -.65);
            return canvas.bulgePinch((canvas.width / 4) + (canvas.width / 2), (canvas.height / 4) + (canvas.height / 2), canvas.width / 2, -.65);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "pinch",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "swirl",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.swirl(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "zoomBlur",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.zoomBlur(canvas.width / 2, canvas.height / 2, 2, canvas.height / 5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "blockhead",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.blockhead(canvas.width / 2, canvas.height / 2, 200, 300, 1);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "mirrorLeft",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.mirror(0);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "mirrorPinch",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
            return canvas.mirror(0);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "mirrorTop",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.mirror(1.57841);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "quadRotate",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.quadRotate(0, 1, 2, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "colorHalfTone",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.colorHalftone(canvas.width / 2, canvas.height / 2, .30, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "pixelate",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.pixelate(canvas.width / 2, canvas.height / 2, 5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "hopePoster",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.hopePoster();
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "photocopy",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.photocopy(.5, frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "oldFilm",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.oldFilm(frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "vhs",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.vhs(frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "quadColor",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.quadColor([1, .2, .1], [0, .8, 0], [.25, .5, 1], [.8, .8, .8]);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "kaleidoscope",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.kaleidoscope(canvas.width / 2, canvas.height / 2, 200, 0);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "invert",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.invert();
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "chromeLogo",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.chromeLogo(canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "ghost",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            var buffer, createBuffers;
            buffer = [];
            createBuffers = function(length) {
              var _results;
              _results = [];
              while (buffer.length < length) {
                _results.push(buffer.push(canvas.texture(element)));
              }
              return _results;
            };
            createBuffers(32);
            buffer[frame++ % buffer.length].loadContentsOf(element);
            canvas.matrixWarp([-1, 0, 0, 1], false, true);
            canvas.blend(buffer[frame % 32], 0.5);
            return canvas.matrixWarp([-1, 0, 0, 1], false, true);
          };
          return draw(canvas, element, effect);
        }
      }
    ];
  });

}).call(this);
