const models = require('../../model');
const sequelize = require('./db');
const { Sequelize } = require('sequelize');

const DbProvider = {
  models,
  sequelize,

  createManyLessons: async (lesson) => {
    await models.Lesson.bulkCreate(lesson, {validate: true, ignoreDuplicates: true});
  }
}

module.exports = DbProvider;