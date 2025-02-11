const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Achievement Schema
const achievementSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Define Project Schema
const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,

  },
  endDate: {
    type: Date
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a User model
  }],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'pending'],
    default: 'ongoing'
  }
});

// Define Lab Schema with Achievements and Projects
const labSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  availableSlots: {
    type: Number,
    required: true,
    min: 0
  },
  achievements: [achievementSchema], // Embedding achievements
  projects: [projectSchema], // Embedding projects
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lab = mongoose.model('Lab', labSchema);
module.exports = Lab;
