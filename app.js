const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const port = 3000;

const homeRouter = require('./routes/home');

//Тестируем подключение к базе
const sequelize = require('./utils/database/db');

sequelize.authenticate()
.then(res => console.log('db connection is ok'))
.catch(err => console.log('error while connecting to database: ', err));
//-------------------
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'http_access.log'), {flags: 'a'});

const app = express();

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  debug: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// пишем критичные логи в консоль
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400
}));
// а все логи в файл
app.use(morgan('common', {
  stream: logStream
}));

app.use('/', homeRouter);

sequelize.sync()
.then(() => {
  app.listen(port, () => console.log(`server is running on ${port}`));
});

