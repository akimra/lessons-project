const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database/db');

const Lesson = sequelize.define("Lesson", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  gen_branch_id: {
    type: DataTypes.INTEGER
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  event_date: {
    type: DataTypes.DATEONLY
  },
  customer_id: {
    type: DataTypes.INTEGER
  },
  is_attend: {
    type: DataTypes.BOOLEAN
  },
  reason_id: {
    type: DataTypes.INTEGER
  },
  group_ids: {
    type: DataTypes.INTEGER
  },
  teacher_ids: {
    type: DataTypes.INTEGER
  },
  lesson_type_id: {
    type: DataTypes.INTEGER
  },
  subject_id: {
    type: DataTypes.INTEGER
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  attendance_id: {
    type: DataTypes.INTEGER
  },
  comission: {
    type: DataTypes.FLOAT(10, 2).UNSIGNED,
    defaultValue: .0
  },
  time_from: {
    type: DataTypes.DATE
  },
  time_to: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.INTEGER
  },
  note: {
    type: DataTypes.STRING(2000)
  },
  topic: {
    type: DataTypes.STRING
  }
},
{
  timestamps: false,
  indexes: [
    {
      using: 'BTREE',
      fields: ['event_id', 'attendance_id']
    }
  ]
});

module.exports = Lesson;