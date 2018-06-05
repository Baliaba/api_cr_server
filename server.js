var
    express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    _ = require('lodash'),
    conf = require('./config/conf.js'),
    CronJob = require('cron').CronJob,
    loop = require('./actions/playActions'),
    schemas = require('./models/schemas.js');

job = new CronJob('*/1 * * * *', () => {
    loop.getData(conf, schemas,refresh="off"); 
    }, () => { /* CronJob every 60s seconds...*/
        console.log("Job stopped");
    },
    true,
    "Europe/Paris"
);
job.start();
