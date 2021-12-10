/**
 * Consists of post routes
 */

const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

/**
 * Create a Post
 */
router.post("", checkAuth, extractFile, PostController.createPost);

/**
 * Update a Post
 */
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

/**
 * Get All Posts
 */
router.get("", PostController.getPosts);

/**
 * Get a Post
 */
router.get("/:id", PostController.getPost);

/**
 * Delete a Post
 */
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
