const db = require('../model');
const admin = db.admin;
const jwt = require('jsonwebtoken');
//const jwtsec = "nikhil@123";
const jwtsec = "nikhil@123";

const adminMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, jwtsec);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin acesss.'});
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = adminMiddleware;