const path = require('path');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'public', 'home.html'));
});

router.post('/', function(req, res) {
  if (!req.files || !Object.keys(req.files).length) {
    return res.status(400).send('No files found');
  }

  let file = req.files.entities;
  file.mv(path.join(__dirname, 'uploaded'));
})

module.exports = router;
