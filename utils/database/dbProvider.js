const models = require('../../model');
const sequelize = require('./db');
const { Sequelize } = require('sequelize');

const DbProvider = {
  models,
  sequelize,

  createLesson: async function (lesson) {
    await this.models.Lesson.create(lesson);
  },

  createManyLessons: async function (lesson) {
    lesson.time_from = Date.parse(lesson.time_from);
    lesson.time_to = Date.parse(lesson.time_to);
    await this.models.Lesson.bulkCreate(lesson, {validate: true});
  },

  updateLessons: async function (data) {
    await this.models.Lesson.update(data, {
      where: {
        event_id: data.event_id
      },
      logging: true
    });
    
  },

  deleteLessons: async function (event_id) {
    await this.models.Lesson.destroy({
      where: { event_id },
      logging: true
    });
  }
}

module.exports = DbProvider;