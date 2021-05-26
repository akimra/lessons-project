const path = require('path');
const express = require('express');
const router = express.Router();
const fileHandler = require('../utils/fileHandler');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'public', 'home.html'));
});

router.post('/', function(req, res) {
  if (!req.files || !Object.keys(req.files).length) {
    return res.status(400).send('No files found');
  }

  const lessonsFileName = path.join(__dirname, '../', 'files', 'uploaded', 'lessons.csv')
  let file = req.files.entities;
  
  // сохраняем файл и запускаем процесс разбора данных и записи в бд
  file.mv(lessonsFileName);
  fileHandler.parseLessons(lessonsFileName);
  res.send('processing...');
})

module.exports = router;