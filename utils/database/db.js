const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('lessons', '', null, {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../storage/lessons.db'),
  pool: {
    max: 50, //максимальное кол-во соединений в пуле
    min: 0, //минимальное кол-во соединений в пуле
    acquire: 30000, //время в миллисекундах, в течение которого будет осуществляться попытка установить соединение, прежде чем будет сгенерировано исключение
    idle: 10000, //время простоя в миллисекундах, по истечении которого соединение покинет пул
  },
});

module.exports = sequelize;