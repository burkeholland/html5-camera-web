(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera.events', 'text!mylibs/camera/views/awkward.html'], function($, kendo, events, awkward) {
    var normalize, pub;
    normalize = function() {
      var norm, optionStyle;
      window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);
      navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      optionStyle = (function(win) {
        var el, f, nop, object, root, string;
        if (!navigator.getUserMedia) return;
        el = document.createElement("iframe");
        root = document.body || document.documentElement;
        string = true;
        object = true;
        nop = function() {};
        root.appendChild(el);
        f = win.frames[win.frames.length - 1];
        f.navigator.getUserMedia || (f.navigator.getUserMedia = f.navigator.webkitGetUserMedia || f.navigator.mozGetuserMedia || f.navigator.msGetUserMedia);
        try {
          f.navigator.getUserMedia({
            video: true
          }, nop);
        } catch (e) {
          object = false;
          try {
            f.navigator.getUserMedia("video", nop);
          } catch (e) {
            string = false;
          }
        } finally {
          root.removeChild(el);
          el = null;
        }
        return {
          string: string,
          object: object
        };
      })(window);
      return norm = function(opts) {
        var o, stringOptions;
        stringOptions = [];
        if (optionStyle.string && !optionStyle.object) {
          for (o in opts) {
            if (opts[o] === true) stringOptions.push(o);
          }
          return stringOptions.join(" ");
        } else {
          return opts;
        }
      };
    };
    return pub = {
      init: function(videoId, buttonId, countdownId, containerId) {
        var $window, norm;
        events.init(videoId, buttonId, countdownId, containerId);
        norm = normalize();
        if (navigator.getUserMedia) {
          return $.publish("/camera/turnOn", [norm]);
        } else {
          return $window = $("<div />").kendoWindow({
            visible: false,
            modal: true,
            title: "Soooo.....this is awkward."
          }).closest(".k-window").find(".k-window-actions").remove().end().end().append(awkward).data("kendoWindow").center().open();
        }
      }
    };
  });

}).call(this);
