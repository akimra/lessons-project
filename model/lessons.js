const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database/db');

const Lesson = sequelize.define("Lesson", {
  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   allowNull: false
  // },
  gen_branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_attend: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  reason_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  group_ids: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  teacher_ids: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lesson_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  attendance_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comission: {
    type: DataTypes.FLOAT(10, 2).UNSIGNED,
    allowNull: false,
    defaultValue: .0
  },
  time_from: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time_to: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(2000),
    allowNull: true
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Lesson;