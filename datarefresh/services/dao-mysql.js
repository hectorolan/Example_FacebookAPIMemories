var mysql = require('mysql');
var config = require('../config');

// Class
function DaoMysql() {
  this.connection = mysql.createConnection(config);
};

// Methods
function updateFacebook (accesstoken, expiredatetime, facebookid, name, email) {

  // expiredatetime needs to be in mysql-datetime
  let sql = `CALL update_facebook("${accesstoken}","${(new Date(expiredatetime)).toISOString().slice(0, 19).replace('T', ' ')}","${facebookid}","${name}","${email}")`;

  this.connection.query(sql, true, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results[0]);
  });
}
function savePhoto(photo){
  // expiredatetime needs to be in mysql-datetime
  let sql = `CALL add_image_main(
  "${photo.height}",
  "${photo.width}",
  "${photo.sourceurl}",
  "${photo.externalimageid}",
  "${(new Date(photo.photodate)).toISOString().slice(0, 19).replace('T', ' ')}",
  "${photo.externalphotoid}",
  "${photo.photoexternallink}",
  "${photo.photoname}",
  "${photo.photoaltname}",
  "${(new Date(photo.albumdate)).toISOString().slice(0, 19).replace('T', ' ')}",
  "${photo.albumname}",
  "${photo.albumtext}",
  "${photo.externalalbumid}",
  "${photo.userid}")`;

  this.connection.query(sql, true, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results[0]);
  });
}
function getPhotos(userid) {

}
function getFacebookCreds(userid, credsCallback){
  // expiredatetime needs to be in mysql-datetime
  let sql = `CALL get_facebook_creds(${userid})`;
  
    this.connection.query(sql, true, (error, results, fields) => {
      if (error) {
        console.error(error.message);
        credsCallback(null);
        return;
      }

      if(results[0] && results[0][0]){
        let userCreds = {
          accessToken: results[0][0].AccessToken ? results[0][0].AccessToken : '',
          facebookUserId: results[0][0].FacebookUserId ? results[0][0].FacebookUserId : '',
        }

        if(results[0][0].ExpireDateTime){
          userCreds.expireDatetime = new Date(results[0][0].ExpireDateTime);
        }else{
          userCreds.expireDatetime = '';
        }  
        
        credsCallback(userCreds);
        return;
      }

      credsCallback({
        accessToken: '',
        facebookUserId: '',
        expireDatetime: ''
      });
      return;
    });
}

DaoMysql.prototype.getPhotos = getPhotos;
DaoMysql.prototype.savePhoto = savePhoto;
DaoMysql.prototype.updateFacebook = updateFacebook;
DaoMysql.prototype.getFacebookCreds = getFacebookCreds;

module.exports = DaoMysql;
