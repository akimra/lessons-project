const models = require('../../model');
const sequelize = require('./db');
const { Sequelize } = require('sequelize');

const DbProvider = {
  models,
  sequelize,

  createLesson: async (lesson) => {
    
  }
}

module.exports = DbProvider;