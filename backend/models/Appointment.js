const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  reason: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  estimatedWaitTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  queuePosition: {
    type: DataTypes.INTEGER
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Appointment;