const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
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
      };
    });

    return result;
  },

  patchLogs: async function (pathFile) {
    let result = {};
    applyingDate = new Date(1621287867000 - 1000 * 60 * 60 * 12) // применение логов за последние 12 часов

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", err);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', async row => {
      // max date 1621287867000
      if (row.event === 2 && this._isUselessLog(row) || Date.parse(row.date_time) < applyingDate) {
        return;
      }

      const fields_new = JSON.parse(row.fields_new);
      let data = this._transformData(fields_new);

      if (row.enitity === 'Lesson') {
        data.event_id = row.enitity_id;
        

        // определяем тип события в логе, затем выполняем соответствующие действия
        switch (Number.parseInt(row.event)) {
          case 1:
            await this.db.createLesson(data);
            break;
          case 2:
            await this.db.updateLessons(data);
            break;
          case 3:
            await this.db.deleteLessons(data.event_id);
            break;
          default: break;
        }

      } else  if (row.enitity === 'LessonDetails'){
        if (row.is_attend !== undefined) data.is_attend = row.is_attend;
        data.attendance_id = row.enitity_id;

        switch (Number.parseInt(row.event)) {
          case 1:
            await this.db.createLessonDetails(data);
            break;
          case 2:
            await this.db.updateLessonDetails(data);
            break;
          case 3:
            await this.db.deleteLessonDetail(data.event_id);
            break;
          default: break;
        }
      }
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} rows parsed`);
    });

    return result;
  },

  exportToCsv: async function (cb) {
    let output = path.join(__dirname, "../", 'files', 'out.csv');
    let lessons = await this.db.getAllLessons();

    lessons = lessons.map((l) => l.dataValues).map((l) => {
      // формат даты
      l.time_from = `${l.time_from.getFullYear()}-${l.time_from.getMonth()}-${l.time_from.getDate()} ${l.time_from.toTimeString().substring(0, 8)}`;
      l.time_to = `${l.time_to.getFullYear()}-${l.time_to.getMonth()}-${l.time_to.getDate()} ${l.time_to.toTimeString().substring(0, 8)}`;
      // преобразование bool значения в 0 или 1
      if (l.is_attend) l.is_attend = 1;
      else l.is_attend = 0;
      return l;
    });
    try {
      fs.writeFileSync(output, "");
    } catch (e) {
      console.error('fileHandlerError: error while creating output file', e);
      output = {error: true, reason: "Creating file failed"};
    }

    csv.writeToPath(output, lessons, {headers: true})
      .on('error', e => {
        console.error('fileHandlerError: error while writing csv in file', e);
        output = {error: true, reason: "Writing to csv file failed"};
      })
      .on('finish', () => {
        console.log('Export to csv done');
        cb(output);
      });
  }
}

module.exports = fileHandler;