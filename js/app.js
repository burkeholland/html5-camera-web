(function() {
  var $, self;

  self = this;

  $ = jQuery;

  self.app = (function($) {
    var customize, effects, fadeInOut, img, pub, startCamera;
    effects = ["none", "default", "sepia", "grayscale", "green"];
    img = "";
    startCamera = function() {
      var sorry;
      if (!navigator.webkitGetUserMedia) {
        $("#main").hide();
        sorry = $("#templates").find("#sorry").clone();
        return $("body").append(sorry);
      } else {
        $("#main").show();
        return navigator.webkitGetUserMedia("video", function(stream) {
          var video;
          video = document.getElementById("stream");
          return video.src = window.webkitURL.createObjectURL(stream);
        }, function(err) {
          return console.log("Your thing is not a thing.");
        });
      }
    };
    customize = function(sender) {
      var win;
      $("#custom").find("img").attr("src", sender.src);
      win = $("#custom").data("kendoWindow");
      win.open();
      return win.center();
    };
    fadeInOut = function(num) {
      var counters, index;
      counters = $("#countdown h1");
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
    return pub = {
      init: function() {
        $("#custom").kendoWindow({
          visible: false,
          modal: true
        });
        $("#videoDrawer").delegate("img", "click", function() {
          return customize(this);
        });
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
        caption.html(effect);
        $("#videoDrawer").append(div);
        options = {};
        if (effect !== "none") {
          return $(image).vintage({
            preset: effect
          });
        }
      }
    };
  })($);

}).call(this);
