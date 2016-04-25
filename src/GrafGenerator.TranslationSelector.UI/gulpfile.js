/// <binding AfterBuild='min' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    ts = require('gulp-typescript'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var paths = {
    webroot: "./wwwroot/",
    src: "./app/"
};

paths.ts = [paths.src + "components/**/*.ts", paths.src + "index.ts"];
paths.js = paths.src + "js/**/*.js";
paths.css = paths.src + "css/**/*.css";
paths.concatJsDest = paths.webroot + "js/app.js";
paths.concatCssDest = paths.webroot + "css/app.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

var tsCompilerConfig = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    module: 'AMD',
    removeComments: true
});

gulp.task('ts-compile', function () {
    var tsResult = gulp.src(paths.ts)
        .pipe(ts(tsCompilerConfig));

    return tsResult
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));

    //return merge([
    //    tsResult.dts.pipe(gulp.dest(paths.tsDef)),
    //    tsResult.js.pipe(gulp.dest(paths.tsOutput))
    //]);
});

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["ts-compile"]);
