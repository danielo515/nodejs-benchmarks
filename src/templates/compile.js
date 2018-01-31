'use strict';
const Ejs = require('ejs');
const data = require('../../reports/report');
const path = require('path');
const fs = require('fs');
const push = (arr, val) => arr.push(val) && arr;
const templatePath = path.join(__dirname, 'dashboard.ejs');
const renderDashboard = Ejs.compile(fs.readFileSync(templatePath, 'utf8'), { filename: templatePath });

data.reduce(
    (reports, data) => push(reports, { markup: renderDashboard({ data }), filename: path.basename(data.name).replace(/\.\w+$/, '') })
    , [])
    .forEach((dashBoard) => fs.writeFileSync(path.join(__dirname, '../../reports', dashBoard.filename + '.html'), dashBoard.markup, 'utf8'));
