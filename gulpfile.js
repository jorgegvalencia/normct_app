var gulp   = require('gulp');
var inject = require('gulp-inject');
var less   = require('gulp-less');
var nodemon = require('gulp-nodemon')
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var paths = {
	"main"       : "./app/frontend/",
	"index"      : "./app/frontend/index.html",
	"dist"       : "./app/frontend/dist/",
	"css"        : "./app/frontend/dist/*.css",
	"javascript" : "./app/frontend/js/*.js",
	"less"       : "./app/frontend/less/style.less",
}

gulp.task('default', function () {
	runSequence('less', 'bower', 'inject', 'nodemon');
});

gulp.task('nodemon', function () {
	nodemon({
		script: 'app/backend/bin/www/',
		ext: 'js html'
	});
});

gulp.task('bower', function () {
  gulp.src(paths.index)
    .pipe(wiredep({}))
    .pipe(gulp.dest(paths.main));
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
