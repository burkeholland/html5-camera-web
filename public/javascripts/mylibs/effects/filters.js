(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      presets: {
        normal: {
          filter: "normal",
          value: 0
        },
        grayscale: {
          filter: "grayscale",
          value: 1
        },
        sepia: {
          filter: "sepia",
          value: 0.8
        },
        invert: {
          filter: "invert",
          value: 1
        },
        saturate: {
          filter: "saturate",
          value: 0.5
        },
        blur: {
          filter: "blur",
          value: "6px"
        }
      },
      filters: {
        filter: {
          name: "grayscale",
          max: 1
        },
        filter: {
          name: "sepia",
          max: 1
        },
        filter: {
          name: "alpha"
        }
      }
    };
  });

}).call(this);
