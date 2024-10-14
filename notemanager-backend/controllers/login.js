// Controller for login
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Login
loginRouter.post('/', [check('username').trim().escape()], async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send('Username or password missing');
    console.log('Username or password missing');
    return;
  }

  try {
    const user = await User.findByPk(username);
    if (!user) {
      console.log('User does not exist');
      res.status(404).send('User does not exist');
      return;
    }

    // console.log(user);

    // Check password with bcrypt
    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      console.log('Wrong password');
      res.status(401).send('Wrong password');
      return;
    }

    // Generate a jwt-token and send it
    const token = jwt.sign(
      { username: user.username, isadmin: user.isadmin },
      process.env.SECRET,
      {
        expiresIn: '1h',
      }
    );
    // console.log(`Generated token ${token} for user ${username}`);
    res.status(200).send({ token: token, username: username });
  } catch (error) {
    console.log(error);
  }
});

// Logout
loginRouter.post('/', (req, res) => {});

module.exports = loginRouter;
