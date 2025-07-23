const router = require('express').Router();
const Entry = require('../models/Entry.model');
const mongoose = require('mongoose');

// Create a new project
router.post('/entries', async (req, res, next) => {
  const { userId } = req.body;
  console.log(req.body, userId)

  try {
    const newEntry = await Entry.create({
      "entry": userId,
    });

    console.log('New entry', newEntry);
    res.status(201).json(newEntry);
  } catch (error) {
    console.log('An error ocurred creating the entry', error);
    next(error);
  }
});

// Read all projects
router.get('/entries', async (req, res, next) => {
  console.log(req.headers);
  try {
    const allEntries = await Entry.find({}).populate('entry');
    // Project.find({title: "Learn React"}) / we pass the MongoDB queries here

    console.log('All entries', allEntries);
    res.json(allEntries);
  } catch (error) {
    console.log('An error ocurred getting all entries', error);
    next(error);
  }
});

// Read one project by id
router.get('/entries/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // check if id is a valid value in our db
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const entry = await Entry.findById(id).populate('entry');

    if (!entry) {
      return res.status(404).json({ message: 'No entry found' });
    }
    res.json(entry);
  } catch (error) {
    console.log('An error ocurred getting the entry', error);
    next(error);
  }
});

router.delete('/entries/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    await Entry.findByIdAndDelete(id);

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the entry', error);
    next(error);
  }
});

module.exports = router;
