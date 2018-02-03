'use strict';
const { Linter } = require('eslint');
const { readFile } = require('../utils');
const linter = new Linter();
const { makeBenchmark, makeMain, makeSuite } = require('./templates');

const eslintConfig = JSON.parse(readFile(__dirname, '../../.eslintrc'));

module.exports = ({ suites, title }) => {

    const body = suites.map(({ title, benchmarks: benches }) => {

        const benchmarks = benches.map(makeBenchmark).join('');
        return makeSuite({ title, body: benchmarks })
    }).join('');

    const { fixed, messages, output } = linter.verifyAndFix(
        makeMain({ title, body }),
        eslintConfig
    );

    console.info('Linting report %j', { fixed, messages });
    return output;
};