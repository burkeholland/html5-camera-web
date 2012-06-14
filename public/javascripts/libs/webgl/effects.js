(function() {

  define(['jQuery', 'Kendo', 'libs/face/ccv', 'libs/face/face'], function($, kendo) {
    var draw, face, faceCore, ghostBuffer, pub, timeStripsBuffer, trackFace, trackHead;
    face = {
      props: {
        glasses: new Image(),
        horns: new Image(),
        hipster: new Image(),
        sombraro: new Image(),
        backCanvas: {},
        width: 200
      },
      backCanvas: document.createElement("canvas"),
      comp: [],
      lastCanvas: {},
      backCtx: {}
    };
    timeStripsBuffer = [];
    ghostBuffer = [];
    draw = function(canvas, element, effect) {
      var texture;
      texture = canvas.texture(element);
      canvas.draw(texture);
      effect();
      canvas.update();
      return texture.destroy();
    };
    faceCore = function(video, canvas, prop, callback) {
      var comp;
      if (face.lastCanvas !== canvas) {
        face.ctx = canvas.getContext("2d");
        face.ccv = null;
      }
      face.ctx.drawImage(video, 0, 0, video.width, video.height);
      face.backCtx.drawImage(video, 0, 0, face.backCanvas.width, face.backCanvas.height);
      if (!pub.isPreview) {
        return comp = ccv.detect_objects({
          canvas: face.backCanvas,
          cascade: cascade,
          interval: 4,
          min_neighbors: 1
        });
      } else {
        return [
          {
            x: video.width * .375,
            y: video.height * .375,
            width: video.width / 4,
            height: video.height / 4
          }
        ];
      }
    };
    trackFace = function(video, canvas, prop, xoffset, yoffset, xscaler, yscaler) {
      var aspectHeight, aspectWidth, comp, i, _i, _len, _ref, _results;
      aspectWidth = video.width / face.backCanvas.width;
      face.backCanvasheight = (video.height / video.width) * face.backCanvas.width;
      aspectHeight = video.height / face.backCanvas.height;
      comp = faceCore(video, canvas, prop);
      if (comp.length) face.comp = comp;
      _ref = face.comp;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(face.ctx.drawImage(prop, (i.x * aspectWidth) - (xoffset * aspectWidth), (i.y * aspectHeight) - (yoffset * aspectHeight), (i.width * aspectWidth) * xscaler, (i.height * aspectWidth) * yscaler));
      }
      return _results;
    };
    trackHead = function(video, canvas, prop, xOffset, yOffset, width, height) {
      var aspectHeight, aspectWidth, comp, i, _i, _len, _ref, _results;
      aspectWidth = video.width / face.backCanvas.width;
      face.backCanvasheight = (video.height / video.width) * face.backCanvas.width;
      aspectHeight = video.height / face.backCanvas.height;
      comp = faceCore(video, canvas, prop);
      if (comp.length) face.comp = comp;
      _ref = face.comp;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(face.ctx.drawImage(prop, i.x * aspectWidth - (xOffset * aspectWidth), (i.y * aspectHeight) - (yOffset * aspectHeight), (i.width * aspectWidth) + (width * aspectWidth), (i.height * aspectHeight) + (height * aspectHeight)));
      }
      return _results;
    };
    return pub = {
      isPreview: true,
      clearBuffer: function() {
        timeStripsBuffer = [];
        return ghostBuffer = [];
      },
      init: function() {
        face.backCtx = face.backCanvas.getContext("2d");
        face.props.glasses.src = "images/glasses.png";
        face.props.horns.src = "images/horns.png";
        face.props.hipster.src = "images/hipster.png";
        return face.props.sombraro.src = "images/sombraro.png";
      },
      data: [
        {
          name: "Normal",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas;
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Bulge",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, .65);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Pinch",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Swirl",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.swirl(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, 3);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Zoom Blur",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.zoomBlur(canvas.width / 2, canvas.height / 2, 2, canvas.height / 5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Blockhead",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.blockhead(canvas.width / 2, canvas.height / 2, 200, 300, 1);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Mirror Left",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.mirror(0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Mirror Pinch (Evil)",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
              return canvas.mirror(0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Mirror Top",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.mirror(Math.PI * .5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Mirror Bottom",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.mirror(Math.PI * 1.5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Mirror Tube",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.mirrorTube(canvas.width / 2, canvas.height / 2, canvas.height / 4);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Quad",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.quadRotate(0, 0, 0, 0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Quad Color",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.quadColor([1, .2, .1], [0, .8, 0], [.25, .5, 1], [.8, .8, .8]);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Comix",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              canvas.quadRotate(0, 0, 0, 0);
              canvas.denoise(50);
              return canvas.ink(.5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "I Dont' Know",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              canvas.quadRotate(0, 0, 0, 0);
              canvas.denoise(50);
              canvas.ink(1);
              return canvas.quadColor([1, .2, .1], [0, .8, 0], [.25, .5, 1], [.8, .8, .8]);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Color Half Tone",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.colorHalftone(canvas.width / 2, canvas.height / 2, .30, 3);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Pixelate",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.pixelate(canvas.width / 2, canvas.height / 2, 5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Hope Poster",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.hopePoster();
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Photocopy",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              return canvas.photocopy(.5, frame);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Old Film",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              return canvas.oldFilm(frame);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "VHS",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              return canvas.vhs(frame);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Time Strips",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              var createBuffers;
              createBuffers = function(length) {
                var _results;
                _results = [];
                while (timeStripsBuffer.length < length) {
                  _results.push(timeStripsBuffer.push(canvas.texture(element)));
                }
                return _results;
              };
              createBuffers(32);
              timeStripsBuffer[frame++ % timeStripsBuffer.length].loadContentsOf(element);
              canvas.timeStrips(timeStripsBuffer, frame);
              return canvas.matrixWarp([-1, 0, 0, 1], false, true);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Your Ghost",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              var createBuffers;
              createBuffers = function(length) {
                var _results;
                _results = [];
                while (ghostBuffer.length < length) {
                  _results.push(ghostBuffer.push(canvas.texture(element)));
                }
                return _results;
              };
              createBuffers(32);
              ghostBuffer[frame++ % ghostBuffer.length].loadContentsOf(element);
              canvas.matrixWarp([1, 0, 0, 1], false, true);
              canvas.blend(ghostBuffer[frame % ghostBuffer.length], .5);
              return canvas.matrixWarp([-1, 0, 0, 1], false, true);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Chromed",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function() {
              return canvas.chromeLogo(canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Kaleidoscope",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.kaleidoscope(canvas.width / 2, canvas.height / 2, 200, 0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "Inverted",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function() {
              return canvas.invert();
            };
            return draw(canvas, element, effect);
          }
        }, {
          name: "In Disguise",
          kind: "face",
          filter: function(canvas, video) {
            return trackFace(video, canvas, face.props.glasses, 0, 0, 1, 1);
          }
        }, {
          name: "Horns",
          kind: "face",
          filter: function(canvas, video) {
            return trackHead(video, canvas, face.props.horns, 0, 25, 0, 0);
          }
        }, {
          name: "Hipsterizer",
          kind: "face",
          filter: function(canvas, video) {
            return trackFace(video, canvas, face.props.hipster, 0, 0, 1, 2.2);
          }
        }
      ]
    };
  });

}).call(this);
