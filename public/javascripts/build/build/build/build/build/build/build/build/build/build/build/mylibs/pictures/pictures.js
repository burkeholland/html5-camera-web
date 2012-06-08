(function() {

  define(['jQuery', 'Kendo', 'mylibs/effects/effects', 'mylibs/file/file', 'text!mylibs/pictures/views/picture.html'], function($, kendo, effects, file, picture) {
    var $container, pub;
    $container = {};
    return pub = {
      init: function(containerId) {
        $container = $("#" + containerId);
        $container.masonry();
        return $.subscribe("/pictures/create", function(src, name, polaroid, save, animation) {
          var $div, $img, opacity, presets;
          $div = $(picture);
          name = name || new Date().getTime() + ".png";
          $img = $div.find(".picture").attr("src", src).data("vintagesource", src).on("click", function() {
            return $.publish("/customize", [this]);
          }).css("opacity", 0);
          $div.appendTo($container);
          presets = effects.presets();
          /*
          				$div.find(".presets").kendoDropDownList(
          					dataSource:
          						data: presets
          					dataTextField: "preset"
          					change: ->
          					    effects.applyPreset $img, @value()
          				)
          */
          if (animation) {
            $div.kendoStop(true).kendoAnimate(animation, {
              complete: function() {
                return reload();
              }
            });
          }
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
            $img.css("opacity", 1);
            if (save) file.save(name, $img.attr("src"));
          }
          $div.on("click", ".download", function() {
            return $.publish("/share/download", [$img]);
          });
          $div.find(".twitter-share-button").data("url", $img.attr("src"));
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
