(function() {

  define(['jQuery', 'Kendo', 'libs/webgl/effects', 'mylibs/utils/utils', 'text!mylibs/preview/views/preview.html'], function($, kendo, effects, utils, template) {
    var $container, canvas, draw, paused, previews, pub, update, video;
    paused = false;
    canvas = {};
    video = {};
    previews = [];
    $container = {};
    update = function() {
      var canvas2d, name, texture, _i, _len, _results;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        _results = [];
        for (_i = 0, _len = previews.length; _i < _len; _i++) {
          name = previews[_i];
          texture = name.canvas.texture(canvas);
          if (name.type === "shader") {
            if (name.hasFrames) {
              name.canvas.draw(texture)[name.method].apply(name.canvas, [name.params.frame]).update();
              if (name.params.frame < name.range.max) {
                ++name.params.frame;
              } else {
                name.params.frame = 0;
              }
            } else {
              name.canvas.draw(texture)[name.method].apply(name.canvas, name.paramsArray).update();
            }
          } else {
            name.canvas.draw(texture).update();
          }
          _results.push(texture.destroy());
          /*
                          else if (name.type == "face")
                      
                              ctx = name.canvas.getContext('2d')
                              ctx.drawImage(video, 0, 0, video.width, video.height)
                              comp = ccv.detect_objects(
                                  "canvas" : name.canvas
                                  "cascade" : cascade,
                                  "interval" : 5,
                                  "min_neighbors" : 1 )
          
                              for i in comp
                                  img = name.params.image()
                                  ctx.drawImage(img, i.x, i.y, i.width, i.height);
          */
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
        var presets;
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
        presets = effects(200, 150);
        return $("#previews").kendoListView({
          dataSource: new kendo.data.DataSource({
            data: presets,
            pageSize: 8
          }),
          template: template
        });
        /*
                    for key, value of effects(200,150)
                        
                        do ->
                            preview = {}
                            $.extend(preview, value)
        
                            preview.name = key
                            preview.type = value.type
        
                            preview.canvas = fx.canvas()
        
                            preview.paramsArray = []
                        
                            for effect, effectValue of value.params
                                preview.paramsArray.push(effectValue)
                                        
                            previews.push(preview)
                        
                            $a = $("<a href='#' class='preview'></a>").append(preview.canvas).click(->
                                paused = true
                                $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })
                                $container.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })
                                $.publish("/preview/show", [preview])
                            )
                        
                            $container.append($a)
        */
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
