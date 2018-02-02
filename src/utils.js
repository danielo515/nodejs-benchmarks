'use strict';
const fs = require('fs');
const { join } = require('path');
const writeObj = (path, obj) => fs.writeFileSync(path, JSON.stringify(obj), 'utf8');
const push = (arr, val) => arr.push(val) && arr;
const tsDate = () => new Date().toISOString().split(/[-:T.]/).slice(0, -1).join('')
const makeFileWriter = (basePath) => (str, ...restPath) => fs.writeFileSync(join(basePath, ...restPath), str, 'utf8')

module.exports = {
    writeObj, push, tsDate, makeFileWriter
}