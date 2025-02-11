const express = require('express');
const Lab = require('../models/lab-details');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, availableSlots, achievements, projects } = req.body;
    const newLab = new Lab({ name, description, availableSlots, achievements, projects });
    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find();
    res.status(200).json(labs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Get a single lab by ID
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    res.status(200).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a lab
router.put('/:id', async (req, res) => {
  try {
    console.log("Updating Lab with ID:", req.params.id);
    console.log("Request Body:", req.body);

    const { _id, ...updateData } = req.body; 

    const updatedLab = await Lab.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // Prevents full object replacement
      { new: true, runValidators: true }
    );

    if (!updatedLab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json(updatedLab);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: error.message });
  }
});


//  Delete a lab
router.delete('/:id', async (req, res) => {
  try {
    const deletedLab = await Lab.findByIdAndDelete(req.params.id);
    if (!deletedLab) return res.status(404).json({ message: 'Lab not found' });
    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ────────────────────────────
// 🔹 ACHIEVEMENT ROUTES
// ────────────────────────────

//  Add an achievement to a lab
router.post('/:id/achievements', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    lab.achievements.push(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Delete an achievement from a lab
router.delete('/:id/achievements/:achievementId', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    lab.achievements = lab.achievements.filter(ach => ach._id.toString() !== req.params.achievementId);
    await lab.save();
    res.status(200).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ────────────────────────────
// 🔹 PROJECT ROUTES
// ────────────────────────────

//  Add a project to a lab
router.post('/:id/projects', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    lab.projects.push(req.body);

    await lab.save();
    console.log(req.body);
    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Delete a project from a lab
router.delete('/:id/projects/:projectId', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    lab.projects = lab.projects.filter(proj => proj._id.toString() !== req.params.projectId);
    await lab.save();
    res.status(200).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
