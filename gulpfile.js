var gulp   = require('gulp');
var inject = require('gulp-inject');
var less   = require('gulp-less');
var paths  = require('./app/config');

gulp.task('default', ['less', 'watch']);

gulp.task('watch', function () {
  gulp.watch(paths.less, ['less', 'inject']);
});

gulp.task('less', function () {
	return gulp.src(paths.less)
		.pipe(less())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('inject', function() {
	return gulp.src(paths.index)
		.pipe(inject(gulp.src(paths.javascript, {read: false}),{relative: true}))
		.pipe(gulp.dest(paths.main))
		.pipe(inject(gulp.src(paths.css, {read: false}),{relative: true}))
		.pipe(gulp.dest(paths.main));
});
