//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

  // All upfront config goes in a massive nested object.
  grunt.initConfig({
    // You can set arbitrary key-value pairs.
    distFolder: 'dist',
    // You can also set the value of a key as parsed JSON.
    // Allows us to reference properties we declared in package.json.
    pkg: grunt.file.readJSON('package.json'),
    // Grunt tasks are associated with specific properties.
    // these names generally match their npm package name.
    concat: {
      // Specify some options, usually specific to each plugin.
      // 'dist' is what is called a "target."
      // It's a way of specifying different sub-tasks or modes.
      dist: {
        // The files to concatenate:
        // Notice the wildcard, which is automatically expanded.
        src: ['src/js/loader.js','src/js/loader*.js'],
        // The destination file:
        // Notice the angle-bracketed ERB-like templating,
        // which allows you to reference other properties.
        // This is equivalent to 'dist/main.js'.
        dest: '<%= distFolder %>/loader.full.js'
        // You can reference any grunt config property you want.
        // Ex: '<%= concat.options.separator %>' instead of ';'
      }
    },
	
	uglify: {
		options : {
			mangle : true
		},
        my_target: {
          files: {
            '<%= distFolder %>/loader.min.js': ['<%= distFolder %>/loader.full.js']
          }
        }
      },
    
	copy: {
		main: {
			expand: false,
			src: 'src/html/entry.html',
			dest: '<%= distFolder %>/index.html',
		},
		route: {
			expand: false,
			src: 'src/app.js',
			dest: '<%= distFolder %>/app.js',
		}
		
		
	}
	
  }); // The end of grunt.initConfig

  // We've set up each task's configuration.
  // Now actually load the tasks.
  // This will do a lookup similar to node's require() function.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Register our own custom task alias.
  grunt.registerTask('default', ['concat','uglify','copy']);
};	
