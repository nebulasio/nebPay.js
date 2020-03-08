#!/usr/bin/env node

'use strict';
var version = require('./libs/version.json');
var path = require('path');

var del = require('del');
const { src, dest, watch, series } = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var source = require('vinyl-source-stream');
// var exorcist = require('exorcist');
// var streamify = require('gulp-streamify');
var replace = require('gulp-replace');
var babelify     = require('babelify');
var buffer       = require('vinyl-buffer');
var jsdoc = require("gulp-jsdoc3");
var pkg = require("./package.json");

var DEST = path.join(__dirname, 'dist/');
var dst = 'nebPay';
var documentationDst =  path.join(__dirname, 'docs/');

// Error / Success Handling
var onError = function(err) {
    notify.onError({
        title: "Error: " + err.plugin,
        subtitle: "<%= file.relative %>",
        message: "<%= error.message %>",
        sound: "Beep",
    })(err);
    console.log(err.toString())
    this.emit('end');
}

function onSuccess(msg) {
    return {
        message: msg + " Complete! ",
        onLast: true
    }
}

function notifyFunc(msg) {
    return gulp.src('.', { read: false })
        .pipe(notify(onSuccess(msg)))
}

var browserifyOptions = {
    debug: true,
    insert_global_vars: false, // jshint ignore:line
    detectGlobals: false,
    bundleExternal: true
};

function gversion(){
    return src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(dest('./'));
}

function lint(){
    return src(['./nebpay.js', './libs/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function clean(cb) {
    del([ DEST ]).then(cb.bind(null, null));
}

function nebpay() {
    return browserify()
        .require('./nebpay.js', {expose: 'nebpay'})
        .transform(babelify)
        .bundle()
        .pipe(plumber({ errorHandler: onError }))
        // .pipe(exorcist(path.join( DEST, nebulasDst + '.js.map')))
        .pipe(source('nebPay.js'))
        .pipe(buffer())
        .pipe(rename(dst + '.js'))
        .pipe(dest(DEST))
        .pipe(uglify())
        .pipe(rename(dst + '.min.js'))
        .pipe(dest(DEST));
}

function gwatch() {
    watch(['./libs/*.js'], ['lint', 'build']);
}

exports.watch = gwatch
exports.default = series(gversion, lint, clean, nebpay)
