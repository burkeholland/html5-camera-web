(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'text!mylibs/camera/views/snapshot.html', 'mylibs/effects/effects', 'mylibs/effects/presets', 'libs/vintage/vintage'], function($, kendo, camera, snapshot, effects, presets) {
    var $button, $container, $countdown, $video, applyEffect, captureImage, countdown, effectsList, pub, turnOn;
    $button = {};
    $video = {};
    $container = {};
    $countdown = {};
    effectsList = [];
    turnOn = function() {
      return navigator.webkitGetUserMedia("video", function(stream) {
        return $video.attr("src", window.webkitURL.createObjectURL(stream));
      }, function(err) {
        return console.log("Your thing is not a thing.");
      });
    };
    captureImage = function() {
      var canvas, ctx, imgData, src, video;
      canvas = $("<canvas width='500' height='400'></canvas>").get(0);
      video = document.getElementById("stream");
      ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, video.width, video.height);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imgData, 0, 0);
      src = canvas.toDataURL("image/jpeg");
      return applyEffect("none", src);
    };
    applyEffect = function(effect, src) {
      var div, image, key, _ref;
      div = $(snapshot);
      image = div.find("img").attr("src", src).data("vintagesource", src).on("click", function() {
        return $.publish("/customize", [effect, this]);
      });
      if (effectsList.length === 0) {
        _ref = presets.effects;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          effectsList.push({
            preset: key
          });
        }
      }
      div.find(".presets").kendoDropDownList({
        dataSource: {
          data: effectsList
        },
        dataTextField: "preset",
        change: function() {
          return effects.applyPreset(image, this.value());
        }
      });
      return div.appendTo($container);
    };
    countdown = function(num) {
      var counters, index;
      counters = $countdown.find("span");
      index = counters.length - num;
      return $(counters[index]).css("opacity", "1").animate({
        opacity: .1
      }, 1000, function() {
        if (num > 1) {
          num--;
          return countdown(num);
        } else {
          return captureImage();
        }
      });
    };
    return pub = {
      init: function(videoId, buttonId, countdownId, containerId) {
        $button = $("#" + buttonId);
        $video = $("#" + videoId);
        $container = $("#" + containerId);
        $countdown = $("#" + countdownId);
        $.subscribe("/camera/turnOn", function() {
          return turnOn();
        });
        $.subscribe('/camera/takePicture', function() {
          return countdown(3);
        });
        return $button.on("click", function() {
          return $.publish($(this).data("event"));
        });
      }
    };
  });

}).call(this);
