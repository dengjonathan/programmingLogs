const execGitCmd = require('run-git-command');
const fs = require('fs');
const moment = require('moment');
const openInEditor = require('open-in-editor');

const TODAY = moment();
const DIRECTORY = './entries/';
const LOG_PREFIX = 'jon-log-';
const LOG_SUFFIX = '.md';
const HEADER =
`*****************************************************************

Jon's Work Logs for ${TODAY.format('ll')}

*****************************************************************

`;
const FILE_NAME = DIRECTORY + LOG_PREFIX + TODAY.format('YYYY-MM-DD') + LOG_SUFFIX;

const editor = openInEditor.configure({
  cmd: `code`,
  pattern: '-r -g {filename}:{line}:{column}',
  line: 8,
});

exports.createNewLog = () => {
  // TODO make sure doesn't overwrrite exisitng file
  if (fs.existsSync(FILE_NAME)) {
    console.warn(`file ${FILE_NAME} already exists, not creating new one`)
    return Promise.resolve();
  }
  console.log(`creating new file for ${TODAY.format('ll')}...`);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      FILE_NAME,
      HEADER,
      (err, success) => {
        if (err) {
          console.log('Error writing file: ' + err);
          reject(err);
        } else {
          console.log(`Successfully created new log for ${TODAY.format('ll')}`);
          console.log('Opening file...')
          resolve(
            editor.open(FILE_NAME)
              .then(success => {
                console.log(`opened file ${FILE_NAME}`);
              })
              .catch(err => console.log('error opening: ', err))
          );
        }
      }
    )
  });
}

exports.backUpLogsToGit = () => {
  console.log('pulling latest from remote');
  return execGitCmd(['pull', 'origin', 'master'])
    .then(() => {
      execGitCmd(['add', DIRECTORY]);
    })
    .then(() => {
      console.log('committing latest updates...');
      execGitCmd(['commit', '-m', `update with logs as of ${TODAY.format('ll')}`]);
    })
    .then(() => {
      console.log('pushing to origin');
      execGitCmd(['push', 'origin', 'master']);
    })
    .then(() => console.log('backed up latest on github'))
    .catch(err => {
      console.error(`Error in git ops ${err}`);
    });
};
