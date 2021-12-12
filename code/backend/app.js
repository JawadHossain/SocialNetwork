const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

// import routes
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

// Connect Database
mongoose
  .connect(
    `mongodb+srv://jhossain:${process.env.MONGODB_PASS}@cluster0.un59u.mongodb.net/social-network?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

// Add parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("images"))); // path relative to server.js

// Setup CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://social-network-jhossain.s3-website-us-west-2.amazonaws.com',
    'http://localhost:4200'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// Setup routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
