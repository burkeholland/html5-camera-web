(function() {

  define(['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      effects: {
        vintage: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 227,
            green: 12,
            blue: 169,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        sepia: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 25,
          screen: {
            red: 141,
            green: 107,
            blue: 3,
            strength: 0.47
          },
          desaturate: 0.7,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        grayscale: {
          vignette: {
            black: 0.7,
            white: 0.2
          },
          noise: 25,
          screen: {
            red: false,
            green: false,
            blue: false,
            strength: false
          },
          desaturate: 1,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        green: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 255,
            green: 255,
            blue: 0,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        }
      }
    };
  });

}).call(this);
