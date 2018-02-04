'use strict';
const Ejs = require('ejs');
const data = require('../../reports/report');
const path = require('path');
const { push, makeFileWriter, readFile } = require('../utils');
const writeStr = makeFileWriter(__dirname);
const templatePath = path.join(__dirname, 'dashboard.ejs');
const idxTemplatePath = path.join(__dirname, 'index.ejs');
const renderDashboard = Ejs.compile(readFile(templatePath), { filename: templatePath });
const renderIndex = Ejs.compile(readFile(idxTemplatePath), { filename: idxTemplatePath });
const renderCreateBench = require('./create');
// const PKG = require('../../package');


const makeIndex = (reports) => {

    writeStr(
        renderIndex({ reports })
        , '../../reports'
        , 'index.html'
    );
};

const reports = data.files.reduce(
    (reports, data) => push(reports, { markup: renderDashboard({ data }), name: path.basename(data.name).replace(/\.\w+$/, '') })
    , [])
    .map(({ name, markup }) => {

        const fileName = name + '.html';
        writeStr(markup, '../../reports', fileName);
        return { fileName, name };
    });

writeStr(
    renderCreateBench()
    , '../../reports'
    , 'create.html'
);
makeIndex(reports);
