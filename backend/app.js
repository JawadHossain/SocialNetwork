const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
require("dotenv").config();

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

app.use("/images", express.static(path.join("backend/images")));

// Setup CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
