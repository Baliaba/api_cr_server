var qeueu = require('./../controllers/queueController.js');
var helpers = require('./../clanHelper/playHelper.js');
var callApi = require('./../services/callServices.js');
var clanAction = require('./../actions/clanActions.js');
var battleHelpers = require('./../clanHelper/battleHelper.js');

function getData(conf, schemas) {
    // get players url after updated clans dats
    clanAction.getData(conf, schemas)
    .then((obj) => {
        callApi.callapi(obj.urlPlay+conf.freeOfBattlesCardsPath, conf.params)
            .then((playerData) => {
                helpers.traitementPlayer(playerData, schemas).then((msg) => {
                   // console.log(conf.url_clan+obj.clanTag+"/battles?type=all");
                    callApi.callapi(obj.urlPlay+"/"+"battles"+conf.freeOfOpponent,conf.params)
                    .then((battleData) => {
                       battleHelpers.TraitementBattle(battleData,conf,schemas,obj.clanTag)
                       .then((msg)=>{
                          // console.log(msg);
                           qeueu.removeQueue(conf,obj.key,obj.clanTag);
                        })
                        //.catch((err)=>{console.log("tratement battle Data Error",err.message)})                       
                    }).catch((err)=>{console.log("call api fetch battle",err.message)})
                })
                //.catch((err)=>{console.log("tratement player Data Error",err.message)})    
            }).catch((err)=>{console.log("call api fetch players  Error ",err.message)})

    }).catch((err)=>{console.log("tratiement clan  Error ",err.message)})
}


function getSimplePlayData(conf, schemas, clanTag) {
    let promise = new Promise((resolve, reject) => {
        // get players url after updated clans dats
        clanAction.getSimpleClanData(conf, schemas, clanTag).then((obj) => {
            callApi.callapi(obj.urlPlay + conf.freeOfBattlesCardsPath, conf.params)
            .then((playerData) => {
                helpers.traitementPlayer(playerData, schemas).then((msg) => {
                   // console.log(msg);
                   callApi.callapi(obj.urlPlay+"/"+"battles"+conf.freeOfOpponent,conf.params)
                        .then((battleData) => {
                            battleHelpers.TraitementBattle(battleData, conf, schemas,obj.clanTag).then((msg) => {
                              //  console.log(msg);
                                resolve(msg);
                            })
                            //.catch((err)=>{console.log("tratement battle Data Error",err.message)})   
                        }).catch((err)=>{console.log("call api battle",err.message)})
                }).catch((err)=>{console.log("tratement player Data Error",err.message)})    
            }).catch((err)=>{console.log("call api players  Error ",err.message)})

        }).catch((err)=>{console.log("tratiement clan  Error ",err.message)})
    })
    return promise;
}

var exports = module.exports = {
    getData , 
    getSimplePlayData
};