const models = require('../../model');
const sequelize = require('./db');
const { Sequelize } = require('sequelize');
const { GetFindOptions } = require('../optionsBuilder');

const DbProvider = {
  models,
  sequelize,

  
}

module.exports = DbProvider;