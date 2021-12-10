/**
 * Checks User Token / Auth Status
 */

const jwt = require("jsonwebtoken");

/**
 * Validate JSON WEB TOKEN
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    // add user info to req for next middlewares
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };

    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
