const express = require('express');
const Student = require('../models/transfer');
const Lab = require('../models/lab-details');

const router = express.Router();


// GET: Fetch All Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create or Transfer Student
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, department, currentLab, requestingLab, mailId, mobileNumber, reason } = req.body;

    const lab = await Lab.findOne({ name: requestingLab });
    if (!lab) {
      return res.status(404).json({ message: 'Selected lab not found' });
    }

    if (lab.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available in the selected lab' });
    }

    const newStudent = new Student({
      name,
      rollNumber,
      department,
      currentLab,
      requestingLab,
      mailId,
      mobileNumber,
      reason,
    });

    const savedStudent = await newStudent.save();

    lab.availableSeats -= 1;
    await lab.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Student Information
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Optional: Handle lab seat adjustment when requestingLab is changed
    if (updateData.requestingLab && updateData.requestingLab !== student.requestingLab) {
      const newLab = await Lab.findOne({ name: updateData.requestingLab });
      const oldLab = await Lab.findOne({ name: student.requestingLab });

      if (!newLab) {
        return res.status(404).json({ message: 'New lab not found' });
      }

      if (newLab.availableSeats <= 0) {
        return res.status(400).json({ message: 'No seats available in the new lab' });
      }

      if (oldLab) oldLab.availableSeats += 1;
      newLab.availableSeats -= 1;

      await newLab.save();
      if (oldLab) await oldLab.save();
    }

    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Adjust lab seats when deleting the student
    const lab = await Lab.findOne({ name: student.requestingLab });
    if (lab) {
      lab.availableSeats += 1;
      await lab.save();
    }

    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
