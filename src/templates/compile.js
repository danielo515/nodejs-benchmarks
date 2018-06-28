'use strict';
const Ejs = require('ejs');
const Os = require('os');
const path = require('path');
const { toPairs, nth, identity } = require('ramda');
const { capitalize } = require('lodash');
const { push, makeFileWriter, readFile } = require('../utils');
const writeStr = makeFileWriter(__dirname);
const templatePath = path.join(__dirname, 'dashboard.ejs');
const idxTemplatePath = path.join(__dirname, 'index.ejs');
const renderDashboard = Ejs.compile(readFile(templatePath), { filename: templatePath });
const renderIndex = Ejs.compile(readFile(idxTemplatePath), { filename: idxTemplatePath });
const renderCreateBench = require('./create');
let data, _data;
try {
    _data = readFile('../../reports/report');
    data = JSON.parse(_data);
} catch (err) {
    console.error('You throw bad json at me!!!', _data.slice(0, 200));
    process.exit(1);
}
// const PKG = require('../../package');

const combineTuple = (fna, fnb) => ([a, b]) => [fna(a), fnb(b)];
const capitalizeTuple = combineTuple(capitalize, identity);

const { platform: _platform, platform: { os } } = data;
delete _platform.os;
Object.assign(_platform,
    {
        cpu: Os.cpus()[0].model,
        'n. of cpus': Os.cpus().length,
        memory: (Os.totalmem() / 1000000000).toFixed(2) + ' GB',
        timestamp: data.ended
    },
    os);
const platform = toPairs(_platform).filter(nth(1)).map(capitalizeTuple);

const makeIndex = (reports) => {

    writeStr(
        renderIndex({ reports })
        , '../../reports'
        , 'index.html'
    );
};

const reports = data.files.reduce(
    (reports, data) => push(reports, { markup: renderDashboard({ data, platform }), name: path.basename(data.name).replace(/\.\w+$/, '') })
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
