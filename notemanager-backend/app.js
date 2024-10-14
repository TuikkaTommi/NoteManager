require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./dbConn');
const notesRouter = require('./controllers/notes');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const captchaRouter = require('./controllers/captcha');
// const middleware = require('./utils/middleware');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use('/notes', notesRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/captcha', captchaRouter);

// Function that connects to db and then starts the server
const startApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server listening at port: ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startApp();

module.exports = app;
