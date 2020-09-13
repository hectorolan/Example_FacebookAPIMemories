var express = require('express');
var router = express.Router();
var FacebookGraphApi = require('../services/facebook-graph-api');
var DaoMysql = require('../services/dao-mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let daoMysql = new DaoMysql();
    // Get from SQL what we have.

    let getPhotosCallback = function(photos){
        // Save in database
        photos.forEach(photo => {
            photo.userid = 1;
            daoMysql.savePhoto(photo);
        }); 
        res.send("hey");
    }

    let credsCallback = function(creds){        
        let fbapi = new FacebookGraphApi();
        fbapi.getPhotos(creds.facebookUserId, creds.accessToken, getPhotosCallback);        
    };

    // Ill get the facebook stuff 
    let result = daoMysql.getFacebookCreds(1, credsCallback);
});

module.exports = router;
