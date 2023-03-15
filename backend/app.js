const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://benosolomon18:1u7RrYekxR6IPL2T@mean.aoaprr2.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to db successfully");
  }
  ).catch((err) => {
    console.log("Connection Faileed",err);
  })

const Post = require('./models/post');

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

app.post("/api/posts", (req, res, next) => {
const post = new Post({
  title: req.body.title,
  content: req.body.content
});
  post.save().then(result => {
    res.status(201).json({
      message: "Post Added successfully",
      postId: result._id
    });
  });

});

app.get("/api/posts", (req, res, next) => {

  Post.find()
  .then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Post Fetched Successfully",
      posts:documents
    });
  });
});

app.delete("/api/posts/:id",(req,res,next) => {
  Post.deleteOne({_id : req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post Deleted"
    });
  })

})
module.exports = app;
