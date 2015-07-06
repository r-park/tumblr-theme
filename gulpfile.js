var browserSync  = require('browser-sync'),
    gulp         = require('gulp');


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['./views/**/*', './images/**/*'],
      notify: false,
      port: 8000,
      proxy: 'localhost:7000'
    });
});
