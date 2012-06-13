(function() {

  define(['jQuery', 'Kendo', 'libs/face/ccv', 'libs/face/face'], function($, kendo) {
    var draw, face, faceCore, pub, trackFace, trackHead;
    face = {};
    draw = function(canvas, element, effect) {
      var texture;
      texture = canvas.texture(element);
      canvas.draw(texture);
      effect();
      canvas.update();
      return texture.destroy();
    };
    faceCore = function(video, canvas, prop) {
      var comp;
      if (face.lastCanvas !== canvas) {
        face.ctx = canvas.getContext("2d");
        face.ccv = null;
      }
      face.ctx.drawImage(video, 0, 0, video.width, video.height);
      face.backCtx.drawImage(video, 0, 0, face.backCanvas.width, face.backCanvas.height);
      return comp = ccv.detect_objects({
        canvas: face.backCanvas,
        cascade: cascade,
        interval: 4,
        min_neighbors: 1
      });
    };
    trackFace = function(video, canvas, prop) {
      var aspectHeight, aspectWidth, comp, i, _i, _len, _results;
      aspectWidth = video.width / face.backCanvas.width;
      aspectHeight = video.height / face.backCanvas.height;
      comp = faceCore(video, canvas, prop);
      _results = [];
      for (_i = 0, _len = comp.length; _i < _len; _i++) {
        i = comp[_i];
        _results.push(face.ctx.drawImage(prop, i.x * aspectWidth, i.y * aspectHeight, i.width * aspectWidth, i.height * aspectHeight));
      }
      return _results;
    };
    trackHead = function(video, canvas, prop) {
      var aspectHeight, aspectWidth, comp, height, i, _i, _len, _results;
      aspectWidth = video.width / face.backCanvas.width;
      height = (video.height / video.width) * face.backCanvas.width;
      aspectHeight = height / face.backCanvas.height;
      comp = faceCore(video, canvas, prop);
      _results = [];
      for (_i = 0, _len = comp.length; _i < _len; _i++) {
        i = comp[_i];
        _results.push(face.ctx.drawImage(prop, i.x * aspectWidth, (i.y * aspectHeight) - ((i.height * aspectHeight) / 2), i.width * aspectWidth, i.height * aspectHeight));
      }
      return _results;
    };
    return pub = {
      init: function() {
        face.backCanvas = document.createElement("canvas");
        face.backCanvas.width = 200;
        face.lastCanvas = {};
        face.backCtx = face.backCanvas.getContext("2d");
        face.props = {};
        face.props.glasses = new Image();
        face.props.glasses.src = "images/glasses.png";
        face.props.sombraro = new Image();
        face.props.sombraro.src = "images/sombraro.png";
        face.props.horns = new Image();
        return face.props.horns.src = "images/horns.png";
        /*
                    face.images.glasses = "images/glasses.png"
                    face.images.hipster = "images/hipster.png"
                    face.images.halo = "images/halo.png"
                    face.images.sombrero = "images/sombrero.png"
                    face.images.horns = "images/horns.png"
        */
      },
      data: [
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
          name: "glasses",
          type: "face",
          filter: function(canvas, video) {
            return trackFace(video, canvas, face.props.glasses);
          }
        }
      ]
    };
  });

}).call(this);
