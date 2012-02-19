(function() {

  require.config({
    paths: {
      jQuery: 'libs/jquery/jquery',
      Kendo: 'libs/kendo/kendo'
    }
  });

  require(['app', 'order!libs/jquery/jquery.min', 'order!libs/kendo/kendo.all.min'], function(app) {
    return app.init();
  });

}).call(this);
