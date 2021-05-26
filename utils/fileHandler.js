const csv = require('fast-csv');
const fs = require('fs');
const db = require('./database/dbProvider');

const fileHandler = {
  parseLessons: async (pathFile) => {
    let result;

    csv.parseFile(pathFile, {headers: true})
    .on('error', error => console.log("FileHandler Error: Cant parse csv", error))
    .on('headers', headers => {
      // TODO: validate columns
      throw new Error("FileHandler Error: Bad columns");
    })
    .on('data', async row => {
      await db.createLesson(row);
    })
    .on('end', rowCount => console.log(`${rowCount} rows parsed`));

    return result;
  }
}

module.exports = fileHandler;