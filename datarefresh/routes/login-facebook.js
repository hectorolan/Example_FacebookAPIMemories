var express = require('express');
var router = express.Router();
var path = require('path');
var DaoMysql = require('../services/dao-mysql');

router.get('/', function (req, res, next) {
    let facebookloginurl = 'https://www.facebook.com/v8.0/dialog/oauth?client_id=952780715197196&response_type=token&redirect_uri=https://localhost:3000/facebooklogin/callback&state="{st=state123abc,ds=123456789}"&scope=user_photos,email';
    res.redirect(facebookloginurl);
});

router.get('/callback', function (req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/facebookcallback.html'));
});

router.post('/save', function (req, res, next) {
  let mysql = new DaoMysql();
  mysql.updateFacebook(req.body.accesstoken, req.body.expiredatetime, req.body.facebookuserid,
    req.body.username, req.body.email);
  res.sendStatus(200);
});

module.exports = router;
