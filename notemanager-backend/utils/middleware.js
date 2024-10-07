const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Extract jwt from a request
const extractToken = (request) => {
  const token = request.get('authorization');
  if (!token) {
    return null;
  }
  // console.log(token);
  return token;
};

// Get user information from jwt
const extractUser = async (request, response, next) => {
  const token = extractToken(request);

  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET);

      if (!decodedToken.username) {
        return response.status(401).json({ error: 'Invalid token' });
      }

      // console.log('Decoded user from jwt:', decodedToken.username);
      request.user = await User.findByPk(decodedToken.username, {
        attributes: { exclude: 'password' },
      });

      if (!request.user) {
        return response.status(401).json({ error: 'Invalid token' });
      }
    } else {
      return response.status(401).send('Missing authorization token');
    }

    next();
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { extractUser };
