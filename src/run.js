'use strict';
const recursive = require('recursive-readdir');
const { join: Join, basename } = require('path');
const fs = require('fs');
const { writeObj } = require('./utils');
const makePath = (...args) => Join(__dirname, ...args);
const inquirer = require('inquirer');
const { map } = require('lodash/fp');
const Runner = require('benchr');

const askForBenchmark = (files) => {

    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'toRun',
            message: 'Select which benchmarks you want to run',
            choices: files.map(it => ({
                value: it,
                name: basename(it)
            })),

            validate: answers => !!answers.length || 'You must select at least one benchmark'
        },
        {
            type: 'list',
            name: 'outputType',
            default: console,
            message: 'Which kind of report do you want ?',
            choices: ['json', 'console'],
            validate: answers => !!answers.length || 'You must select at least one benchmark'
        }
    ]);
};

const benchmarksDir = Join(__dirname, './benchmarks');


recursive(benchmarksDir, ['*.!(js)'])
    .then(askForBenchmark)
    .then(({ toRun, outputType }) => {

        const reporter = require(`benchr/lib/reporters/${outputType}`);
        const runOptions = { progress: true, reporter, verbose: false, maxTime: 5, minTime: 0, delay: 0 };
        // The json reporter uses console.log to report, so we just cheat here
        if (outputType === 'json') console.log = (format, stats) => writeObj(makePath('../reports/report.json'), stats);
        new Runner(runOptions, toRun).run();
    });
