(function() {
  var $, self;

  self = this;

  $ = jQuery;

  self.app = (function($) {
    var customize, effects, fadeInOut, img, pub, startCamera;
    effects = ["none", "default", "sepia", "grayscale", "green"];
    img = "";
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
    customize = function(sender) {
      var content, win;
      content = kendo.template($("#customizeTemplate").html());
      $("#customize").html(content(sender.src));
      win = $("#customize").data("kendoWindow");
      return win.open().center();
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
        var content;
        $("#customize").kendoWindow({
          visible: false,
          modal: true
        });
        $("#videoDrawer").delegate("img", "click", function() {
          return customize(this);
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
            preset: effect
          });
        }
      }
    };
  })($);

}).call(this);
