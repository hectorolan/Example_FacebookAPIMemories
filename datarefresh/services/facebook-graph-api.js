const https = require('https');

// Class
function FacebookGraphApi() {
  
};

// Methods
function getPhotos(facebookUserId, accessToken, callback) {
  let url = `https://graph.facebook.com/v8.0/${facebookUserId}/photos?fields=id,album,alt_text,created_time,images,link,name&access_token=${accessToken}`;
  loadPage(url, callback);
}
//-------------------------------------------------------------//
// This methos will go page by page and collecting all the photos 
// information, it will load the photos object passed by ref.
function loadPage(uri, callback){
  let url = new URL(uri);
  let options = {
    host: url.host,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  let resource = '';

  https.get(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      resource += chunk;
    });
  
    res.on('end', function () {
      console.log('resource' + resource);
      let photos = new Array();
      collectPhotos(photos, JSON.parse(resource));
      callback(photos);
    });
  }).on('error', (e) => {
    console.error(e);
  }).end();
}
function collectPhotos(photos, resource){
  if(resource.data){
    addPhotos(photos, resource.data);
  }
  if(resource.next && resource.next != ''){
    loadPage(photos, resource.next);
  }
}
function addPhotos(photos, objData){
  for (let index = 0; index < objData.length; index++) {

    const fbphoto = objData[index];
    let photoBase = {
      photodate: fbphoto.created_time ? new Date(Date.parse(fbphoto.created_time)) : null,
      externalphotoid : fbphoto.id,
      photoexternallink: fbphoto.link ? fbphoto.link : null,
      photoname: fbphoto.name ? fbphoto.name : null,
      photoaltname: fbphoto.alt_text ? fbphoto.alt_text : null,
      albumdate: fbphoto.album && fbphoto.album.created_time ? new Date(Date.parse(fbphoto.album.created_time)) : null,
      albumtext: fbphoto.album && fbphoto.album.name ? fbphoto.album.name : null,
      externalalbumid: fbphoto.album && fbphoto.album.id ? fbphoto.album.id : null
    };

    for (let imgIndex = 0; imgIndex < fbphoto.images.length; imgIndex++) {
      const fbImg = fbphoto.images[imgIndex];
      let newPhoto = Object.assign({}, photoBase); // making a copy of base
      newPhoto.height = fbImg.height;
      newPhoto.width = fbImg.width;
      newPhoto.sourceurl = fbImg.source

      photos.push(newPhoto);
    }

}
    
}
//-------------------------------------------------------------//

FacebookGraphApi.prototype.getPhotos = getPhotos;
FacebookGraphApi.prototype.loadPage = loadPage;
FacebookGraphApi.prototype.collectPhotos = collectPhotos;
FacebookGraphApi.prototype.addPhotos = addPhotos;

module.exports = FacebookGraphApi;