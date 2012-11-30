/*
 * grunt-cq
 * https://github.com/tim/grunt-cq
 *
 * Copyright (c) 2012 Tim von Oldenburg
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('cq', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('cq'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('cq', function() {
    return 'cq!!!';
  });

};
