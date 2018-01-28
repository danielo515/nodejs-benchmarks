'use strict';
const Ejs = require('ejs');
const data = require('../../reports/example');
const path = require('path');
const fs = require('fs');

Ejs.renderFile(path.join(__dirname, 'dashboard.ejs'), {data: data[0]}, {}, function(err, str){
    if(err){
        return console.error(err);
    }

    fs.writeFileSync(path.join(__dirname,'../../reports','report.html'),str,'utf8');
});