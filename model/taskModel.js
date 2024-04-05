// models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  },
  name: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
