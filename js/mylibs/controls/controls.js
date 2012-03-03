(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      init: function(controlsId) {
        var $controls;
        $controls = $("#" + controlsId);
        return $controls.on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
      }
    };
  });

}).call(this);
