var express = require('express');
var router = express.Router();
var db = require('../db');
var gAuth = require('../auth/Gauth');


/* GET users listing. */
var getClasses = function (req, res, next) {
  //  console.log(req.header("authorization"));
  console.log("loggedinuser", req.body.loggedInUser);

  var collection = db.get().collection('classes')
  collection.find().toArray(function (err, docs) {
    res.send(docs);
    console.log("Return ALL classes" + docs);
  })
  //res.send('Logic of Classes');
};

router.get('/admins', function (req, res, next) {
  console.log(req.header("loggedInUser") + req.header("uid"));
  var ID = req.header("uid");
  var collection = db.get().collection('classes')
  collection.find({ "owners": { "$in": [ID] } }).toArray(function (err, docs) {
    res.send(docs);
    console.log("Admin Class" + docs);
  })
  //res.send('Logic of Classes');
});

router.get('/mydata', function (req, res, next) {
  console.log(req.header("loggedInUser") + req.header("uid"));
  var ID = req.header("uid");
  var collection = db.get().collection('classes')
  collection.find({ "members": { "$in": [ID] } }).toArray(function (err, docs) {
    res.send(docs);
    console.log("myOwn Class" + docs);
  })
  //res.send('Logic of Classes');
});

router.get('/classD', function (req, res, next) {
  var className = req.header("classH");
  var collection = db.get().collection('classes')
  collection.aggregate([
    {
      $unwind: "$members"
    },
    {
      $lookup:
      {
        from: "inUsers",
        localField: "members",
        foreignField: "uid",
        as: "newd"
      }
    },
    {
      $match: { "newd": { $ne: [] }, "classname": className }
    }
  ]).toArray(function (err, docs) {
    res.send(docs);
    console.log("Extreme Function Return" + JSON.stringify(docs));
  })
});

router.post('/', function (req, res, next) {
  var pheader;
  var collection = db.get().collection('classes')
  collection.insert(req.body.class, function (err, result) {
    collection.find({ classname: req.body.class.classname }).toArray(function (err, docs) {
      console.log(docs)
      console.log(JSON.stringify(req.headers));
      //db.close()
      res.send(docs);
    })
  })
  /*
  var zp = collection.find({ "classname": "Class-Name" });
  for (var i = 1; i <= 25; i++) {
    zp.update({ $addToSet: { "members": i }});
  }
  */
  //res.send('Logic of Classes');
});


router.get('/', gAuth.authGoogleToken, getClasses);
module.exports = router;
