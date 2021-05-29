/**
 * Consists of user routes
 */

const express = require("express");

const UserController = require("../controllers/users");

const router = express.Router();
/**
 * Signup User
 */
router.post("/signup", UserController.createUser);

/**
 * Login User
 */
router.post("/login", UserController.userLogin);

module.exports = router;
