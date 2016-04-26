/// <binding AfterBuild='build' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var paths = {
    webroot: "./wwwroot/",
    src: "./app/"
};

paths.ts = [paths.src + "components/**/*.ts", paths.src + "index.ts"];
paths.libs = paths.src + "lib/**/dist/*.js";
paths.requireJs = paths.src + "../node_modules/requirejs/require.js";
paths.css = paths.src + "css/**/*.css";
paths.libCss = paths.src + "lib/**/dist/*.css";
paths.concatJsDest = paths.webroot + "js/app.js";
paths.concatRequireJsDest = paths.webroot + "js/";
paths.concatLibDest = paths.webroot + "js/lib.js";
paths.concatCssDest = paths.webroot + "css/app.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:lib", function (cb) {
    rimraf(paths.concatLibDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:lib", "clean:css"]);

var tsCompilerConfig = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    //module: 'AMD',
    removeComments: true
});

gulp.task('ts-compile', function () {
    return gulp.src(paths.ts)
        .pipe(ts(tsCompilerConfig))
        .pipe(sourcemaps.init())
            .pipe(concat(paths.concatJsDest))
            //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("."));

    //return merge([
    //    tsResult.dts.pipe(gulp.dest(paths.tsDef)),
    //    tsResult.js.pipe(gulp.dest(paths.tsOutput))
    //]);
});

gulp.task("copy:require", function () {
    return gulp.src(paths.requireJs)
        .pipe(gulp.dest(paths.concatRequireJsDest));
});

gulp.task("min:lib", function () {
    return gulp.src(paths.libs)
        .pipe(concat(paths.concatLibDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, paths.libCss, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("build", ["ts-compile", "copy:require", "min:lib", "min:css"]);
