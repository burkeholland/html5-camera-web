(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/normalize', 'mylibs/controls/controls', 'mylibs/camera/modes/camera.modes.snapshot', 'mylibs/camera/modes/camera.modes.photobooth', 'text!mylibs/camera/views/awkward.html'], function($, kendo, normalize, controls, snapshot, photobooth, awkward) {
    var $counter, canvas, draw, pub, turnOn, video;
    $counter = {};
    canvas = {};
    video = {};
    draw = function(canvas, ctx, video) {
      return ctx.drawImage(video, 0, 0, video.width, video.height);
    };
    turnOn = function() {
      var errback, hollaback;
      hollaback = function(stream) {
        var ctx, videoDiv;
        video = document.createElement("video");
        videoDiv = document.createElement('div');
        document.body.appendChild(videoDiv);
        videoDiv.appendChild(video);
        videoDiv.setAttribute("style", "display:none;");
        canvas = document.getElementById("screen");
        video.width = canvas.width;
        video.height = canvas.height;
        $(video).attr("src", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
        ctx = canvas.getContext('2d');
        video.play();
        return window.setInterval(function() {
          return draw(canvas, ctx, video);
        }, 1000 / 67);
      };
      errback = function() {
        return console.log("Your thing is not a thing.");
      };
      if (navigator.getUserMedia) {
        return navigator.getUserMedia(normalize({
          video: true,
          audio: false
        }), hollaback, errback);
      }
    };
    return pub = {
      init: function(videoId, buttonsId, countdownId, containerId) {
        var $window;
        if (navigator.getUserMedia) {
          $counter = $("#" + countdownId);
          controls.init(buttonsId);
          snapshot.init(this, containerId);
          photobooth.init(this);
          return turnOn();
        } else {
          return $window = $("<div />").kendoWindow({
            visible: false,
            modal: true,
            title: "Soooo.....this is awkward."
          }).closest(".k-window").find(".k-window-actions").remove().end().end().append(awkward).data("kendoWindow").center().open();
        }
      },
      countdown: function(num, hollaback) {
        var counters, index;
        counters = $counter.find("span");
        index = counters.length - num;
        return $(counters[index]).css("opacity", "1").animate({
          opacity: .1
        }, 1000, function() {
          if (num > 1) {
            num--;
            return pub.countdown(num, hollaback);
          } else {
            return $(canvas).fadeOut(500).fadeIn(300, function() {
              $(canvas).show();
              if ($.isFunction(hollaback)) return hollaback();
            });
          }
        });
      },
      capture: function(callback) {
        var ctx, imgData, src;
        ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, video.width, video.height);
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imgData, 0, 0);
        src = canvas.toDataURL("image/jpeg");
        return src;
      }
    };
  });

}).call(this);
