var browserSync = require('browser-sync'),
    gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon');


gulp.task('server', function(){
  nodemon({
    script: 'server.js',
    env: { 'NODE_ENV': 'development' }
  })
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['./views/**/*', './images/**/*'],
      injectChanges: false,
      notify: false,
      port: 8000,
      proxy: 'localhost:7000',
      reloadDelay: 1200
    });
});
