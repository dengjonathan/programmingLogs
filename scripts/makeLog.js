const execGitCmd = require('run-git-command');
const fs = require('fs');
const moment = require('moment');
const openInEditor = require('open-in-editor');

const TODAY = moment();
const DIRECTORY = './entries/';
const LOG_PREFIX = 'jon-log-';
const LOG_SUFFIX = '.md';
const DATE_FORMAT_REGEX = /\d{4}-\d{2}-\d{2}/;
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


const checkIfLogExists = () => fs.existsSync(FILE_NAME);

const didCreateEntryForToday = () => {
  const {
    lastCreated,
  } = journalState;
  return moment().isSame(lastCreated, 'day');
};

const updateLastCreatedEntry = (date) => {
  date = date || moment();
  journalState.lastCreated = date;
}

const getLastCreatedEntryDate = () => {
  const files = fs.readdirSync(DIRECTORY)
  // this assumes the last file will be the latest due to numbering order
  return moment(
    files[files.length - 1].match(DATE_FORMAT_REGEX)[0]
  );
}

// TODO: add trim task to get rid of unused entries

// keep global vars that different functions need to access
// TODO: deal with timezone differences
const journalState = {
  lastCreated: getLastCreatedEntryDate(),
};

const createNewLog = () => {
  if (checkIfLogExists()) {
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
          updateLastCreatedEntry();
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

backUpLogsToGit = () => {
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

module.exports = {
  backUpLogsToGit,
  checkIfLogExists,
  createNewLog,
};
