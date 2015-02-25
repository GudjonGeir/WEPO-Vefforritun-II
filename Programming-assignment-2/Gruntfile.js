// Based on a tutorial by Chris Sevilleja
// https://scotch.io/tutorials/a-simple-guide-to-getting-started-with-grunt
module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				reporter: require('jshint-stylish'),
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

			build: ['Gruntfile.js', 'js/**/*.js']
		},

		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/js/ChatterClient.min.js': ['js/ChatterClient.js', 'js/controllers/*.js', 'js/socket-factory.js', 'js/focus-directive.js', 'js/sound-directive.js']
				}
			}
		},
		concat: {
			dist: {
				src: ['bower_components/jquery/dist/jquery.min.js',
					'bower_components/angular/angular.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'bower_components/angular-scroll-glue/src/scrollglue.js',
					'bower_components/angular-ui-select/dist/select.min.js',
					'bower_components/angular-sanitize/angular-sanitize.min.js',
					'bower_components/socket.io-client/dist/socket.io.min.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js'],
				dest: 'dist/js/Dependencies.min.js',
			}
		},


		watch: {

			// for scripts, run jshint and uglify 
			scripts: { 
				files: 'js/**/*.js', tasks: ['jshint', 'uglify', 'concat'] 
			} 
		}

	});


	grunt.registerTask('default', ['jshint', 'uglify', 'concat']); 
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
};
