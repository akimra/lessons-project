const models = require('../../model');
const sequelize = require('./db');

const DbProvider = {
  models,
  sequelize,

  getAllLessons: async function () {
    try {
      return await this.models.Lesson.findAll({ attributes: {exclude: ['id'] } });
    } catch (e) {
      console.log("DbProviderError: error while getting all lessons ", e);
    }
  },

  createLesson: async function (lesson) {
    try {
      await this.models.Lesson.create(lesson);
    } catch (e) {
      console.log(`DbProviderError: error while creating ${lesson.event_id} lesson `, e);
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
      console.log(`DbProviderError: error while updating ${data.event_id} lesson `, e);
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
          copyLesson.comission = .0;
          // и обновляем данные LessonDetails
          copyLesson = Object.assign(copyLesson, data);
          await this.createLesson(copyLesson);
        } else {
          await this.updateLessons(lessons[0]);
        }
      }
    } catch (e) {

    }
  },

  updateLessonDetails: async function (data) {
    try {
      let editedLessonsDetails = await this.models.Lesson.findAll({
        where: {
          attendance_id: data.attendance_id
        }
      });

      editedLessonsDetails.forEach(async (lesson) => await lesson.update(data));
    } catch (e) {
      console.log(`DbProviderError: error while updating ${data.attendance_id} lesson details `, e);
    }
  },

  deleteLessonDetails: async function () {
    try {
      let deletedLessonDetails = await this.models.Lesson.findOne({
        where: {
          attendance_id: data.attendance_id
        }
      });
      //зануляем данные LessonDetails
      deletedLessonDetails.attendance_id = null;
      deletedLessonDetails.customer_id = null;
      deletedLessonDetails.is_attend = null;
      deletedLessonDetails.reason_id = null;
      deletedLessonDetails.comission = null;

      deletedLessonDetails.save();
    } catch (e) {
      console.log(`DbProviderError: error while updating ${data.attendance_id} lesson details `, e);
    }
  }
}

module.exports = DbProvider;