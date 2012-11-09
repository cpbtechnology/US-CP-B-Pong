module.exports = function (grunt) {

	var ROOT = './source';
	var CSS = ROOT + '/stylesheets';
	var JS = ROOT + '/javascripts';
	var JSBIN = JS + '/generated';
	var CSSBIN = CSS + '/generated';

	// Project configuration.
	grunt.initConfig({

		// JS linting
		lint: {
			src: [
				JS + '/app/**/*.js'
			]
		},

		// JS beautifier options
		beautifier: {
			options: {
				indentSize: 1,
				indentChar: '\t',
				spaceAfterAnonFunction: false
			}
		},

		// JS beautifier
		beautify: {
			files: '<config:lint.src>'
		},

		// CSS minconcat
		cssmin: {
			app: {
				src: [
					CSS + '/reset.css',
					CSS + '/app/app.css',
					CSS + '/app/print.css'
				],
				dest: CSSBIN + '/app.min.css'
			}
		},

		// JS minconcat
		min: {
			app: {
				src: [
					'<config:lint.src>'
				],
				dest: JSBIN + '/app.min.js'
			}
		},

		// Copy files for QUnit testing
		copy: {
			qunit: {
				options: {
					basePath: JS
				},
				files: {
					'config/grunt/test/app': [
						JS + '/generated/app.min.js',
						JS + '/lib/jquery-1.7.2.min.js',
						JS + '/lib/backbone.min.js',
						JS + '/lib/underscore.min.js'
					]
				}
			}
		},

		// Run QUnit test via PhantomJS
		qunit: {
			all: ['config/grunt/test/**/*.html']
		},

		// Generate YUIDocs
		yuidoc: {
			compile: {
				options: {
					paths: JS + '/app/',
					outdir: 'docs',
					project: {
						logo: 'build/grunt/templates/logo.png'
					}
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'cssmin min copy:qunit qunit');
	grunt.registerTask('jstest', 'min copy:qunit qunit');
	grunt.registerTask('docs', 'yuidoc');

	// load grunt plugins
	grunt.loadNpmTasks('grunt-beautify');
	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-crusher');
	grunt.loadNpmTasks('grunt-css');

};
