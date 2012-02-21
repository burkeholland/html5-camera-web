(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'text!mylibs/camera/views/snapshot.html', 'mylibs/effects/effects', 'libs/vintage/vintage'], function($, kendo, camera, snapshot, effects) {
    var $button, $container, $countdown, $video, applyEffect, captureImage, countdown, pub, turnOn;
    $button = {};
    $video = {};
    $container = {};
    $countdown = {};
    turnOn = function() {
      return navigator.webkitGetUserMedia("video", function(stream) {
        return $video.attr("src", window.webkitURL.createObjectURL(stream));
      }, function(err) {
        return console.log("Your thing is not a thing.");
      });
    };
    captureImage = function() {
      var canvas, ctx, effect, imgData, src, video, _i, _len, _ref, _results;
      $container.empty();
      canvas = $("<canvas width='500' height='400'></canvas>").get(0);
      video = document.getElementById("stream");
      ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, video.width, video.height);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imgData, 0, 0);
      src = canvas.toDataURL("image/jpeg");
      _ref = ["none", "default", "sepia", "green", "grayscale"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        effect = _ref[_i];
        _results.push(applyEffect(effect, src, $container));
      }
      return _results;
    };
    applyEffect = function(effect, src) {
      var div, image;
      div = $(snapshot);
      image = div.find("img").attr("src", src).on("click", function() {
        return $.publish("/customize", [effect, this]);
      });
      if (effect !== "none") effects.applyPreset(image, effect);
      return div.find(".caption").text(effect).end().appendTo($container);
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
        $.subscribe("/camera/turnOn", function(pub) {
          return turnOn();
        });
        $.subscribe('/camera/takePicture', function(pub) {
          return countdown(3);
        });
        return $button.on("click", function() {
          return $.publish($(this).data("event"), [pub]);
        });
      }
    };
  });

}).call(this);
