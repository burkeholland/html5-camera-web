(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/utils', 'text!mylibs/share/views/tweet.html'], function($, kendo, utils, template) {
    var $window, events, openCenteredWindow, pub, shareWindow, twitter_token, viewModel;
    shareWindow = {};
    twitter_token = "";
    $window = {};
    events = {};
    viewModel = kendo.observable({
      src: "",
      twitter: false,
      tweet: function() {
        var callback;
        callback = function() {
          var blob, fd;
          blob = utils.blobFromImg($("#imageToShare")[0]);
          fd = new FormData();
          fd.append("file", blob);
          return $.ajax({
            url: "share/tweet",
            data: fd,
            type: "POST",
            processData: false,
            contentType: false
          });
        };
        return openCenteredWindow(callback);
      }
    });
    openCenteredWindow = function(url, callback) {
      var A, B, C, checkWindow, childWindow, intervalID, u, v, x, y, z;
      y = 700;
      C = window.screenX || 0;
      B = C ? $(window).width() : screen.availWidth;
      A = 520;
      u = window.screenY || 0;
      x = u ? $(window).height() : screen.availHeight;
      v = C + (B - y) / 2;
      z = u + (x - A) / 2;
      childWindow = window.open("authenticate/twitter", "auth", "resizable=yes,toolbar=no,scrollbars=yes,status=no,width=" + y + ",height=" + A + ",left=" + v + ",top=" + z);
      checkWindow = function() {
        if (childWindow && childWindow.closed) {
          window.clearInterval(intervalID);
          window.APP.twitter = sessionStorage.getItem("twitter");
          return callback();
        }
      };
      return intervalID = window.setInterval(checkWindow, 500);
    };
    return pub = {
      twitter_token: "",
      tweet: function(src) {
        viewModel.set("src", src);
        return $window.open();
      },
      init: function() {
        var $content;
        window.APP.twitter = sessionStorage.getItem("twitter");
        $content = $(template);
        $window = $content.kendoWindow({
          visible: false,
          modal: true,
          title: "",
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
        kendo.bind($content, viewModel);
        $.subscribe("/share/download", function($img) {
          var img, src;
          img = new Image();
          img.src = $img.src;
          src = utils.elToDataURI(img);
          utils.saveImage(src);
          return delete img;
        });
        $.subscribe("/share/tweet", function(src) {
          var tweet;
          template = kendo.template(tweet);
          tweet = template({
            src: src
          });
          return shareWindow.content(tweet).open().center();
        });
        $('#twitter-sign-in').click(function(e) {
          openCenteredWindow("twitter");
          return e.preventDefault();
        });
        return {
          download: function(el) {
            var dataURI;
            dataURI = utils.elToDataURI(el);
            return $("" + downloadView + " > button").data("uri", dataURI);
          }
        };
      }
    };
  });

}).call(this);
