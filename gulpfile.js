var gulp = require('gulp');
var compass = require('gulp-compass');
var debug = require('gulp-debug');
var livereload = require('gulp-livereload');
var ngAnnotate = require('gulp-ng-annotate');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var vulcanize = require('gulp-vulcanize');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('eriyaz-compass', function() {
  gulp.src('./public/eriyaz/style/sass/*.scss')
    .pipe(compass({
      config_file: './public/eriyaz/style/config.rb',
      css: './public/eriyaz/style/stylesheets',
      sass: './public/eriyaz/style/sass',
      image: './public/eriyaz/images',
      import_path: ['./public']
    }))
    .pipe(debug({
      title: "generated css:"
    }));
  // .pipe(gulp.dest('./public/eriyaz/style/stylesheets/temp'));
});

gulp.task('testshell-compass', function() {
  gulp.src('./public/eartonic-apps/style/all.scss')
    .pipe(debug({
      title: 'sasfile'
    }))
    .pipe(compass({
      config_file: './public/eartonic-apps/style/config.rb',
      css: './public/eartonic-apps/style',
      sass: './public/eartonic-apps/style',
      image: './public/eriyaz/images',
      import_path: ['./public/eartonic-apps']
    }))
    .pipe(debug({
      title: "generated css:"
    }));
});

gulp.task('reload', function() {
  gulp.src('')
    .pipe(livereload());
});

gulp.task('compass', ['testshell-compass', 'eriyaz-compass']);

// Watch Files For Changes
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['**/*.css', '**/*.html', 'public/**/*.js'], ['reload']);
  gulp.watch('public/**/*.scss', ['compass']);
});

gulp.task('fast-reload', function() {
  livereload.listen();
  gulp.watch(['**/*.css', '**/*.html', 'public/**/*.js'], ['reload']);
});



gulp.task('rjs', function(cb) {
  rjs({
      baseUrl: "public",
      name: "main",
      out: "app.js",
      mainConfigFile: 'public/require-config.js',
      optimize: 'none',
      findNestedDependencies: true,
      insertRequire: ['main']
    })
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/')); // pipe it to the output DIR 
    cb();
});


gulp.task('buildjs',['rjs'], function() {
  return gulp.src(['public/external-libs/bower_components/webcomponentsjs/webcomponents.min.js',
    'public/external-libs/require.min.js',
    'public/dist/app.js'])
    .pipe(concat('build.js'))
    // .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('vulcanize', function() {
  var DEST_DIR = 'public/dist';
  return gulp.src('public/index-dist.html')
    .pipe(vulcanize({
      dest: DEST_DIR,
      strip: true
    }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest(DEST_DIR));
});

gulp.task('copy',function() {
  return gulp.src(['public/**/*.{html,jpg,css}','!**/{external-libs,dist}/**'],{base:'./public'})
    .pipe(gulp.dest('public/dist'));
});

gulp.task('del-temp',['buildjs'],function(cb) {
  del(['public/dist/app.js'],cb);
});

gulp.task('clean',function(cb) {
  del(['public/dist/*'],cb);
});

gulp.task('build',['buildjs','vulcanize','copy']);


gulp.task('default', ['compass', 'watch']);