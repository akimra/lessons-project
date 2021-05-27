const path = require('path');
const express = require('express');
const router = express.Router();
const fileHandler = require('../utils/fileHandler');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'public', 'home.html'));
});

router.post('/', async function(req, res) {
  if (!req.files || !Object.keys(req.files).length) {
    return res.status(400).send('No files found');
  }

  // сохраним полученный файл
  const lessonsFileName = path.join(__dirname, '../', 'files', 'uploaded', 'lessons.csv');
  let file = req.files.entities;
  file.mv(lessonsFileName);

  // запускаем процесс разбора данных и записи в бд
  fileHandler.parseLessons(lessonsFileName)
  .then((result) => {
    if (result.error) {
      res.statusCode(500).json(result);
    }
    res.status(201).end();
  })
  .catch(err => {
    res.statusCode(500).json({error: true, reason: "FileHandlerError: error while saving lessons in db", errorObject: err})
  });
})

router.patch('/', async function(req, res) {
  if (!req.files || !Object.keys(req.files).length) {
    return res.status(400).send('No files found');
  }

  // сохраним полученный файл
  const logsFileName = path.join(__dirname, '../', 'files', 'uploaded', 'logs.csv');
  let file = req.files.log;
  file.mv(logsFileName);

  // запускаем процесс разбора данных и записи в бд
  fileHandler.patchLogs(logsFileName)
  .then((result) => {
    if (result.error) {
      res.statusCode(500).json(result);
    }
    res.status(201).end();
  })
  .catch(err => {
    res.statusCode(500).json({error: true, reason: "FileHandlerError: error while saving lessons in db", errorObject: err});
  });
})

module.exports = router;