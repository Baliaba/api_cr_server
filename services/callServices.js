var fetch = require('node-fetch');

function callapi(link, param) {
  //console.log(link);
  var promise = new Promise((resolve, reject) => {
    fetch(link, param)
      .catch(e => {
        console.log('call api fetch error', e.message);
      })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(e => {
        console.log('call api promise reject error', e.message);
      })
  });
  return promise;
}

var exports = module.exports = {
  callapi
}