(function() {

  require.config({
    paths: {
      jQuery: 'libs/jquery/jquery',
      Kendo: 'libs/kendo/kendo',
      WebGL: 'libs/webgl/glfx'
    }
  });

  require(['app', 'order!libs/jquery/jquery.min', 'order!libs/kendo/kendo.all.min', 'order!libs/webgl/glfx.min'], function(app) {
    return app.init();
  });

}).call(this);
