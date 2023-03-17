const express = require("express");
const app = express();
const postRoutes = require("./routes/posts");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);



mongoose
  .connect(
    "mongodb+srv://benosolomon18:1u7RrYekxR6IPL2T@mean.aoaprr2.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to db successfully");
  })
  .catch((err) => {
    console.log("Connection Faileed", err);
  });

const Post = require("./models/post");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 1u7RrYekxR6IPL2T

// mongosh "mongodb+srv://meancourse.m2y5u8y.mongodb.net/myFirstDatabase" --apiVersion 1 --username benosolomon

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});
app.use("/api/posts",postRoutes);
module.exports = app;
