(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var optionStyle, options;
    window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);
    navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    optionStyle = (function(win) {
      var el, object, root, string;
      if (!navigator.getUserMedia) return;
      el = document.createElement("iframe");
      root = document.body || document.documentElement;
      string = true;
      object = true;
      return {
        string: string,
        object: object
      };
    })(window);
    return options = function(opts) {
      var o, stringOptions;
      stringOptions = [];
      if (optionStyle.string && !optionStyle.object) {
        for (o in opts) {
          if (opts[o] === true) stringOptions.push(o);
        }
        return stringOptions.join(" ");
      } else {
        return opts;
      }
    };
  });

}).call(this);
