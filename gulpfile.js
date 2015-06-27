var browserSync = require('browser-sync'),
    del         = require('del'),
    gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify');


gulp.task('sass', function compileSass(){
  return gulp.src('./src/styles/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest('./assets'));
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['./src/*', './assets/*'],
      port: 7000,
      server: {
        baseDir: '.'
      },
      startPath: '/src'
    });
});


gulp.task('default', gulp.series('sass', function watch(){
  gulp.watch('./src/styles/*.scss', gulp.task('sass'));
}));
