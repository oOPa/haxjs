var gulp = require('gulp');
var babel = require("gulp-babel");
var watch = require("gulp-watch");
var gutil = require("gulp-util");

gulp.task("compile", function() {
	return gulp.src(["src/js/*","!src/js/app.js"])
		.pipe(babel())
		.pipe(gulp.dest("dist/js"));
});
gulp.task("copy", function() {
    gulp.src(['src/js/app.js','src/index.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task("default", ['compile','copy']);

gulp.task("watch", function(){
	gutil.log(gutil.colors.green('Started watching in src/js/'));
	watch("src/js",function(file){
		gutil.log(gutil.colors.yellow('JS changed' + ' (' + file.path + ')'));
		gulp.start("default");
	});
});

