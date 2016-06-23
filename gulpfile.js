var gulp = require('gulp');
var babel = require("gulp-babel");
var watch = require("gulp-watch");
var gutil = require("gulp-util");
var changedInPlace = require('gulp-changed-in-place');
var newer = require('gulp-newer');

const DEST = "dist"
const JS_SOURCE = ["src/js/*","!src/js/shared"];
const JS_SHARED = ["src/js/shared"];
const JS_DEST = DEST+"/js";
const JS_ENTRY = "src/app.js";
const HTML_ENTRY = "src/index.html";

var printChanged = function (file) {gutil.log(gutil.colors.green(file.path + " has changed"));}

gulp.task("compile", function() {
	return gulp.src(["src/js/*","!src/js/app.js","!src/js/shared"])
		.pipe(babel())
		.pipe(gulp.dest("dist/js"));
});

gulp.task("sync", function() {
	return gulp.src(["src/js/*","!src/js/app.js","!src/js/shared"])
		.pipe(newer(JS_DEST))
		.pipe(babel())
		.pipe(gulp.dest(JS_DEST));
});

gulp.task("shared", function(){
	return gulp.src("shared/*.js").pipe(gulp.dest("dist/shared"));
})
gulp.task("copy", function() {
    gulp.src(['src/app.js','src/index.html'])
    .pipe(gulp.dest('dist'));
});

/** not repeating subsequently for html_entry and js_entry **/
gulp.task("watch", function(){
	watch(JS_SOURCE,printChanged)	
		.pipe(babel())
		.pipe(gulp.dest(JS_DEST));
	watch(JS_ENTRY,printChanged).pipe(gulp.dest(DEST));
	watch(HTML_ENTRY,printChanged).pipe(gulp.dest(DEST));
});

gulp.task("default", ['compile','copy']);
