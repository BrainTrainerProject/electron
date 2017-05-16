'use strict';

const gulp = require("gulp")
const bundle = require('./bundle');
const jetpack = require('fs-jetpack');

var srcDir = jetpack.cwd('./src');
var distDir = jetpack.cwd('./lib');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
    return Promise.all([
        bundle(distDir.path('preload.js'), destDir.path('preload.js')),
        bundle(distDir.path('main.js'), destDir.path('main.js')),
    ]);
});