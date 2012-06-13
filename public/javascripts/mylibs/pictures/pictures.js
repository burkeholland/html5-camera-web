(function() {

  define(['jQuery', 'Kendo', 'mylibs/file/file', 'mylibs/share/share', 'text!mylibs/pictures/views/picture.html'], function($, kendo, file, share, picture) {
    var $container, pub;
    $container = {};
    return pub = {
      init: function(containerId) {
        $container = $("#" + containerId);
        $container.masonry();
        $.subscribe("/pictures/reload", function() {
          return pub.reload();
        });
        return $.subscribe("/pictures/create", function(src, name, polaroid, save, animation, photoStrip) {
          var $div, $img, callback, opacity;
          $div = $(picture);
          $img = $div.find(".picture").attr("src", src).css("opacity", 1);
          if (save) {
            name = name || new Date().getTime() + ".png";
            if (photoStrip) name = "p_" + name;
            file.save(name, src);
          }
          callback = function() {
            $img.attr("src", arguments[0]);
            return file.save(name, arguments[0]);
          };
          $img.on("click", function() {
            return $.publish("/customize", [this, callback]);
          });
          $img.addClass("pointer");
          $img.load(function() {
            return $container.masonry("reload");
          });
          if (polaroid) {
            opacity = 0;
            $.subscribe("/shake/beta", function() {
              opacity = parseFloat($wrap.css("opacity"));
              if (opacity < 1) {
                opacity = opacity + .03;
                return $img.css("opacity", opacity);
              } else {
                return $.unsubscribe("/shake/beta");
              }
            });
          } else {
            if (save) file.save(name, $img.attr("src"));
          }
          $div.on("click", ".download", function() {
            return file.download($img[0]);
          });
          $div.on("click", ".intent", function() {
            return share.tweet($img.attr("src"));
          });
          $div.on("click", ".trash", function() {
            $.subscribe("/file/deleted/" + name, function() {
              $div.kendoStop(true).kendoAnimate({
                effects: "zoomOut fadeOut",
                hide: true,
                duration: 500,
                complete: function() {
                  $div.remove();
                  return $container.masonry("reload");
                }
              });
              return $.unsubscribe("file/deleted/" + name);
            });
            return file["delete"](name);
          });
          return $container.append($div);
        });
      },
      reload: function() {
        return $container.masonry("reload");
      }
    };
  });

}).call(this);
