(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(['jQuery', 'Kendo', 'text!mylibs/customize/views/customize.html'], function($, kendo, template) {
    var $window, callback, canvas, customizeEffect, oldImage, pub, texture, viewModel, webgl;
    $window = {};
    webgl = fx.canvas();
    oldImage = new Image();
    canvas = {};
    texture = {};
    callback = {};
    viewModel = kendo.observable({
      effects: {
        brightnessContrast: {
          filter: "brightnessContrast",
          brightness: {
            isParam: true,
            value: 0
          },
          contrast: {
            isParam: true,
            value: 0
          }
        },
        vignette: {
          filter: "vignette",
          size: {
            isParam: true,
            value: 0
          },
          amount: {
            isParam: true,
            value: 0
          }
        },
        hueSaturation: {
          filter: "hueSaturation",
          hue: {
            isParam: true,
            value: 0
          },
          saturation: {
            isParam: true,
            value: 0
          }
        },
        noise: {
          filter: "noise",
          noise: {
            isParam: true,
            value: 0
          }
        },
        denoise: {
          filter: "denoise",
          denoise: {
            isParam: true,
            value: 100
          }
        }
      },
      change: function() {
        var filter, filters, key, params, value, _i, _len, _ref;
        webgl.draw(texture);
        filters = [];
        _ref = viewModel.effects;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          if (viewModel.effects[key].filter) {
            filter = viewModel.effects[key];
            params = [];
            for (key in filter) {
              if (!__hasProp.call(filter, key)) continue;
              value = filter[key];
              if (filter[key].isParam) params.push(filter[key].value);
            }
            filters.push({
              name: filter.filter,
              params: params
            });
          }
        }
        console.info(filters);
        for (_i = 0, _len = filters.length; _i < _len; _i++) {
          filter = filters[_i];
          webgl[filter.name].apply(webgl, filter.params);
        }
        return webgl.update();
      },
      yep: function() {
        callback(webgl.toDataURL());
        return $window.close();
      },
      nope: function() {
        return $window.close();
      },
      reset: function() {
        this.set("effects.brightnessContrast.brightness.value", 0);
        this.set("effects.brightnessContrast.contrast.value", 0);
        this.set("effects.vignette.size.value", 0);
        this.set("effects.vignette.amount.value", 0);
        this.set("effects.hueSaturation.hue.value", 0);
        return this.set("effects.hueSaturation.saturation.value", 0);
      }
    });
    customizeEffect = function(image, saveFunction) {
      viewModel.reset();
      oldImage.src = image.src;
      callback = saveFunction;
      return oldImage.onload = function() {
        var ctx;
        canvas.width = oldImage.width;
        canvas.height = oldImage.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height);
        texture = webgl.texture(canvas);
        webgl.draw(texture).update();
        return $window.open().center();
      };
    };
    return pub = {
      init: function(containerId) {
        var $content;
        $.subscribe('/customize', function(sender, saveFunction) {
          return customizeEffect(sender, saveFunction);
        });
        $content = $(template);
        canvas = document.createElement("canvas");
        $content.find(".canvas").append(webgl);
        $window = $content.kendoWindow({
          visible: false,
          modal: true,
          title: "",
          open: function() {
            return $.publish("/app/pause");
          },
          close: function() {
            return $.publish("/app/resume");
          },
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
        return kendo.bind($content, viewModel);
      }
    };
  });

}).call(this);
