var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {

  var collection = db.get().collection('inUsers')
  collection.find().toArray(function (err, docs) {
    res.send(docs);
       console.log("Return ALL inUsers"+docs);
  })
  //res.send('Logic of inUsers');
});


router.post('/', function (req, res, next) {
  var pheader;
  var collection = db.get().collection('inUsers')
  collection.insert(req.body, function (err, result) {
    collection.find({ classname: req.body.classname }).toArray(function (err, docs) {
      console.log(docs[0])
      console.log(JSON.stringify(req.headers));
      //db.close()
      res.send(docs[0]);
    })
  })

  //res.send('Logic of inUsers');
});
module.exports = router;
