const fs = require('fs');
const moment = require('moment');
const openInEditor = require('open-in-editor');

const TODAY = moment();
const LOG_PREFIX = 'jon-log-';
const LOG_SUFFIX = '.md';
const HEADER =
`*****************************************************************

Jon's Work Logs for ${TODAY.format('ll')}

*****************************************************************

`;
const FILE_NAME = LOG_PREFIX + TODAY.format('YYYY-MM-DD') + LOG_SUFFIX;

const editor = openInEditor.configure({
  cmd: `code`,
  pattern: '-r -g {filename}:{line}:{column}',
  line: 8,
});

const createNewLog = () => {
  console.log(`creating new file for ${TODAY.format('ll')}...`);
  fs.writeFile(
    FILE_NAME,
    HEADER,
    (err, success) => {
      if (err) {
        console.log('Error writing file: ' + err);
      } else {
        console.log(`Successfully created new log for ${TODAY.format('ll')}`);
        console.log('Opening file...')
        // oh no callback hell
        editor.open(FILE_NAME)
          .then(success => {
            console.log(`opened file ${FILE_NAME}`);
          })
          .catch(err => console.log('error opening: ', err))
      }
    }
  )
}

createNewLog();