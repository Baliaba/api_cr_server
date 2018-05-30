var qeueu = require('./../controllers/queueController.js');
var clanHelpers = require('./../clanHelper/clanHelper.js');
var callApi = require('./../services/callServices.js');

function getData(conf, schemas) {
    var promise = new Promise((resolve, reject) => {
        // call queueController to get url 
        qeueu.getUrl(conf.database)
            .then((response) => {
                // get clan data with call api services
                callApi.callapi(response.url, conf.params)
                    .then((clanData) => {
                        // call clan helper to updated clan data and return last inserted clan tag
                        console.log(clanData.tag);
                        clanHelpers.initClan(clanData, conf, schemas, response.key)
                        .then((urlPlay) => {
                            // call Players Helpers to updated players data
                            let data = {
                                urlPlay: urlPlay,
                                clanTag: response.clan,
                                key    :response.key
                            }
                            resolve(data);
                        }).catch((err)=>{console.log("tratiement clan  Error ",err.message)})
                    }).catch((err)=>{console.log("call api clan  Error ",err.message)})
            }).catch((err)=>{console.log("Fetch queue Error",err.message)})
    })
    return promise;
}
function getSimpleClanData(conf, schemas , clanTag) {
    console.log('getSimpleClanData' , clanTag);
    var promise = new Promise((resolve, reject) => {
                callApi.callapi(conf.url_clan+clanTag , conf.params)
                    .then((clanData) => {
                        // console.log('clanData' , clanData.tag , clanTag);
                        // call clan helper to updated clan data and return last inserted clan tag
                        clanHelpers.initClan(clanData, conf, schemas, '')
                        .then((urlPlay) => {
                            let data = {
                                urlPlay: urlPlay,
                                clanTag: clanTag,
                                key    :''
                            }
                            resolve(data);
                        }).catch((err)=>{console.log("tratiement clan  Error ",err.message)})
                    }).catch((err)=>{console.log("call api error clan  Error ",err.message)})
            })

    return promise;
}



var exports = module.exports = {
    getData,
    getSimpleClanData
};