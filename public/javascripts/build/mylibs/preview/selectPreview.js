(function() {

  define(['jQuery', 'Kendo', 'libs/webgl/effects', 'mylibs/utils/utils', 'text!mylibs/preview/views/preview.html'], function($, kendo, effects, utils, template) {
    var $container, canvas, draw, frame, paused, previews, pub, update, video, webgl;
    paused = false;
    canvas = {};
    video = {};
    previews = [];
    $container = {};
    webgl = fx.canvas();
    frame = 0;
    update = function() {
      var canvas2d, preview, _i, _len, _results;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        _results = [];
        for (_i = 0, _len = previews.length; _i < _len; _i++) {
          preview = previews[_i];
          if (frame === 200) {
            frame = 0;
          } else {
            frame = frame + 1;
          }
          _results.push(preview.filter(preview.canvas, canvas, frame));
        }
        return _results;
      }
    };
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    return pub = {
      draw: function() {
        return draw();
      },
      init: function(container, c, v) {
        var $currentPage, $nextPage, ds;
        $.subscribe("/previews/show", function() {
          video.width = canvas.width = 200;
          video.height = canvas.height = 150;
          return $container.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
              return paused = false;
            }
          });
        });
        previews = [];
        canvas = document.createElement("canvas");
        video = v;
        $container = $("#" + container);
        video.width = canvas.width = 200;
        video.height = canvas.height = 150;
        $currentPage = {};
        $nextPage = {};
        ds = new kendo.data.DataSource({
          data: effects,
          pageSize: 6,
          change: function() {
            var item, _i, _len, _ref, _results;
            $currentPage = $container.find(".current-page");
            $nextPage = $container.find(".next-page");
            paused = true;
            previews = [];
            _ref = this.view();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push((function() {
                var $a, preview;
                preview = {};
                $.extend(preview, item);
                preview.name = item.name;
                preview.canvas = fx.canvas();
                previews.push(preview);
                $a = $("<a href='#' class='preview'></a>").append(preview.canvas).click(function() {
                  paused = true;
                  $("footer").kendoStop(true).kendoAnimate({
                    effects: "fadeOut",
                    hide: true,
                    duration: 200
                  });
                  $container.kendoStop(true).kendoAnimate({
                    effects: "zoomOut fadeOut",
                    hide: true,
                    duration: 500
                  });
                  return $.publish("/preview/show", [preview]);
                });
                $nextPage.append($a);
                $currentPage.kendoStop(true).kendoAnimate({
                  effects: "slide:down fadeOut",
                  duration: 500,
                  hide: true,
                  complete: function() {
                    $currentPage.removeClass("current-page").addClass("next-page");
                    return $currentPage.find("a").remove();
                  }
                });
                return $nextPage.kendoStop(true).kendoAnimate({
                  effects: "fadeIn",
                  duration: 500,
                  show: true,
                  complete: function() {
                    $nextPage.removeClass("next-page").addClass("current-page");
                    return paused = false;
                  }
                });
              })());
            }
            return _results;
          }
        });
        $container.on("click", ".more", function() {
          paused = true;
          if (ds.page() < ds.totalPages()) {
            return ds.page(ds.page() + 1);
          } else {
            return ds.page(1);
          }
        });
        return ds.read();
      },
      pause: function() {
        return paused = true;
      },
      resume: function() {
        return paused = false;
      },
      capture: function(callback) {
        return webgl.ToDataURL;
      }
    };
  });

}).call(this);
