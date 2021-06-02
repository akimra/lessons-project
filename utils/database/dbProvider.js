const models = require('../../model');
const sequelize = require('./db');
const { Sequelize } = require('sequelize');

const DbProvider = {
  models,
  sequelize,

  createManyLessons: async function (lesson) {
    lesson.time_from = Date.parse(lesson.time_from);
    lesson.time_to = Date.parse(lesson.time_to);
    await this.models.Lesson.bulkCreate(lesson, {validate: true});
  },

  patchLesson: async function (event, cus) {
    if (cus.length > 0) {
      let mod = await this.models.Lesson.findAll({
        where: {
          event_id: event
        }
      });
      mod.forEach((m) => {
        if (cus.find((element) => element === mod.customer_id)) {
          console.log('ALERT!!!!!');
        }
      })
    }
    
  }
}

module.exports = DbProvider;