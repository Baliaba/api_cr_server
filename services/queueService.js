var getQueue = (firebase) => {
    console.log("Debut de traitement " + Date.now());
    var promise = new Promise(
        function (resolve, reject) {
            /* Tour de passe passe passe magic !  Mdr...*/
            const DBqueue = firebase.ref('queue').limitToFirst(1);
            return DBqueue.once('value')
                .then(function (snapshot) {
                    var key = Object.keys(snapshot.val())[0];
                    console.log(key);
                    var dataKey = snapshot.val()[key];
                    var obj = {
                        _dataKey: dataKey,
                        _key: key
                    }
                    resolve(obj);
                })
                .catch(e => {
                    console.log('Aucun utilisateur trouvé')
                })
        });
    return promise;
}

var addQueue = (conf, clanTag) => {
    var promise = new Promise((resolve, reject) => {
        conf.database.ref('queue').push({
            clan : clanTag
        }).then(() => {
            console.log("Fin de traitement " +  Date.now());
            resolve('ok');
        }).catch((err) => {
            console.log(err)
        })
    })
    return promise;
}
function queueStaff(conf, key,clanTag){
    conf.database.ref('queue').orderByChild('clan').equalTo(clanTag).once("value")
    .then((snapshots)=>{
            Object.keys(snapshots.val()).forEach((key)=>{
                conf.database.ref('queue').child(key).remove();
            }) 
            //add
            addQueue(conf,clanTag);
        });
}
var removeQueue = async (conf, key,clanTag) => {
    await queueStaff(conf,key,clanTag);
    conf.database.ref('history/'+clanTag).set({
        maj: Date.now()
    })
}
var exports = module.exports = {
    getQueue,
    addQueue,
    removeQueue
};