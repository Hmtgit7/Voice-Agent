// models/index.js
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Import models
const Job = require('./Job')(sequelize, DataTypes);
const Candidate = require('./Candidate')(sequelize, DataTypes);
const Appointment = require('./Appointment')(sequelize, DataTypes);
const Conversation = require('./Conversation')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);

// Define associations
Job.hasMany(Appointment, { foreignKey: 'job_id' });
Appointment.belongsTo(Job, { foreignKey: 'job_id' });

Candidate.hasMany(Appointment, { foreignKey: 'candidate_id' });
Appointment.belongsTo(Candidate, { foreignKey: 'candidate_id' });

Candidate.hasMany(Conversation, { foreignKey: 'candidate_id' });
Conversation.belongsTo(Candidate, { foreignKey: 'candidate_id' });

module.exports = {
    sequelize,
    Job,
    Candidate,
    Appointment,
    Conversation,
    User,
};