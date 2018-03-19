const gulp = require('gulp');
const watch = require('gulp-watch');

const {
  backUpLogsToGit,
  createNewLog,
} = require('./scripts/makeLog');

gulp.task('watch', () => {
  console.log('watching journal for updates...')
  gulp.watch('entries/**/*.md', {
    readDelay: 10000 // only update every 10 seconds
  }, backUpLogsToGit);
});

gulp.task('default', () => {
  createNewLog()
    .then(backUpLogsToGit)
    .then(() => gulp.run('watch'));
});
