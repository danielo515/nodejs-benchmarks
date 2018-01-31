'use strict';
const recursive = require('recursive-readdir');
const Join = require('path').join;
const fs = require('fs');
const { writeObj } = require('./utils');
const makePath = (...args) => Join(__dirname, ...args);
const inquirer = require('inquirer');
const { map } = require('lodash/fp');
const Runner = require('benchr/lib/runner.js')

const askForBenchmark = (files) => {

    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'toRun',
            message: 'Select which benchmarks you want to run',
            choices: files,
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
    ])
}

const benchmarksDir = Join(__dirname, './benchmarks');


recursive(benchmarksDir, ['*.!(js)'])
    .then(askForBenchmark)
    .then(({ toRun, outputType }) => {

        const runOptions = { '--delay': '0', '--max-time': '5', '--min-time': '0', '--reporter': outputType, '--verbose': true };
        // The json reporter uses console.log to report, so we just cheat here
        if (outputType === 'json') console.log = (format, stats) => writeObj(makePath('../reports/report.json'), stats);
        new Runner(runOptions, toRun).run();
    });
