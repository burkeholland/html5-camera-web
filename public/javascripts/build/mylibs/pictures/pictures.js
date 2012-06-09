(function() {

  define(['jQuery', 'Kendo', 'mylibs/effects/effects', 'mylibs/file/file', 'mylibs/share/twitpic', 'text!mylibs/pictures/views/picture.html'], function($, kendo, effects, file, twitpic, picture) {
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
          var $div, $img, callback, opacity, presets;
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
          if (!name.substring(0, 1) === "p") {
            $img.on("click", function() {
              return $.publish("/customize", [this, callback]);
            });
            $img.addClass("pointer");
          }
          $container.append($div);
          if (animation) $div.kendoStop(true).kendoAnimate(animation);
          $img.load(function() {
            return $container.masonry("reload");
          });
          presets = effects.presets();
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
          $div.on("click", ".tweet", function() {
            var intent;
            intent = new Intent("http://webintents.org/share", "image/*", $img.attr("src"));
            return window.navigator.startActivity(intent, function(data) {});
          });
          return $div.on("click", ".trash", function() {
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
        });
      },
      reload: function() {
        return $container.masonry("reload");
      }
    };
  });

}).call(this);
