// models/Project.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  name: String,
  milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
