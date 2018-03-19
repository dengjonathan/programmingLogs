const gulp = require('gulp');
const {
  backUpLogsToGit,
  createNewLog,
} = require('./scripts/makeLog');

gulp.task('create', createNewLog);

gulp.task('backup', backUpLogsToGit);

gulp.task('default', () => {
  gulp.lastRun('create', 'backup');
});
