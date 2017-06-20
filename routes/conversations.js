var express = require('express');
var router = express.Router();
var db = require('../db');
var gAuth = require('../auth/Gauth');
var app = require("../app");
/* GET users listing. */
var getConversation = function (req, res, next) {

  var query = req.query;
  var className = query.CLASSNAME;
  className = className.toString();
  if (query.SENDER != null) {
    var sender = query.SENDER;
    sender = sender.toString();
    var receiver = query.RECEIVER;
    receiver = receiver.toString();
    console.log("===IF==getconversation======" + JSON.stringify(className));
    var collection = db.get().collection(className)
    collection.find({"sender":sender,"receiver":receiver}).limit(50).toArray(function (err, docs) {
      res.send(docs);
      console.log("Return ALL conversations" + docs);
    })
  }
  else {
    console.log("===ELSE==getconversation======" + JSON.stringify(className));
    var collection = db.get().collection(className)
    collection.find().limit(50).toArray(function (err, docs) {
      res.send(docs);
      console.log("Return ALL conversations" + docs);
    })
  }
}

var postConversation = function (req, res, next) {
  var cNam = req.body.conversations.className;
  var collection = db.get().collection(cNam);

  var conversation = {
    message: req.body.conversations.message,
    type: req.body.conversations.type,
    uid: req.body.loggedInUser.sub,
    name: req.body.loggedInUser.name,
    classname: req.body.conversations.className,
    time: new Date(),
    //p2p: req.body.conversations.p2p,
    sender:req.body.conversations.sender,
    receiver:req.body.conversations.receiver
  }
  app.io.emit('message', conversation);
  collection.insert(conversation, function (err, result) {
    if (!err) {
      res.send({ Result: true });
      console.log("Result true");
    } else {
      res.send({ Result: false });
      console.log("Result false");
    }
  })
}
router.get('/', gAuth.authGoogleToken, getConversation);
router.post('/', gAuth.authGoogleToken, postConversation);
module.exports = router;