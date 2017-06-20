
//import { Passport } from 'passport';
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-id-token');
var GoogleAuth = require('google-auth-library');

   exports.authGoogleToken=function(req, res, next) {
        
    var auth = new GoogleAuth;
    var client = new auth.OAuth2('1054581437750-1bbg5ego0d568hnflmdn0iem6flaqrkd.apps.googleusercontent.com');
    console.log("GAuth starts..");
    client.verifyIdToken(
        req.header("authorization"),
        '1054581437750-1bbg5ego0d568hnflmdn0iem6flaqrkd.apps.googleusercontent.com',
        function (e, login) {
            console.log("gauth conversation result",e,login);
            //console.log("auth key "+req.header("authorization"));
            if (e !== null) {
                console.log("e not null at gAuth");
                res.status(401).send({
                    message: 'Unauthenticated',
                    token: req.params.token,
                });
            } else {
                console.log("Gauth at Else executing "+e, login);
                // If request specified a G Suite domain:
                //var domain = payload['hd'];
                /*var payload = login.getPayload();
                var userid = payload['sub'];
                res.status(200).send({
                    message: 'Authenticated',
                    token: req.params.token,
                    userid: userid
                });*/
                
                var payload = login.getPayload();
                var email = payload['email'];
                var uid = payload['sub'];
                req.body["loggedInUser"] = payload;
            console.log("Logged In User "+JSON.stringify(payload));
                
                next();
            }
        });


}
