$(document).ready(function() {

  module("Backbone Routers", {

    setup: function() {

    },

    teardown: function() {

    }

  });

  test("AppRouter Exists", function() {
    var appRouter = new AppRouter();
    equal( typeof appRouter, "object" );
  });

});
