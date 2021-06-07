const models = require('../../model');
const path = require('path');
const { Sequelize } = require('sequelize');

const DbProvider = {
  models,
  sequelize: new Sequelize('lessons', '', null, {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../storage/lessons.db'),
    pool: {
      max: 50, //максимальное кол-во соединений в пуле
      min: 0, //минимальное кол-во соединений в пуле
      acquire: 30000, //время в миллисекундах, в течение которого будет осуществляться попытка установить соединение, прежде чем будет сгенерировано исключение
      idle: 10000, //время простоя в миллисекундах, по истечении которого соединение покинет пул
    },
  }),

  createLesson: async function (lesson) {
    try {
      await this.models.Lesson.create(lesson);
    } catch (e) {
      console.log(`DbProviderError: error while updating ${lesson.event_id} lesson `, e);
    }
  },

  createManyLessons: async function (lesson) {
    try {
      lesson.time_from = Date.parse(lesson.time_from);
    lesson.time_to = Date.parse(lesson.time_to);
    await this.models.Lesson.bulkCreate(lesson, {validate: true});
    } catch (e) {
      console.log(`DbProviderError: error while bulk creating lessons `, e);
    }
    
  },

  updateLessons: async function (data) {
    try {
      let editedLessons = await this.models.Lesson.findAll({
        where: {
          event_id: data.event_id
        }
      });
      editedLessons.forEach(async (lesson) => await lesson.update(data));
    } catch (e) {
      console.log(`DbProviderError: error while updating ${data.entity_id} lesson `, e);
    }
    
  },

  deleteLessons: async function (event_id) {
    try {
      await this.models.Lesson.destroy({
      where: { event_id }
    });
    } catch (e) {
      console.log(`DbProviderError: error while deleting ${event_id} lesson `, e);
    }
    
  },

  saveLessons: async function () {
    try {
      this.models.Lesson.save();
    } catch (e) {
      console.log(`DbProviderError: error while saving `, e);
    }
  },

  createLessonDetails: async function (data) {
    try {
      // Определим урок, к которому относится сущность LessonDetails
      let lessons = await this.models.Lesson.findAll({
        where: {
          lesson_id: data.event_id
        }
      });
      //Если такие уроки есть
      if (lessons.length) {
        // и если к ним уже привязаны другие сущности LessonDetails - создаем новую связку Lesson <-> LessonDetails
        // с теми же данными Lesson, но пустыми данными LessonDetails
        if (lessons[0].attendance_id) {
          let copyLesson = lessons[0];
          copyLesson.id = null;
          copyLesson.customer_id = null;
          copyLesson.is_attend = null;
          copyLesson.reason_id = null;
        }
      }
    } catch (e) {

    }
  },

  updateLessonDetails: async function () {

  },

  deleteLessonDetails: async function () {

  }
}

module.exports = DbProvider;