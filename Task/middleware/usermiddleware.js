const jwt = require('jsonwebtoken');
const jwtsec = "nikhil@123";

const userMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'jwtsec');

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = userMiddleware;