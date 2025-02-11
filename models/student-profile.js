const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], required: true },
  dueDate: { type: Date, required: true },
});

const studentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  specialLab: { type: String },
  attendance: { type: Number, required: true, min: 0, max: 100 }, // Percentage (0-100)
  achievements: { type: [String], default: [] }, // List of achievements as strings
  tasks: { type: [taskSchema], default: [] }, // Nested schema for tasks
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
