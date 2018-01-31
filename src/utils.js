'use strict';
const fs = require('fs');
const writeObj = (path, obj) => fs.writeFileSync(path, JSON.stringify(obj), 'utf8');
const push = (arr, val) => arr.push(val) && arr;
const tsDate = () => new Date().toISOString().split(/[-:T.]/).slice(0, -1).join('')

module.exports = {
    writeObj, push, tsDate
}