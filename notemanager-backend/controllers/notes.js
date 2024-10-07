const { check, validationResult } = require('express-validator');
const notesRouter = require('express').Router();
const Note = require('../models/note');
const middleware = require('../utils/middleware');

// Get all notes for user, sorted by priority
notesRouter.get('/', middleware.extractUser, async (req, res) => {
  // console.log('Requesting all notes of user', req.user.username);
  try {
    const notes = await Note.findAll({
      where: {
        user: req.user.username,
      },
      order: [['priority', 'DESC']],
    });
    console.log(notes);
    res.status(200).send(notes);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// Get one note by id, using sequalizes find by primary key-methdod
notesRouter.get('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      res.status(404).send('No matching note found');
    } else {
      console.log(note);
      res.status(200).send(note);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Add a new note. Input is sanitized with express-validators check() and escape()-methods
notesRouter.post(
  '/',
  middleware.extractUser,
  [check('title').trim().escape(), check('description').trim().escape()],
  async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const priority = req.body.priority;
    const user = req.user;
    if (!title || !description || !priority) {
      res.status(400).send({ message: 'Invalid request body' });
      console.log('Received invalid request body');
      return;
    }

    try {
      await Note.create({
        title: title,
        description: description,
        priority: priority,
        user: user.username,
      });
      res.status(201).send('Note inserted succesfully');
      console.log('Note inserted succesfully');
    } catch (error) {
      res.status(400).send('Error inserting note to DB');
    }
  }
);

// Update a note
notesRouter.put(
  '/:id',
  middleware.extractUser,
  [check('title').trim().escape(), check('description').trim().escape()],
  async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const priority = req.body.priority;
    const user = req.user;

    if (!title || !description || !priority) {
      res.status(400).send('Invalid request body');
      console.log('Received invalid request body');
      return;
    }

    try {
      noteToUpdate = await Note.findByPk(id);
      if (!noteToUpdate) {
        res.status(404).send('Note with provided id does not exist');
        return;
      }
      if (noteToUpdate.user !== user.username) {
        res.status(401).send('Unauthorized');
        return;
      }
      await noteToUpdate.update({
        title: title,
        description: description,
        priority: priority,
      });
      console.log(`Note with id ${id} updated successfully`);
      res.status(200).send(`Note with id ${id} updated successfully`);
    } catch (error) {
      res.status(400).send('Error updating note in DB');
      console.log(error);
    }
  }
);

// Delete a note
notesRouter.delete('/:id', middleware.extractUser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const noteToDelete = await Note.findByPk(id);
    if (!noteToDelete) {
      res.status(404).send('Note with provided id does not exist');
      return;
    }

    if (noteToDelete.user !== user.username) {
      res.status(401).send('Unauthorized');
      return;
    }
    await noteToDelete.destroy();
    console.log(`Note with id ${id} deleted successfully`);
    res.status(200).send(`Note with id ${id} deleted successfully`);
  } catch (error) {
    res.status(400).send('Error deleting note in DB');
    console.log(error);
  }
});

module.exports = notesRouter;
