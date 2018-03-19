// --------------------
// --- REQUIRE MODULES
// --------------------

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var htmlmin = require('gulp-htmlmin');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync").create();
var rename = require("gulp-rename");

var requireHTML = false;

// ------------------
// --- DEFAULT TASKS
// ------------------

gulp.task('default',['webpack','sass'], function(){});

gulp.task('production',['minjs','mincss'], function(){});

gulp.task('dev',['webpack','sass'], function(){

  if(requireHTML){
    gulp.run('html');
    gulp.watch("src/index.html", ['html']).on('change', browserSync.reload);
  }

  browserSync.init({
      open: requireHTML,
      server: "./dist"
  });
  gulp.watch("src/js/**/*", ['webpack']).on('change', browserSync.reload);
  gulp.watch("src/scss/**/*", ['sass']).on('change', browserSync.reload);
});

// ----------------
// --- DEV TASKS
// ----------------

// --- SASS
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: './dist/css',
      basename: 'style',
    }))
    .pipe(gulp.dest(''));
});

gulp.task('html', function () {
  return gulp.src(sass_entry)
    .pipe(gulp.dest(''));
});

// --- JS (WEBPACK)
gulp.task('webpack', function() {
  return gulp.src('./src/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename({
      dirname: './dist/js',
      basename: 'main',
    }))
    .pipe(gulp.dest(''));
});

// --------------------
// --- PRODUCTION TASKS
// --------------------

gulp.task('webpack:prod', function() {
  return gulp.src('./src/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify())
    .pipe(rename({
      dirname: './dist/js',
      basename: 'main',
      suffix: ".min"
    }))
    .pipe(gulp.dest(''));
});

gulp.task('sass:prod', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: './dist/css',
      basename: 'style',
      suffix: ".min",
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(''));
});

gulp.task('prod',['webpack:prod', 'sass:prod'], function(){});

// --------------------
// --- OPTIONAL HTML
// --------------------

gulp.task('html', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'));
});