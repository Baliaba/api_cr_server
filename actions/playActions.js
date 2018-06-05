var qeueu = require('./../controllers/queueController.js');
var helpers = require('./../clanHelper/playHelper.js');
var callApi = require('./../services/callServices.js');
var clanAction = require('./../actions/clanActions.js');
var battleHelpers = require('./../clanHelper/battleHelper.js');

function getData(conf,schemas,refresh) {
    let apiTest = false;
     promise = new Promise((resolve,reject)=>{
    // get players url after updated clans dats
    clanAction.getData(conf, schemas)
    .then((obj) => {
        let playerPromise = callApi.callapi(obj.urlPlay+conf.freeOfBattlesCardsPath, conf.params);
        let battlePromise = callApi.callapi(obj.urlPlay+"/"+"battles"+conf.freeOfOpponent,conf.params);
        Promise.all([playerPromise,battlePromise])
        .then((responses)=>{
                let playerData = responses[0];
                let battleData = responses[1];
                //Traitements
                helpers.traitementPlayer(playerData, schemas).then((msg) => {
                    battleHelpers.TraitementBattle(battleData,conf,schemas,obj.clanTag)
                    .then((msg)=>{
                        if(refresh === "off"){
                            qeueu.removeQueue(conf,obj.key,obj.clanTag);
                        }else{
                            apiTest = true;
                            resolve(msg);
                        }
                      })
                })
        })
    })
})
if (apiTest){
    return promise;
}
}

var exports = module.exports = {
    getData 
};