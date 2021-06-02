const csv = require('fast-csv');
const fs = require('fs');
const dbProvider = require('./database/dbProvider');

const fileHandler = {
  db: dbProvider,

  // Метод определяет, вносит ли лог изменения на самом деле по нужным атрибутам
  _isUselessLog: function (logRow) {
    if (logRow.entity === 'Lesson') {
      if (Object.keys(logRow.fields_new).length === 0) return true;
      if (Object.keys(logRow.fields_new).length === 1 && logRow.fields_new.customer_ids !== undefined) return true
    }

    return false;
  },

  _transformData: function (fields_new) {
    let data = {};

    if (fields_new.gen_branch_id !== undefined) data.gen_branch_id = fields_new.gen_branch_id;
    if (fields_new.lesson_id !== undefined) data.event_id = fields_new.lesson_id;
    if (fields_new.lesson_date !== undefined) data.event_date = Date.parse(fields_new.lesson_date);
    if (fields_new.customer_id !== undefined) data.customer_id = fields_new.customer_id;
    if (fields_new.is_attend !== undefined) data.is_attend = fields_new.is_attend;
    if (fields_new.reason_id !== undefined) data.reason_id = fields_new.reason_id;
    if (fields_new.group_ids !== undefined && fields_new.group_ids.length > 0) data.group_ids = fields_new.group_ids[0];
    if (fields_new.teacher_ids !== undefined && fields_new.teacher_ids.length > 0) data.teacher_ids = fields_new.teacher_ids[0];
    if (fields_new.lesson_type_id !== undefined) data.lesson_type_id = fields_new.lesson_type_id;
    if (fields_new.subject_id !== undefined) data.subject_id = fields_new.subject_id;
    if (fields_new.room_id !== undefined) data.room_id = fields_new.room_id;
    if (fields_new.comission !== undefined) data.comission = fields_new.comission;
    if (fields_new.time_from !== undefined) data.time_from = Date.parse(fields_new.time_from);
    if (fields_new.time_to !== undefined) data.time_to = Date.parse(fields_new.time_to);
    if (fields_new.status !== undefined) data.status = fields_new.status;
    if (fields_new.note !== undefined) data.note = fields_new.note;
    if (fields_new.topic !== undefined) data.topic = fields_new.topic;

    return data;
  },

  parseLessons: async function (pathFile) {
    let result = {};
    let lessonsArray = [];

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", error);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', row => {
      lessonsArray.push(row);
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} rows parsed`);
      try {
        await this.db.createManyLessons(lessonsArray);
      } catch (err) {
        console.log(err);
      }
    });

    return result;
  },

  patchLogs: async function (pathFile) {
    let result = {};

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", err);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', row => {
      if (row.event === 2 && this._isUselessLog(row)) {
        return;
      }
      const fields_new = JSON.parse(row.fields_new);
      let data = this._transformData(fields_new);
      console.log(data);

      //--------------
      if (row.entity === 'Lesson') {
        data.event_id = row.entity_id;
        

        // определяем тип события в логе, затем выполняем соответствующие действия
        switch (row.event) {
          case 1:
            this.db.createLesson(data);
            break;
          case 2:
            this.db.updateLessons(data);
            break;
          case 3:
            this.db.deleteLessons(data.entity_id);
            break;
          default: break;
        }

      } else  if (row.entity === 'LessonDetails'){
        
      }
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} patches applied`);
    });

    return result;
  }
}

module.exports = fileHandler;