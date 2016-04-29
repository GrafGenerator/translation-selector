/// <binding BeforeBuild='clean' AfterBuild='build' />
"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var sourceMaps = require("gulp-sourcemaps");

var source = require("vinyl-source-stream");

var exorcist = require("exorcist");

var browserify = require("browserify");
var debowerify = require("debowerify");
var tsify = require("tsify");

var uglifyJs = require("gulp-uglify");
var uglifyCss = require("gulp-minify-css");

var rimraf = require("rimraf");

var config = {
	dir: {
		bower: __dirname + "/bower_components",
		app: __dirname + "/app",
		styles: __dirname + "/styles",
		wwwroot: __dirname + "/wwwroot"
	},

	entry: {
		js: "index.ts",
		css: "index.less"
	},

	bundle: {
		js: "app.js",
		jsMin: "app.min.js",
		jsMap: "app.js.map",
		css: "app.css",
		cssMin: "app.min.css"
	}
};


// ====== CLEANUP

gulp.task("clean-js", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.js, cb);
});

gulp.task("clean-js-min", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.jsMin, cb);
});

gulp.task("clean-css", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.css, cb);
});

gulp.task("clean-css-min", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.cssMin, cb);

});

gulp.task("clean", ["clean-js", "clean-js-min", "clean-css", "clean-css-min"]);




// ====== APPLICATION


/**
 * Compile ts files to js and save result to public directory
 */
gulp.task("compile-js", function () {
	var bundler =
		browserify({
			basedir: config.dir.app,
			debug: true
		})
		.add(config.dir.app + "/" + config.entry.js)
		.plugin(tsify)
		.transform(debowerify);

	return bundler.bundle()
		.pipe(exorcist(config.dir.wwwroot + "/" + config.bundle.jsMap))
		.pipe(source(config.bundle.js))
		.pipe(gulp.dest(config.dir.wwwroot));
});


/**
 * Minify result js file
 */
gulp.task("uglify-js", ["compile-js"], function () {
	return gulp.src(config.dir.public + "/" + config.bundle.js)
		.pipe(uglifyJs())
		.pipe(rename(config.bundle.jsMin))
		.pipe(gulp.dest(config.dir.wwwroot));
});


gulp.task("build-js", ["compile-js", "uglify-js"]);

// ====== STYLES


/**
 * Compile less styles to css and save result to public directory
 */
gulp.task("compile-css", function () {
	return gulp.src(config.dir.styles + "/" + config.entry.css)
		.pipe(sourceMaps.init())
		.pipe(less({ paths: [config.dir.styles] }))
		.pipe(replace("../fonts/glyphicons", "./fonts/bootstrap/glyphicons"))       // set right paths to bootstrap fonts
		.pipe(rename(config.bundle.css))                                            // rename must be before source maps call
		.pipe(sourceMaps.write("."))                                                // must be relative to public directory
		.pipe(gulp.dest(config.dir.wwwroot));
});


/**
 * Minify result css file
 */
gulp.task("uglify-css", ["compile-css"], function () {
	return gulp.src(config.dir.wwwroot + "/" + config.bundle.css)
		.pipe(uglifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename(config.bundle.cssMin))
		.pipe(gulp.dest(config.dir.wwwroot));
});


gulp.task("build-css", ["compile-css", "uglify-css"]);


// ====== FONTS


/**
 * Copy bootstrap fonts to public directory
 */
gulp.task("fonts-bootstrap", function () {
	return gulp.src(config.dir.bower + "/bootstrap/fonts/*")
		.pipe(gulp.dest(config.dir.wwwroot + "/fonts/bootstrap"));
});


/**
 * Copy all fonts to public directory
 */
gulp.task("fonts", ["fonts-bootstrap"]);



gulp.task("build", ["build-js", "build-css", "fonts"]);