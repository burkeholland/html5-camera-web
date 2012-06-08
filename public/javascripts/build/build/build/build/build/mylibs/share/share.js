(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/utils', 'text!mylibs/share/views/download.html', 'text!mylibs/share/views/tweet.html'], function($, kendo, utils, downloadView, tweet) {
    var openCenteredWindow, pub, shareWindow, twitter_token;
    shareWindow = {};
    twitter_token = "";
    openCenteredWindow = function(url) {
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
        var twitter;
        if (childWindow && childWindow.closed) {
          window.clearInterval(intervalID);
          twitter = sessionStorage.getItem("twitter");
          if (twitter) return $(".tweet").show();
        }
      };
      return intervalID = window.setInterval(checkWindow, 500);
    };
    return pub = {
      twitter_token: "",
      init: function() {
        $.subscribe("/share/download", function($img) {
          var img, src;
          img = new Image();
          img.src = $img.src;
          src = utils.elToDataURI(img);
          utils.saveImage(src);
          return delete img;
        });
        $.subscribe("/share/tweet", function(src) {
          var template;
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
        return shareWindow = $("<div id='share'></div>").kendoWindow({
          modal: true,
          visible: false
        }).data("kendoWindow");
      },
      download: function(el) {
        var dataURI;
        dataURI = utils.elToDataURI(el);
        return $("" + downloadView + " > button").data("uri", dataURI);
      }
    };
  });

}).call(this);
