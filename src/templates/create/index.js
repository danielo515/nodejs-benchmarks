'use strict';
const Ejs = require('ejs');
const Join = require('path').join;
const { readFile } = require('../../utils');
const createBenchTemplatePath = Join(__dirname, 'create.ejs');
const renderCreateBench = Ejs.compile(readFile(createBenchTemplatePath), { filename: createBenchTemplatePath });
const schema = JSON.stringify(require('./schema'));




module.exports = (data = {}) => renderCreateBench(Object.assign({ schema }, data))
