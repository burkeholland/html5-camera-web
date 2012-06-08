(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(['jQuery', 'Kendo', 'mylibs/camera/camera', 'text!mylibs/camera/views/snapshot.html', 'mylibs/effects/effects', 'mylibs/effects/presets'], function($, kendo, camera, snapshot, effects, presets) {
    var $button, $container, $countdown, $video, applyEffect, effectsList, pub;
    $button = {};
    $video = {};
    $container = {};
    $countdown = {};
    effectsList = [];
    applyEffect = function(div, image) {
      var key, _ref;
      if (effectsList.length === 0) {
        _ref = presets.effects;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          effectsList.push({
            preset: key
          });
        }
      }
      return div.find(".presets").kendoDropDownList({
        dataSource: {
          data: effectsList
        },
        dataTextField: "preset",
        change: function() {
          return effects.applyPreset(image, this.value());
        }
      });
    };
    return pub = {
      init: function(videoId, buttonsId, countdownId, containerId) {
        $video = $("#" + videoId);
        $container = $("#" + containerId);
        $countdown = $("#" + countdownId);
        $.subscribe("/camera/turnOn", function(norm) {
          return turnOn(norm);
        });
        $.subscribe('/camera/takePicture', function() {
          return countdown(3, captureImage(attachSnapshot));
        });
        $.subscribe("/camera/takePicturePB", function() {
          return photoBooth(3);
        });
        return $("#" + buttonsId).on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
      }
    };
  });

}).call(this);
