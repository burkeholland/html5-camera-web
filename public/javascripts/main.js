(function() {

  require.config({
    paths: {
      jQuery: 'libs/jquery/jquery',
      Kendo: 'libs/kendo/kendo',
      WebGL: 'libs/webgl/glfx'
    }
  });

  require(['app'], function(app) {
    return app.init();
  });

}).call(this);
