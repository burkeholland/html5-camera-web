(function() {
  var $, self;

  self = this;

  $ = jQuery;

  self.app = (function($) {
    var customize, effects, fadeInOut, img, pub, startCamera, updateImage, vintageDefaults;
    effects = ["none", "default", "sepia", "grayscale", "green"];
    img = "";
    vintageDefaults = {
      vignette: {
        black: 0,
        white: 0
      },
      noise: false,
      screen: {
        blue: false,
        green: false,
        red: false
      },
      desaturate: false,
      allowMultiEffect: true,
      mime: 'image/jpeg',
      viewFinder: false,
      curves: false,
      blur: false,
      callback: function() {
        return $('#saveImage').removeClass('disabled');
      }
    };
    startCamera = function() {
      if (navigator.webkitGetUserMedia) {
        return navigator.webkitGetUserMedia("video", function(stream) {
          var video;
          video = document.getElementById("stream");
          return video.src = window.webkitURL.createObjectURL(stream);
        }, function(err) {
          return console.log("Your thing is not a thing.");
        });
      } else {
        return $("<div />").kendoWindow({
          modal: true,
          title: "Soooo.....this is awkward."
        }).closest(".k-window").find(".k-window-actions").remove().end().end().append($("#templates").find("#sorry").clone()).data("kendoWindow").center().open();
      }
    };
    customize = function() {
      var $image, content, vintage, win;
      $image = $(this);
      content = kendo.template($("#customizeTemplate").html());
      $("#customize").html(content($image.attr("src")));
      vintage = $image.data("vintage");
      $(".slider").each(function() {
        var $slider, optionValue, options, _ref, _ref2, _ref3, _ref4;
        $slider = $(this);
        optionValue = vintage != null ? vintage : 0;
        options = $slider.data("option").split(".");
        if ($.isObject) {
          $.each(options, function() {
            return optionValue = optionValue[this];
          });
        }
        return $slider.kendoSlider({
          min: (_ref = $slider.data("min")) != null ? _ref : 0,
          max: (_ref2 = $slider.data("max")) != null ? _ref2 : 10,
          smallStep: (_ref3 = parseFloat($slider.data("smallstep"))) != null ? _ref3 : 1,
          largeStep: (_ref4 = parseFloat($slider.data("largestep"))) != null ? _ref4 : 5,
          value: optionValue,
          tickPlacement: "none",
          change: function(value) {
            return updateImage($image, vintage, options, value);
          }
        });
      });
      win = $("#customize").data("kendoWindow");
      return win.open().center();
    };
    fadeInOut = function(num) {
      var counters, index;
      counters = $("#countdown span");
      index = counters.length - num;
      return $(counters[index]).css("opacity", "1").animate({
        opacity: .1
      }, 1000, function() {
        if (num > 1) {
          num--;
          return fadeInOut(num);
        } else {
          return pub.takePicture();
        }
      });
    };
    updateImage = function($image, vintage, options, e) {
      var effect;
      effect = vintageDefaults;
      if (options[0] === "vignette") {
        effect.vignette[options[1]] = e.value;
      } else if (options[0] === "screen") {
        effect.screen[options[1]] = e.value;
      } else {
        effect[options[0]] = e.value;
      }
      img = "#preview";
      return $(img).vintage(effect);
    };
    return pub = {
      init: function() {
        var content;
        $("#customize").kendoWindow({
          visible: false,
          modal: true
        });
        $("#videoDrawer").delegate("img", "click", function() {
          return customize.call(this);
        });
        content = kendo.template($("#customizeTemplate").html());
        return startCamera();
      },
      startCountdown: function(startVal) {
        return fadeInOut(3);
      },
      takePicture: function() {
        var canvas, ch, ctx, cw, effect, video, _i, _len;
        $("#videoDrawer").empty();
        video = document.getElementById("stream");
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        cw = canvas.clientWidth;
        ch = canvas.clientHeight;
        ctx.drawImage(video, 0, 0, cw, ch);
        img = canvas.toDataURL("image/png");
        for (_i = 0, _len = effects.length; _i < _len; _i++) {
          effect = effects[_i];
          pub.applyEffect(effect);
        }
        return ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      applyEffect: function(effect) {
        var caption, div, image, options;
        div = $("#templates").find(".image").clone();
        image = div.find("img");
        caption = div.find(".caption");
        image.attr("src", img);
        image.kendoDraggable({
          hint: function() {
            return $("#draggable").clone();
          }
        });
        caption.html(effect);
        $("#videoDrawer").append(div);
        options = {};
        if (effect !== "none") {
          return $(image).vintage({
            preset: effect,
            callback: function() {
              return $(image).data("vintage", this);
            }
          });
        }
      }
    };
  })($);

}).call(this);
