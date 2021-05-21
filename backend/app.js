const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// Add parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Create Post
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully!",
  });
});

// Get Posts
app.get("/api/posts", (req, res, next) => {
  let posts = [
    {
      id: "fadf124",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "fasdfadf124",
      title: "Second server-side post",
      content: "This is coming from the server",
    },
  ];
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts,
  });
});

module.exports = app;
