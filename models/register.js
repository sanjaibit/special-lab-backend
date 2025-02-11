const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    specialLab: { 
      type: String, 
      required: true, 
      ref: 'Lab', 
    },
    mailId: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Register', studentSchema);
