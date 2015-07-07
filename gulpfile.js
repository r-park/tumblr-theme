var autoprefixer = require('autoprefixer-core'),
    browserSync  = require('browser-sync'),
    bump         = require('gulp-bump'),
    del          = require('del'),
    gulp         = require('gulp'),
    header       = require('gulp-header'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify');


var dev = true;


var dir = {
  dist: './dist',
  node: './node_modules',
  src: './src',
  target: './target'
};


var files = {
  assets: './src/assets/**',
  html: './src/*.html',
  js: './src/*.js',
  manifest: './package.json',
  scss: './src/styles/*.scss',
  template: './src/template.html',
  vendor: [
    'event-emitter/dist/event-emitter.min.js',
    'imagesready/dist/jquery-imagesready.min.js',
    'infinite-scroll/dist/infinite-scroll.min.js',
    'quartz-layout/dist/match-media.min.js',
    'quartz-layout/dist/quartz.min.js'
  ]
};


gulp.task('bump.minor', function(){
  return gulp.src(files.manifest)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump.patch', function(){
  return gulp.src(files.manifest)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean.dist', function(done){
  del(dir.dist, done);
});


gulp.task('clean.target', function(done){
  del(dir.target, done);
});


gulp.task('copy.dev', function(){
  return gulp.src([files.assets, files.html, files.js])
    .pipe(gulp.dest(dir.target));
});


gulp.task('copy.vendor', function(){
  return gulp.src(files.vendor, {cwd: dir.node})
    .pipe(gulp.dest(dir.dist));
});


gulp.task('copy.dist', gulp.parallel('copy.vendor', function(){
  return gulp.src([files.assets, files.template])
    .pipe(gulp.dest(dir.dist));
}));


gulp.task('headers', function(){
  var pkg = require(files.manifest);
  var headerTemplate = '/* v<%= version %> - <%= date %> - <%= url %> */\n';
  var headerContent = {date: (new Date()).toISOString(), name: pkg.name, version: pkg.version, url: pkg.homepage};

  return gulp.src(['main.js', '*.css'], {cwd: dir.dist})
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest(dir.dist));
});


gulp.task('sass', function compileSass(){
  return gulp.src(files.scss)
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['./node_modules'],
      outputStyle: dev ? 'nested' : 'compressed',
      precision: 10,
      sourceComments: false
    }))
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR', 'Opera 12.1'] }) ]))
    .pipe(gulp.dest(dev ? dir.target : dir.dist));
});


gulp.task('set.dev', function(done){
  dev = true;
  done();
});


gulp.task('set.dist', function(done){
  dev = false;
  done();
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: dir.target,
      notify: false,
      port: 7000,
      server: {baseDir: '.'},
      startPath: dir.target
    });
});


gulp.task('uglify', function(){
  return gulp.src('main.js', {cwd: dir.src})
    .pipe(uglify())
    .pipe(gulp.dest(dir.dist));
});


gulp.task('build', gulp.series(
  'set.dist',
  'clean.dist',
  'copy.dist',
  'sass',
  'uglify'
));


gulp.task('default', gulp.series('set.dev', 'clean.target', 'copy.dev', 'sass', function watch(){
  gulp.watch([files.assets, files.html, files.js], gulp.task('copy.dev'));
  gulp.watch(files.scss, gulp.task('sass'));
}));


gulp.task('dist:minor', gulp.series('build', 'bump.minor', 'headers'));
gulp.task('dist:patch', gulp.series('build', 'bump.patch', 'headers'));
