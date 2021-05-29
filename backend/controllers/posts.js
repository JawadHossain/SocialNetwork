/**
 * Consists of post route controls
 */

const Post = require("../models/post");

/**
 * Create a Post
 */
exports.createPost = (req, res, next) => {
  //  create file url
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Post Creation Failed!",
      });
    });
};

/**
 * Update a Post
 */
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  // check if image was updated.
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update Successful" });
      }
      res.status(401).json({ message: "You can only edit your posts." });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Post Update Failed!",
      });
    });
};

/**
 * Get All Posts
 */
exports.getPosts = (req, res, next) => {
  // Extract query params
  const pageSize = req.query.pagesize;
  const currentPage = req.query.page;

  let fetchedPosts;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Post Fetch Failed!",
      });
    });
};

/**
 * Get a Post
 */
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Post Fetch Failed!",
      });
    });
};

/**
 * Delete a Post
 */
exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post deleted!" });
      }
      res.status(401).json({ message: "Not Authorized!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Post Deletion Failed!",
      });
    });
};
