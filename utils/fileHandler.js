const csv = require('fast-csv');
const fs = require('fs');
const db = require('./database/dbProvider');

const fileHandler = {
  parseLessons: async (pathFile) => {
    let result = {};
    let lessonsArray = [];

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", error);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', row => {
      lessonsArray.push(row);
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} rows parsed`);
      try {
        await db.createManyLessons(lessonsArray);
      } catch (err) {
        console.log(err);
      }
    });

    return result;
  },

  patchLogs: async (pathFile) => {
    let result = {};

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", error);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', row => {
      lessonsArray.push(row);
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} patches applied`);
    });

    return result;
  }
}

module.exports = fileHandler;