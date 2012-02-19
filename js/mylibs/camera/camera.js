(function() {

  define(['jQuery', 'Kendo', 'mylibs/camera/camera.events'], function($, kendo, events) {
    var pub;
    return pub = {
      init: function(id, $controls) {
        if (navigator.webkitGetUserMedia) {
          return navigator.webkitGetUserMedia("video", function(stream) {
            var video;
            events.init($controls);
            video = document.getElementById(id);
            return video.src = window.webkitURL.createObjectURL(stream);
          }, function(err) {
            return console.log("Your thing is not a thing.");
          });
        } else {
          return $("<div />").kendoWindow({
            modal: true,
            title: "Soooo.....this is awkward."
          }).closest(".k-window").find(".k-window-actions").remove().end().end().append(awkward).data("kendoWindow").center().open();
        }
      }
    };
  });

}).call(this);
