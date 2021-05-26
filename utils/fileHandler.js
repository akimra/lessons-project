const csv = require('fast-csv');
const fs = require('fs');
const dbProvider = require('./database/dbProvider');

const fileHandler = {
  db: dbProvider,
  
  parseLessons: async (pathFile) => {
    try {
      csv.parseFile(pathFile)
      .on('error', error => console.log(error))
      .on('data', async row => await db.createLesson(row))
      .on('end', rowCount => console.log(`${rowCount} rows parsed`))
    } catch (error) {
      console.log("fileHandlerError: Cant parse csv; " + error)
    }
    
  }
}

module.exports = fileHandler;