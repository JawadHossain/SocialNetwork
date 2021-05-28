const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const router = express.Router();

const BCRYPT_SALT_ROUNDS = 10;
const JWT_SECRET = "this_is_a_long_secret";
/**
 * Signup User
 */
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
});

/**
 * Login User
 */
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      // check if user exists
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      fetchedUser = user;
      // compare hash
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      // check if result is false implying wrong password
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      // Generate JSON Web Token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});

module.exports = router;
