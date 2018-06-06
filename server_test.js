var
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http'),
    _ = require('lodash'),
    conf = require('./config/conf.js'),
    CronJob = require('cron').CronJob,
    router = require('./router/router.js'),
    loop = require('./actions/playActions'),
    schemas = require('./models/schemas.js');
    queue = require('./services/queueService.js');
job = new CronJob('*/1 * * * *', () => {
        loop.getData(conf, schemas,refresh=false);
    }, () => { /* CronJob every 2 seconds...*/
        console.log("Job stopped");
    },
    true,
    "Europe/Paris"
);

//loop.getData(conf, schemas,refresh=true,"88CC09J");
app.use('/api', router.router);
app.listen(conf.PORT);
//job.start();