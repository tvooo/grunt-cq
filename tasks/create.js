/*
 * grunt-cq
 * https://github.com/tim/grunt-cq
 *
 * Copyright (c) 2012 Tim von Oldenburg
 * Licensed under the MIT license.
 */

var fs = require( 'fs' ),
    which = require('which').sync,
    prompt = require('prompt'),
    path = require('path'),
    util = require('util');

module.exports = function(grunt) {

    prompt.message = '[' + '?'.green + ']';
    prompt.delimiter = ' ';
    // Please see the grunt documentation for more information regarding task and
    // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

    // ==========================================================================
    // TASKS
    // ==========================================================================

    var component = {

        properties: '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"\n' +
                    '    jcr:description="%s"\n' +
                    '    jcr:primaryType="cq:Component"\n' +
                    '    jcr:title="%s"/>',
        template:   '<%--\n\n' +
                    '  %s component.\n\n' +
                    '  %s\n\n--%><%\n' +
                    '%><%@include file="/libs/foundation/global.jsp"%><%\n' +
                    '%><%@page session="false" %><%\n' +
                    '%><%\n' +
                    '    // TODO add you code here\n' +
                    '%>'
    };

    var template = {
        properties:   '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"\n' +
                    '    jcr:description="%s"\n' +
                    '    jcr:primaryType="cq:Template"\n' +
                    '    jcr:title="%s"\n' +
                    '    ranking="{Long}%s">\n' +
                    '    <jcr:content\n' +
                    '        jcr:primaryType="cq:PageContent"\n' +
                    '        sling:resourceType="%s"/>\n' +
                    '</jcr:root>'
    };

    grunt.registerTask('create', 'Creates templates and components', function( type ) {

        grunt.config.requires('cq5.app');
        // get svn config object
        var config = grunt.config.process('cq5');

        var done = this.async();

        // check grunt command arguments
        if ( !type ) {
            grunt.warn('Use: `grunt create:<TYPE>');
        }

        if ( [ 'template', 'component' ].indexOf( type ) < 0 ) {
            grunt.warn( 'Type "' + type + '" unknown' );
        }

        //vltArgs = [];

        if ( type === 'template' ) {
            grunt.helper( 'template', config, done );
        } else if ( type === 'component' ) {
            grunt.helper( 'component', config, done );
        }
    });

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    /* A apps/kabelbw/components/Component Label
       A apps/kabelbw/components/Component Label/.content.xml (text/xml)
       A apps/kabelbw/components/Component Label/Component Label.jsp (text/plain) */
    grunt.registerHelper('component', function( config, done ) {
        var schema = {
            properties: {
                label: {
                    description: 'Label',
                    pattern: /^[a-z\s\-]+$/,
                    message: 'The label must be lowercase, without spaces (required)',
                    required: true
                },
                title: {
                    description: 'Title',
                    pattern: /^[a-zA-Z\s\-]+$/,
                    message: 'The title that is displayed in WCM (required)',
                    required: true
                },
                description: {
                    description: 'Description',
                    //pattern: /^[a-zA-Z\s\-]+$/,
                    message: 'The component description',
                    required: false
                }
            }
        };
        prompt.get(schema, function (err, result) {
            var dir = path.resolve( path.join( 'jcr_root/apps/', config.app, '/components/', result.label ) );

            fs.mkdirSync( dir );
            fs.writeFileSync(
                path.join( dir, result.label + '.jsp'),
                util.format( component.template, result.title, result.description )
            );
            fs.writeFileSync(
                path.join( dir, '.content.xml'),
                util.format( component.properties, result.description, result.title )
            );
            done();
        });
    });

    grunt.registerHelper('template', function( config, done ) {
        var schema = {
            properties: {
                label: {
                    description: 'Label (required)',
                    pattern: /^[a-z\-]+$/,
                    message: 'The label must be lowercase, without spaces (required)',
                    required: true
                },
                title: {
                    description: 'Title (required)',
                    pattern: /^[a-zA-Z\s\-]+$/,
                    message: 'The title that is displayed in WCM (required)',
                    required: true
                },
                description: {
                    description: 'Description',
                    //pattern: /^[a-zA-Z\s\-]+$/,
                    message: 'The component description',
                    required: false
                },
                ranking: {
                    description: 'Ranking (required)',
                    pattern: /^[0-9]+$/,
                    message: 'The component description',
                    default: 100,
                    required: false
                },
                resourceType: {
                    description: 'Resource Type (required)',
                    pattern: /^[a-zA-Z\s\-\/]+$/,
                    message: 'Points at a top-level component',
                    default: '/libs/foundation/components/page',
                    required: false
                }
            }
        };
        prompt.get(schema, function (err, result) {
            var dir = path.resolve( path.join( 'jcr_root/apps/', config.app, '/templates/', result.label ) );

            fs.mkdirSync( dir );
            fs.writeFileSync(
                path.join( dir, '.content.xml'),
                util.format( template.properties, result.description, result.title, result.ranking, result.resourceType )
            );
            done();
        });
    });

};
