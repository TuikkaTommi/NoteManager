// Controller for users
const { check, validationResult } = require('express-validator');
const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const middleware = require('../utils/middleware');

// Get all users. Only available to admins
userRouter.get('/', middleware.extractUser, async (req, res) => {
  if (req.user.isadmin) {
    try {
      const users = await User.findAll({ attributes: { exclude: 'password' } });
      console.log(users);
      res.status(200).send(users);
    } catch (error) {
      res.status(400).send(err.message);
    }
  } else {
    res.status(401).send('Unauthorized');
    return;
  }
});

// Get one user by username, using sequalizes find by primary key-methdod. Only available to admins
userRouter.get('/:username', middleware.extractUser, async (req, res) => {
  if (req.user.isadmin) {
    try {
      const user = await User.findByPk(req.params.username, {
        attributes: { exclude: 'password' },
      });
      if (!user) {
        res.status(404).send('No matching user found');
      } else {
        console.log(user);
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  } else {
    res.status(401).send('Unauthorized');
    return;
  }
});

// Add a new user. Input is sanitized with express-validators check() and escape()-methods
userRouter.post(
  '/',
  [check('username').trim().escape(), check('password').trim().escape()],
  async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      res.status(400).send('Invalid request body');
      console.log('Received invalid request body');
      return;
    }

    // Check if user with given username already exists
    const existingUser = await User.findByPk(username, {
      attributes: { exclude: 'password' },
    });
    if (existingUser) {
      // console.log(existingUser);
      console.log('User with this username already exists');
      res.status(400).send({ message: 'User already exists' });
      return;
    }

    // Regular expression for password requirements.
    // Password must be atleast 8 chars long, contain at least one number,
    // one lowercase letter, one uppercase letter and it cannot contain spaces
    // const regex = new RegExp(`^.*(?=.{8,})(?=.*[a-zA-ZäöÄÖ])(?=.*\d).*$`);
    //
    // if (!regex.test(password)) {
    //   console.log('Password does not fulfill requirements');
    //   res.status(403).send('Password does not fulfill requirements');
    //   return;
    // }
    try {
      // Password hashing with bcrypt
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          res.status(400).send('Error creating user');
          return;
        }
        console.log(hashedPassword);
        // Add user with hashed password to db
        await User.create({
          username: username,
          password: hashedPassword,
          isadmin: 0,
        });
        res.status(201).send('User created succesfully');
        console.log('User created succesfully');
      });
    } catch (error) {
      res.status(400).send('Error adding user to db');
    }
  }
);

// Delete user. Regular user can only delete their own account. Admins can delete any account.
userRouter.delete('/:username', middleware.extractUser, async (req, res) => {
  const username = req.params.username;
  if (req.user.username === username || req.user.isadmin) {
    try {
      const username = req.params.username;
      const userToDelete = await User.findByPk(username, {
        attributes: { exclude: 'password' },
      });
      if (!userToDelete) {
        res.status(404).send('User with provided username does not exist');
        return;
      }
      await userToDelete.destroy();
      console.log(`User ${username} deleted successfully`);
      res.status(200).send(`User ${username} deleted successfully`);
    } catch (error) {
      res.status(400).send('Error deleting user');
      console.log(error);
    }
  } else {
    res.status(401).send('Unauthorized');
    return;
  }
});

module.exports = userRouter;
