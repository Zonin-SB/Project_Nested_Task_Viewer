// models/Milestone.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilestoneSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  name: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

const Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = Milestone;
