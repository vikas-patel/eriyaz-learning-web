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
var htmlreplace = require('gulp-html-replace');

gulp.task('eriyaz-compass', function() {
  gulp.src('./client/public/src/er-shell/style/sass/*.scss')
    .pipe(compass({
      config_file: './client/public/src/er-shell/style/config.rb',
      css: './client/public/src/er-shell/style/stylesheets',
      sass: './client/public/src/er-shell/style/sass',
      image: './client/public/src/er-shell/images',
      import_path: ['.client/public/src']
    }))
    .pipe(debug({
      title: "generated css:"
    }));
  // .pipe(gulp.dest('./client/public/src/er-shell/style/stylesheets/temp'));
});

gulp.task('testshell-compass', function() {
  gulp.src('./client/public/src/er-apps/style/all.scss')
    .pipe(debug({
      title: 'sasfile'
    }))
    .pipe(compass({
      config_file: './client/public/src/er-apps/style/config.rb',
      css: './client/public/src/er-apps/style',
      sass: './client/public/src/er-apps/style',
      image: './client/public/src/er-app/images',
      import_path: ['./client/public/src/er-apps']
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
  gulp.watch(['**/*.css', '**/*.html', 'client/**/*.js'], ['reload']);
  gulp.watch('client/**/*.scss', ['compass']);
});

gulp.task('fast-reload', function() {
  livereload.listen();
  gulp.watch(['**/*.css', '**/*.html', 'client/**/*.js'], ['reload']);
});



gulp.task('rjs', function(cb) {
  rjs({
      baseUrl: "client/public/src",
      name: "main",
      out: "app.js",
      mainConfigFile: 'client/public/src/require-config.js',
      optimize: 'none',
      findNestedDependencies: true,
      insertRequire: ['main']
    })
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./client/public/dist/')); // pipe it to the output DIR 
    cb();
});


gulp.task('buildjs',['rjs'], function() {
  return gulp.src(['client/public/src/ext-libs/bower_components/webcomponentsjs/webcomponents.min.js',
    'client/public/src/ext-libs/require.min.js',
    'client/public/dist/app.js'])
    .pipe(concat('build.js'))
    // .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest('client/public/dist'));
});

gulp.task('htmlreplace',function() {
  gulp.src('client/public/src/index.html')
    .pipe(htmlreplace({
      'js':'build.js'
    }))
    .pipe(gulp.dest('client/public/dist'));
});

gulp.task('vulcanize', function() {
  var DEST_DIR = 'client/public/dist';
  return gulp.src('client/public/src/imports.html')
    .pipe(vulcanize({
      dest: DEST_DIR,
      inline:true,
      strip: true
    }))
    // .pipe(rename("index.html"))
    .pipe(gulp.dest(DEST_DIR));
});

gulp.task('copy',function() {
  return gulp.src(['client/public/src/**/*.{html,jpg,css}','!**/{ext-libs,dist}/**','!**/{imports,index}.html'],{base:'./client/public/src'})
    .pipe(gulp.dest('client/public/dist'));
});

gulp.task('del-temp',['buildjs'],function(cb) {
  del(['client/public/dist/app.js'],cb);
});

gulp.task('clean',function(cb) {
  del(['client/public/dist/*'],cb);
});

gulp.task('build',['buildjs','vulcanize','htmlreplace','copy']);


gulp.task('default', ['compass', 'watch']);