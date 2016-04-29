/// <binding AfterBuild="build" Clean="clean" />
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


var config = {
	dir: {
		bower: __dirname + "/bower_components",
		app: __dirname + "/app",
		styles: __dirname + "/styles",
		public: __dirname + "/wwwroot"
	},

	bundle: {
		js: "app.js",
		jsMin: "app.min.js",
		css: "app.css",
		cssMin: "app.min.css"
	}
};


// ====== CLEANUP

gulp.task("clean-js", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.js, cb);
	rimraf(config.dir.app + '/' + config.bundle.jsMin, cb);
});

gulp.task("clean-css", function (cb) {
	rimraf(config.dir.app + '/' + config.bundle.css, cb);
	rimraf(config.dir.app + '/' + config.bundle.cssMin, cb);
});

gulp.task("clean", ["clean-js", "clean-css"]);




// ====== APPLICATION


/**
 * Compile ts files to js and save result to public directory
 */
gulp.task("compile-js", function () {
	var bundler =
		browserify({
			basedir: config.applicationDir,
			debug: true
		})
		.add(config.applicationDir + "/index.ts")
		.plugin(tsify)
		.transform(debowerify);

	return bundler.bundle()
		.pipe(exorcist(config.publicDir + "/app.js.map"))
		.pipe(source("app.js"))
		.pipe(gulp.dest(config.publicDir));
});


/**
 * Minify result js file
 */
gulp.task("uglify-js", ["compile-js"], function () {
	return gulp.src(config.publicDir + "/app.js")
		.pipe(uglifyJs())
		.pipe(rename("app.min.js"))
		.pipe(gulp.dest(config.publicDir));
});


gulp.task("build-js", ["compile-js", "uglify-js"]);

// ====== STYLES


/**
 * Compile less styles to css and save result to public directory
 */
gulp.task("compile-css", function () {
	return gulp.src(config.stylesDir + "/index.less")
		.pipe(sourceMaps.init())
		.pipe(less({ paths: [config.stylesDir] }))
		.pipe(replace("../fonts/glyphicons", "./fonts/bootstrap/glyphicons"))       // set right paths to bootstrap fonts
		.pipe(rename("app.css"))                                                  // rename must be before source maps call
		.pipe(sourceMaps.write("."))                                                // must be relative to public directory
		.pipe(gulp.dest(config.publicDir));
});


/**
 * Minify result css file
 */
gulp.task("uglify-css", ["compile-css"], function () {
	return gulp.src(config.publicDir + "/app.css")
		.pipe(uglifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename("app.min.css"))
		.pipe(gulp.dest(config.publicDir));
});


gulp.task("build-css", ["compile-css", "uglify-css"]);


// ====== FONTS


/**
 * Copy bootstrap fonts to public directory
 */
gulp.task("fonts-bootstrap", function () {
	return gulp.src(config.bowerDir + "/bootstrap/fonts/*")
		.pipe(gulp.dest(config.publicDir + "/fonts/bootstrap"));
});


/**
 * Copy all fonts to public directory
 */
gulp.task("fonts", ["fonts-bootstrap"]);



gulp.task("build", ["build-js", "build-css", "fonts"]);