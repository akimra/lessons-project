const csv = require('fast-csv');
const fs = require('fs');
const db = require('./database/dbProvider');

const fileHandler = {
  parseLessons: async (pathFile) => {
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
        await db.createManyLessons(lessonsArray);
      } catch (err) {
        console.log(err);
      }
    });

    return result;
  },

  patchLogs: async (pathFile) => {
    let result = {};

    csv.parseFile(pathFile, {headers: true})
    .on('error', err => {
      console.log("FileHandler Error: Cant parse csv", error);
      result.error = true;
      result.reason = 'FileHandler Error: Cant parse csv';
      result.errorObject = err;
    })
    .on('data', row => {
      const fields_new = json.parse(row.fields_new);
      let data = {};
      
      data.gen_branch_id = fields_new.gen_branch_id;
      data.event_id = fields_new.lesson_id; //
      data.event_date = Date.parse(fields_new.lesson_date);
      data.customer_ids = fields_new.customer_ids;
      data.is_attend = fields_new.is_attend;
      //////////////////
      reason_id = fields_new.reason_id;
      group_ids = fields_new.group_ids[0]; //
      teacher_ids = fields_new.teacher_ids[0];//
      lesson_type_id = fields_new.lesson_type_id;
      subject_id = fields_new.subject_id;
      room_id = fields_new.room_id;
      comission = fields_new.comission;
      time_from = fields_new.time_from;
      time_to = fields_new.time_to;
      status = fields_new.status;
      note = fields_new.note;
      topic = fields_new.topic;

      // TEST
      if (fields_new.customer_id != undefined) {
        console.log('CUSTOMER ID CHECKED');
      }
      //--------------
      if (row.entity === 'Lesson') {
        event_id = row.entity_id;
        db.patchLesson(event_id, customer_ids);

        // определяем тип события в логе, затем выполняем соответствующие действия
        switch (row.event) {
          case 1:
          default: break;
        }

      } else {

      }
      //db.patchLesson(event_id, customer_ids);
    })
    .on('end', async rowCount => {
      console.log(`${rowCount} patches applied`);
    });

    return result;
  }
}

module.exports = fileHandler;