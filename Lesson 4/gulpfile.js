/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
// var imagemin = require('imagemin');
// var pngquant = require('imagemin-pngquant');
 

gulp.task('default', ['copy-html', 'copy-images','styles', 'lint'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);
	gulp.watch('index.html', ['copy-html']);

	browserSync.init({
		server: './dist'
	});

});

// produce production ready version of site
gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts-dist'
]);

// HTML
// copies html file into dist folder and reloads
gulp.task('copy-html', function () {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
});

// IMGs
// copies, minify all imgs into dist folder
gulp.task('copy-images', function () {
	gulp.src('img/*')
		.pipe(gulp.dest('./dist/img'));
});

// gulp.task('compress', function() {
// 	gulp.src('src/images/*')
// 		.pipe(imagemin())
// 		.pipe(gulp.dest('dist/images'));
// });

// CSS 
// converts scss into css and puts files into dist folder and reloads
gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

// JS
gulp.task('lint', function () {
	browserSync.reload();
	return gulp.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});

//Combine all js into dist/all.js
gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});

//Combine all js into dist/all.js and minify
gulp.task('scripts-dist', function() {
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
});

// Tests
gulp.task('tests', function () {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}));
});
