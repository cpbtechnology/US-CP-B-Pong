$(document).ready(function() {

	module("Backbone Views", {

		setup: function() {

		},

		teardown: function() {

		}

	});

	test("IndexView Exists", function() {
		var indexView = new IndexView({});
		equal( typeof indexView, "object" );
	});

});
