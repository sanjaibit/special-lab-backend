const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rollNumber: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        currentLab: {
            type: String,
            required: true,
            ref: 'Lab',
        },
        requestingLab: {
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

module.exports = mongoose.model('transfer', transferSchema);
