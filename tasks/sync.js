/*
 * grunt-cq
 * https://github.com/tim/grunt-cq
 *
 * Copyright (c) 2012 Tim von Oldenburg
 * Licensed under the MIT license.
 */

var which = require('which').sync;

module.exports = function( grunt ) {

    // Please see the grunt documentation for more information regarding task and
    // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

    // ==========================================================================
    // TASKS
    // ==========================================================================

    grunt.registerTask('svn', 'Run SVN tasks', function( action ) {

        grunt.config.requires('svn.repository');
        // get svn config object
        var config = grunt.config.process('svn');

        // check grunt command arguments
        if ( !action ) {
            grunt.warn('Use: `grunt svn:<ACTION>');
        }

        if ( ['up', 'update', 'ci', 'commit', 'co', 'checkout'].indexOf( action ) < 0 ) {
            grunt.warn( 'SVN action "' + action + '" unknown' );
        }

        var svnArgs = [];

        if ( action === 'up' || action === 'update' ) {
            svnArgs = ['up'];
        }

        if ( action === 'ci' || action === 'commit' ) {
            svnArgs = ['ci']; // prompt wegen message
        }

        if ( action === 'co' || action === 'checkout' ) {
            svnArgs = [
                'co',
                config.repository,
                '.'
            ];
        }

        grunt.helper('cmd', {
            cmd:  'svn',
            args: svnArgs,
            done: function (err) {
                if (!err) {
                    grunt.log.ok('Ok');
                }
                else {
                    grunt.fail(err);
                }
            }
        });
    });

    grunt.registerTask('vlt', 'Run VLT tasks', function( action ) {

        grunt.config.requires('vlt.host', 'vlt.user', 'vlt.password');
        // get svn config object
        var config = grunt.config.process('vlt');

        // check grunt command arguments
        if ( !action ) {
            grunt.warn('Use: `grunt vlt:<ACTION>');
        }

        if ( ['up', 'update', 'ci', 'commit', 'co', 'checkout'].indexOf( action ) < 0 ) {
            grunt.warn( 'VLT action "' + action + '" unknown' );
        }

        var vltArgs = [];

        if ( action === 'up' || action === 'update' ) {
            vltArgs = ['up'];
        }

        if ( action === 'ci' || action === 'commit' ) {
            vltArgs = ['ci'];
        }
        // cd
        if ( action === 'co' || action === 'checkout' ) {
            vltArgs = [
                '--credentials',
                config.user + ':' + config.password,
                'co',
                //'--force',
                'http://' + config.host + '/crx'
            ];
        }

        grunt.helper('cmd', {
            cmd:  'vlt',
            args: vltArgs,
            done: function (err) {
                if (!err) {
                    grunt.log.ok('Ok');
                }
                else {
                    grunt.fail(err);
                }
            }
        });
    });

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    grunt.registerHelper('cmd', function( options ) {
        grunt.verbose.writeln('Running vlt with arguments ' + grunt.log.wordlist( options.args ));
        return grunt.utils.spawn({
            cmd: which( options.cmd ),
            args: options.args
        }, function (err, result, code) {
            grunt.verbose.write(result);
            if (!err) {
                return options.done(null);
            }
            // Something went horribly wrong.
            grunt.verbose.or.writeln();
            grunt.log.write('Running ' + options.cmd + ' ... ').error();
            if (code === 127) {
                grunt.log.errorlns(
                    'In order for this task to work properly, ' + options.cmd + ' must be ' +
                    'installed and in the system PATH (if you can run "' + options.cmd + '" at' +
                    ' the command line, this task should work). Unfortunately, ' +
                    '' + options.cmd + ' cannot be installed automatically via npm or grunt. '
                );
                grunt.warn( options.cmd + ' not found.', 90 );
            }
            else {
                result.split('\n').forEach(grunt.log.error, grunt.log);
                grunt.warn( options.cmd + ' exited unexpectedly with exit code ' + code + '.', 90);
            }
            options.done(code);
        });
    });

};
