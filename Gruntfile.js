'use strict';
module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', false);
	
	var pkg = grunt.file.readJSON('package.json');
	
	var sdkVersion = pkg.version;
	
	var pkgName = pkg.name;
	
	var config = {
			
		    lib: {
		    	dev : [
		    		'node_modules/babel-polyfill/dist/polyfill.js'
		    	],
				
		    	dist : [
			    	'node_modules/babel-polyfill/dist/polyfill.min.js',
		    	],
			
			},
		    
		    app : {
		    	
		    	src:  'src',
		    	
		    	dist: 'dist',
		    	
		    	reporter: 'reporter',
		    	
		    	js:  ['src/vendor/base64.js', 'src/vendor/sha.js', 'src/vendor/URI.js', 'src/vendor/axios.js', 'src/scripts/log.js', 'src/scripts/v2Model.js', 'src/scripts/obsModel.js', 'src/scripts/xml2js.js', 'src/vendor/md5.js' ,'src/scripts/utils.js', 'src/scripts/enums.js', 'src/scripts/posix.js', 'src/scripts/resumable.js', 'src/scripts/obs.js'],
		    	
		    	lintJs : ['src/scripts/log.js', 'src/scripts/v2Model.js', 'src/scripts/obsModel.js' ,'src/scripts/utils.js', 'src/scripts/enums.js', 'src/scripts/posix.js', 'src/scripts/resumable.js', 'src/scripts/xml2js.js', 'src/scripts/obs.js'],
		    	
		    	view: 'src/*.html',
		    	
		    	conf: 'Gruntfile.js',
		    	
		    	minJs: 'dist/' + pkgName + '-' + sdkVersion + '.min.js'
		    }
		    
	};
	
	var inject = function(){
		var list = [];
		for(var i=0;i<config.lib.dev.length;i++){
			list.push('src/' + config.lib.dev[i]);
		}
		
		return list;
	};
	
	var process = require('process');
	var zipPackageName = process.env.zipPackageName || '<%= pkg.name %>-<%= pkg.version %>';
	
	
	// Project initialization configuration
	grunt
			.initConfig({
				pkg : pkg,

				config : config,
				
				clean : {
					dist : {
						files : {
							src : ['<%= config.app.dist %>', '<%= config.app.src %>/node_modules']
						}
					}
				},

				jshint : {
					dist : {
						src : '<%= config.app.lintJs %>',
						options : {
							jshintrc : true
						}
					}
				},

				injector : {
					options : {
						addRootSlash : false,
						relative : true,
						template : '<%= config.app.src %>/index.html'
					},

					dev : {
						files : {
							'<%= config.app.src %>/index.html' : [
									inject(),
									'<%= config.app.js %>' ]
						}
					},

					dist : {
						files : {
							'<%= config.app.dist %>/index.html' : [
									'<%= config.app.minJs %>' ]
						}
					}
				},

				ngAnnotate : {
					
					step1 :{
						files: {
							'<%= config.app.dist %>/<%= pkg.name %>-<%= pkg.version %>.js' : '<%= config.app.js %>'
						}
					},
					
					step2 : {
						files : [
							{
								cwd : '.',
								src : ['<%= config.lib.dist %>', '<%= config.app.dist %>/<%= pkg.name %>-es5-<%= pkg.version %>.min.js'],
								dest : '<%= config.app.dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
							},
							{
								cwd : '.',
								src : ['<%= config.app.dist %>/<%= pkg.name %>-es5-<%= pkg.version %>.min.js'],
								dest : '<%= config.app.dist %>/<%= pkg.name %>-without-polyfill-<%= pkg.version %>.min.js'
							}
						]
					}
				},
				
			    babel: {
			        options: {
			        	sourceMap: false,
			            presets: [
			                'babel-preset-env'
			            ]
			        },
			        
			        dist: {
			            files: {
			            	'<%= config.app.dist %>/<%= pkg.name %>-es5-<%= pkg.version %>.js' : '<%= config.app.dist %>/<%= pkg.name %>-<%= pkg.version %>.js'
			            }
			        },
			    },

				uglify : {
					dist : {
						options : {
							mangle: true
//							mangle : false
						},
						files : {
							'<%= config.app.dist %>/<%= pkg.name %>-es5-<%= pkg.version %>.min.js' : '<%= config.app.dist %>/<%= pkg.name %>-es5-<%= pkg.version %>.js',
						}
					}
				},

				// Copies remaining files to places other tasks can use
				copy : {
					
					dev: {
						files : [
							{
								expand : true,
								cwd : '.',
								flatten: false,
								src : ['<%= config.lib.dev %>'],
								dest : '<%= config.app.src %>'
							}
						]
					},
					
					dist : {
						files : [
							{
								expand : true,
								dot : true,
								cwd : '<%= config.app.src %>',
								dest : '<%= config.app.dist %>',
								src : '*.{ico,png,txt,html}'
							},
							{
								expand : true,
								cwd : '.',
								dest : '<%= config.app.dist %>/source',
								src : ['<%= config.app.js %>', 'package.json', 'Gruntfile.js', '<%= config.app.view %>'],
							},
						]
					}
				},
				
				zip: {
					dist :{
						cwd : '.',
						dest : '<%= config.app.dist %>/'+zipPackageName+'.zip',
				    	src : ['<%= config.app.dist %>/index.html', '<%= config.app.dist %>/source/**', 'examples/*.html', '<%= config.app.dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js', '<%= config.app.dist %>/<%= pkg.name %>-without-polyfill-<%= pkg.version %>.min.js', 'LICENSE', 'Notice.MD'],
				    	compression: 'DEFLATE'
					}
				},

				concurrent : {
					dist : [ 'watch' ],
					options : {
						logConcurrentOutput : true,
						limit : 10
					}
				},

				watch : {
					conf : {
						files : '<%= config.app.conf %>',
						tasks : [ 'jshint', 'injector:dev' ],
						options : {
							livereload : true
						}
					},
					view : {
						files : '<%= config.app.view %>',
						tasks : [],
						options : {
							livereload : true
						}
					},
					js : {
						files : '<%= config.app.js %>',
						tasks : [ 'injector:dev' ],
						options : {
							livereload : true
						}
					}
				},

				connect : {
					options : {
						port : 8888,
						// Change this to '0.0.0.0' to access the server from
						// outside.
						hostname : 'localhost',
						livereload : 35729,
						open : true
					},
					dev : {
						options : {
							base : [ '<%= config.app.src %>' ]
						}
					},
					dist : {
						options : {
							base : [ '<%= config.app.dist %>' ]
						}
					}
				}
			});
	
	grunt.registerTask('dev', ['jshint:dist']);
	
	grunt.registerTask('inject', ['copy:dev','injector:dev' ]);

	// Build task(s).
	grunt.registerTask('build', 'Build project', function(target) {
		return grunt.task.run([ 'clean:dist', 'ngAnnotate:step1', 'babel', 'uglify', 'ngAnnotate:step2', 'copy:dist', 'injector:dist', 'zip' ]);
	});

	// Development task(s).
	// grunt serve ---- for dev debug
	// grunt serve:dist ---- for local deploying
	grunt.registerTask('serve', 'Compile then start a connect web server',
			function(target) {
				if (target === 'dist') {
					return grunt.task.run([ 'build', 'connect:dist:keepalive' ]);
				}
				return grunt.task.run(['inject', 'connect:dev:livereload', 'concurrent' ]);
			});

	// Default task(s).
	grunt.registerTask('default', [ 'serve' ]);

};
