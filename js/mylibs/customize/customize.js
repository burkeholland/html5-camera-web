(function() {

  define(['jQuery', 'Kendo', 'mylibs/customize/customize.events'], function($, kendo, events) {
    var pub;
    return pub = {
      init: function(containerId) {
        return events.init(containerId);
      }
    };
  });

}).call(this);
