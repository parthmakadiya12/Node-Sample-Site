var express = require('express');
var router = express.Router();
var db = require('../db');
var email = require("./path/to/emailjs/email");

router.post('/', function (req, res, next) {
    
    var server = email.server.connect({
        user: "8ea40e1d860cfcc92d6ac751675b176d",
        password: "6f56d9e334442df5d7f5c6b52fff9788",
        host: "in-v3.mailjet.com",
        ssl: true
    });

    // send the message and get a callback with an error or details of the message that was sent 
    server.send({
        text: "i hope this works",
        from: "parthmakadiya007@gmail.com",
        to: "parthmakadiya007@gmail.com",
        cc: "",
        subject: "testing emailjs"
    }, function (err, message) { console.log(err || message); });
});

