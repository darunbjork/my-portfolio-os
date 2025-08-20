const mongoose = require('mongoose');

const learningItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  dateStarted: { type: Date, required: true },
  link: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('LearningItem', learningItemSchema);
