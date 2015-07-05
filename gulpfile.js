var browserSync = require('browser-sync'),
    bump        = require('gulp-bump'),
    del         = require('del'),
    gulp        = require('gulp'),
    header      = require('gulp-header'),
    path        = require('path'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify');


var paths = {
  assets: './src/assets/**',
  manifest: './package.json',
  scss: './src/styles/*.scss',
  template: './src/template.html',
  vendor: [
    'event-emitter/dist/event-emitter.min.js',
    'imagesready/dist/jquery-imagesready.min.js',
    'infinite-scroll/dist/infinite-scroll.min.js',
    'quartz-layout/dist/match-media.min.js',
    'quartz-layout/dist/quartz.min.js'
  ],

  distDir: './dist',
  nodeDir: './node_modules',
  srcDir: './src'
};


gulp.task('bump.minor', function(){
  return gulp.src(paths.manifest)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump.patch', function(){
  return gulp.src(paths.manifest)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean.dist', function(done){
  del(paths.distDir, done);
});


gulp.task('copy', function(){
  return gulp.src([paths.assets, paths.template])
    .pipe(gulp.dest(paths.distDir));
});


gulp.task('copy.vendor', function(){
  return gulp.src(paths.vendor, {cwd: paths.nodeDir})
    .pipe(gulp.dest(paths.distDir));
});


gulp.task('headers', function(){
  var pkg = require('./package.json');
  var headerTemplate = '/* v<%= version %> - <%= date %> - <%= url %> */\n';
  var headerContent = {date: (new Date()).toISOString(), name: pkg.name, version: pkg.version, url: pkg.homepage};

  return gulp.src(['main.js', '*.css'], {cwd: paths.distDir})
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest(paths.distDir));
});


gulp.task('sass', function compileSass(){
  return gulp.src(paths.scss)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest(paths.distDir));
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['./src/**/*'],
      notify: false,
      port: 7000,
      server: {
        baseDir: '.'
      },
      startPath: paths.srcDir
    });
});


gulp.task('uglify', function(){
  return gulp.src('main.js', {cwd: paths.srcDir})
    .pipe(uglify())
    .pipe(gulp.dest(paths.distDir));
});


gulp.task('default', gulp.series('sass', function watch(){
  gulp.watch(paths.scss, gulp.task('sass'));
}));


gulp.task('build', gulp.series('clean.dist', 'copy', 'copy.vendor', 'sass', 'uglify', 'headers'));

gulp.task('dist:minor', gulp.series('build', 'bump.minor'));
gulp.task('dist:patch', gulp.series('build', 'bump.patch'));
