// --------------------
// --- REQUIRE MODULES
// --------------------

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var htmlmin = require('gulp-htmlmin');
var webpack = require('gulp-webpack');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync").create();
var rename = require("gulp-rename");

// ----------------
// --- SETTINGS
// ----------------

// --- Input - Names
var js = 'main';
var scss = '**/*';
var html = 'index';

// --- Input - Dir
var jsentry = "./src/js/"+js+".js";
var sassentry = "./src/scss/"+scss+"";
var htmlentry = " ./src/"+html+".html";

// --- Output - Names
var jsfilename = "something";
var cssfilename = 'something';
var htmlfilename = html;

// --- Output - Dir
var jsdirname = "./dist/js/";
var cssdirname = "./dist/css/";
var htmldirname = "./dist/";

// ------------------
// --- DEFAULT TASKS
// ------------------

console.log(jsentry, sassentry, htmlentry);
console.log(jsfilename, cssfilename, htmlfilename);
console.log(jsdirname, cssdirname, htmldirname);


gulp.task('default',['webpack','sass'], function(){});

gulp.task('production',['minjs','mincss'], function(){});

gulp.task('dev',['webpack','sass'], function(){
  browserSync.init({
      server: "./dist"
  });
  gulp.watch("src/js/**/*", ['webpack']).on('change', browserSync.reload);
  gulp.watch("src/scss/**/*", ['sass']).on('change', browserSync.reload);
  // gulp.watch("src/index.html", ['minify']).on('change', browserSync.reload);
});

// ----------------
// --- DEV TASKS
// ----------------

// --- SASS
gulp.task('sass', function () {
  return gulp.src(sassentry)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: cssdirname,
      basename: cssfilename,
      // prefix: "bonjour-",
      // suffix: "-hola",
    }))
    .pipe(gulp.dest(''));
});

gulp.task('html', function () {
  return gulp.src(sassentry)
    .pipe(gulp.dest(''));
});

// --- JS (WEBPACK)
gulp.task('webpack', function() {
  return gulp.src('/')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(''));
});

// --- HTML
gulp.task('html', function() {
  return gulp.src(htmlentry)
    .pipe(rename({
      dirname: htmldirname,
      basename: htmlfilename,
    }))
    .pipe(gulp.dest(''));
});

// --------------------
// --- PRODUCTION TASKS
// --------------------

gulp.task('minjs', function() {

  var dir = './'+jsdirname+'/'+js+'.js';

  console.log(dir);

  return gulp.src(dir)
    // .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify())
    .pipe(rename({
      dirname: jsdirname,
      basename: jsfilename,
      // prefix: ".min",
      suffix: ".min",
    }))
    .pipe(gulp.dest(''));
});

gulp.task('mincss', function() {

  var dir = './'+cssdirname+'/'+cssfilename+'.css';

  console.log(dir);

  return gulp.src(dir)
    .pipe(rename({
      dirname: cssdirname,
      basename: cssfilename,
      // prefix: ".min",
      suffix: ".min",
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(''));
});


gulp.task('minhtml', function() {

  var dir = './'+htmldirname+'/'+htmlfilename+'.html';

  console.log(dir);

  return gulp.src(dir)
    // .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify())
    .pipe(rename({
      dirname: htmldirname,
      basename: htmlfilename,
      // prefix: ".min",
      suffix: ".min",
    }))
    .pipe(gulp.dest(''));
});


gulp.task('production',['minjs','mincss'], function(){});

// --------------------
// --- OPTIONAL HTML
// --------------------

gulp.task('minify', function() {
  return gulp.src(htmlentry)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// ----------------
// --- UNUSED TASKS
// ----------------
// gulp.task('webserver', function() {
//   gulp.src('./dist')
//     .pipe(webserver({
//       livereload: true,
//       fallback: 'index.html',
//       directoryListing: false,
//       open: true
//    }));
// });
// gulp.task('watch', function() {
//   gulp.watch("src/js/**/*", ['webpack']);
//   gulp.watch("src/scss/**/*", ['sass']);
//   gulp.watch("src/index.html", ['minify']);
// });



