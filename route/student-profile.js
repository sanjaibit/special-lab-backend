const express = require('express');
const StudentProfile = require('../models/student-profile'); // Adjust the path if necessary
const router = express.Router();


// Fetch all student profiles
router.get('/', async (req, res) => {
    try {
      const students = await StudentProfile.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
// GET: Retrieve student profile by email ID
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        console.log(email);
        const studentProfile = await StudentProfile.findOne({ email: email });
        
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.status(200).json(studentProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student profile', error });
    }
});

// POST: Add or update a student profile by email ID
router.post('/', async (req, res) => {
    try {
        const { email, name, rollNo, department, specialLab, attendance, achievements, tasks } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let studentProfile = await StudentProfile.findOne({ email: email });

        if (studentProfile) {
            // Update existing profile
            studentProfile.name = name || studentProfile.name;
            studentProfile.rollNo = rollNo || studentProfile.rollNo;
            studentProfile.department = department || studentProfile.department;
            studentProfile.specialLab = specialLab || studentProfile.specialLab;
            studentProfile.attendance = attendance || studentProfile.attendance;
            studentProfile.achievements = achievements || studentProfile.achievements;
            studentProfile.tasks = tasks || studentProfile.tasks;

            await studentProfile.save();
            res.status(200).json({ message: 'Student profile updated', studentProfile });
        } else {
            // Create new profile
            studentProfile = new StudentProfile({
                email,
                name,
                rollNo,
                department,
                specialLab,
                attendance,
                achievements,
                tasks
            });

            await studentProfile.save();
            res.status(201).json({ message: 'Student profile created', studentProfile });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error saving student profile', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const student = await StudentProfile.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      res.status(200).json({ message: 'Student profile deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updatedStudent = await StudentProfile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  
// DELETE: Remove a specific achievement from a student's profile
router.delete('/:email/achievement/:achievement', async (req, res) => {
  try {
      const { email, achievement } = req.params;
      
      const studentProfile = await StudentProfile.findOne({ email });
      
      if (!studentProfile) {
          return res.status(404).json({ message: 'Student profile not found' });
      }

      // Remove achievement if it exists
      studentProfile.achievements = studentProfile.achievements.filter(a => a !== achievement);
      await studentProfile.save();
      console.log(studentProfile.achievements);
      res.status(200).json({ message: 'Achievement deleted successfully', achievements: studentProfile.achievements });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting achievement', error });
  }
});

// DELETE: Remove a specific task from a student's profile
router.delete('/:email/task/:task', async (req, res) => {
  try {
      const { email, task } = req.params;
      const studentProfile = await StudentProfile.findOne({ email });

      if (!studentProfile) {
          return res.status(404).json({ message: 'Student profile not found' });
      }

      // Remove task if it exists
      studentProfile.tasks = studentProfile.tasks.filter(t => t !== task);
      await studentProfile.save();

      res.status(200).json({ message: 'Task deleted successfully', tasks: studentProfile.tasks });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
  }
});


module.exports = router;
