const jwt = require("jsonwebtoken");

const JWT_SECRET = "this_is_a_long_secret";

/**
 * Validates JSON WEB TOKEN
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
