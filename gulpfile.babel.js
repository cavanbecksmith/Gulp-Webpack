// --------------------
// --- REQUIRE MODULES
// --------------------

var gulp = require('gulp');
var webpack = require('webpack-stream');
var browserSync = require("browser-sync").create();
var plugins = require("gulp-load-plugins")();
const named = require('vinyl-named');

var requireHTML = false;
const jsFiles = ['./src/js/main.js', './src/js/homepage.js']

// ------------------
// --- DEFAULT TASKS
// ------------------

gulp.task('plugins', [], function () {
  console.log(plugins);
});

gulp.task('default',['webpack','sass'], function(){});

gulp.task('production',['minjs','mincss'], function(){});

gulp.task('dev',['webpack','sass'], function(){

  if(requireHTML){
    gulp.run('html');
    gulp.watch("src/index.html", ['html']).on('change', browserSync.reload);
  }

  // --- Using proxy allows for .php development
  browserSync.init({
      // open: requireHTML,
      // server: "./dist"
      proxy: "http://wordpress.local"
  });
  gulp.watch("*.php").on('change', browserSync.reload);
  gulp.watch("src/js/**/*", ['webpack']).on('change', browserSync.reload);
  gulp.watch("src/scss/**/*", ['sass']).on('change', browserSync.reload);
});

// ----------------
// --- DEV TASKS
// ----------------

// --- SASS (COMPILES ALL .SCSS FILES EXCLUDING _*.scss FILES)
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('html', function () {
  return gulp.src(sass_entry)
    .pipe(gulp.dest(''));
});

// --- JS (WEBPACK)
gulp.task('webpack', function() {
  return gulp.src(jsFiles)
    .pipe(named()) /* Allows webpack to compile multiple entrys */
    .pipe(plugins.webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./js'));
});

// --- CLEAN
gulp.task('clean', function () {
  return gulp.src(['./css', './js'], { read: false })
    .pipe(plugins.clean());
});

// --------------------
// --- PRODUCTION TASKS
// --------------------

gulp.task('webpack:prod', function() {
  return gulp.src(jsFiles)
    .pipe(named()) /* Allows webpack to compile multiple entrys */
    .pipe(plugins.webpack(require('./webpack.config.js')))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('./js'));
});

gulp.task('sass:prod', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.rename({
      suffix: ".min",
    }))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('./css'));
});

gulp.task('prod',['webpack:prod', 'sass:prod'], function(){});

// --------------------
// --- OPTIONAL HTML
// --------------------

gulp.task('html', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./'));
});