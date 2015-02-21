// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

	// ===========================================================================
	// CONFIGURE GRUNT ===========================================================
	// ===========================================================================
	grunt.initConfig({

		// get the configuration info from package.json ----------------------------
		// this way we can use things like name and version (pkg.name)
		pkg: grunt.file.readJSON('package.json'),

		// configure jshint to validate js files -----------------------------------
		jshint: {
			options: {
				reporter: require('jshint-stylish'), // use jshint-stylish to make our errors look and read good
				curly:  true,
				immed:  true,
				newcap: true,
				noarg:  true,
				sub:    true,
				boss:   true,
				eqnull: true,
				node:   true,
				undef:  true,
				globals: {
					_:       		false,
					jQuery:  		false,
					angular: 		false,
					moment:  		false,
					console: 		false,
					$:       		false,
					io:      		false,
					ChatterClient: 	true
					}
			},


			// when this task is run, lint the Gruntfile and all js files in src
			build: ['Gruntfile.js', 'js/**/*.js']
		},

		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/js/ChatterClient.min.js': ['js/ChatterClient.js', 'js/controllers/*.js', 'js/socket-factory.js', 'js/socket-directive.js']
				}
			}
		},

		// configure watch to auto update ----------------
		watch: {

			// for scripts, run jshint and uglify 
			scripts: { 
				files: 'js/**/*.js', tasks: ['jshint', 'uglify'] 
			} 
		}

	});

	// ===========================================================================
	// LOAD GRUNT PLUGINS ========================================================
	// ===========================================================================
	// we can only load these if they are in our package.json
	// make sure you have run npm install so our app can find these
	grunt.registerTask('default', ['jshint', 'uglify']); 
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
};