const express = require('express');
const Student = require('../models/register');
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

router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, department, specialLab, mailId, mobileNumber } = req.body;

  
    const lab = await Lab.findOne({ name: specialLab });
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
      specialLab,
      mailId,
      mobileNumber
    });
    const savedStudent = await newStudent.save();

  
    lab.availableSeats -= 1;
    await lab.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student record
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the available seats in the corresponding lab
    const lab = await Lab.findOne({ name: student.specialLab });
    if (lab) {
      lab.availableSeats += 1;
      await lab.save();
    }

    // Delete the student record
    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find the existing student record
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If the lab is being changed, update the available seats accordingly
    if (updatedData.specialLab && updatedData.specialLab !== student.specialLab) {
      const oldLab = await Lab.findOne({ name: student.specialLab });
      const newLab = await Lab.findOne({ name: updatedData.specialLab });

      if (!newLab) {
        return res.status(404).json({ message: 'New lab not found' });
      }

      if (newLab.availableSeats <= 0) {
        return res.status(400).json({ message: 'No seats available in the new lab' });
      }

      // Update seat counts in both labs
      if (oldLab) {
        oldLab.availableSeats += 1;
        await oldLab.save();
      }

      newLab.availableSeats -= 1;
      await newLab.save();
    }

    // Update the student record
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
