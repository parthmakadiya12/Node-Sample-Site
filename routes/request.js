var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var uid = req.header("uid");
    var collection = db.get().collection('requestC')
    collection.find({ ownerid: uid }).toArray(function (err, docs) {
        res.send(docs);
        console.log("Return ALL requestC" + docs);
    })
    //res.send('Logic of inUsers');
});

router.post('/acc', function (req, res, next) {
    var pheader = req.header("classH");
    var collection = db.get().collection('requestC');
    collection.update(
        { classname: pheader },
        { $addToSet: { members: req.body.uid } }
    ).toArray(function (err, docs) {
        res.send(docs);
        console.log("Extreme post Function Return" + JSON.stringify(docs));
    })
});
router.post('/accs', function (req, res, next) {
    var pheader = req.header("classH");
    var collection = db.get().collection('classes');
    
    console.log("Header "+pheader);
    console.log("memberid "+req.body.uid);    
    collection.update(
        { classname: pheader},
        { $addToSet: {"members": req.body.uid  } }
   , function (err, result) {
        if (err) {
            console.log("Error"+err);
        }
        res.send(result);
        console.log("Extreme post Function Return" + JSON.stringify(result));
    });
    var col = db.get().collection('requestC');
    col.remove({"uid":req.body.uid ,"classname":pheader},function (errs, resu) {
        if (errs) {
            console.log("Error at remove"+errs);
        }
        console.log("Extreme post Function Remove" + JSON.stringify(resu));
    });
});


router.post('/', function (req, res, next) {
    var pheader = req.header("classH");
    var collection = db.get().collection('requestC')
    collection.insert(req.body, function (err, result) {
        collection.find().toArray(function (err, docs) {
            console.log(docs[0])
            console.log(JSON.stringify(req.headers));
            //db.close()
            res.send(docs[0]);
        })
    })
    //res.send('Logic of requestC');
});

module.exports = router;
