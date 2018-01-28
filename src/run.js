'use strict';
const recursive = require('recursive-readdir');
const Join = require('path').join;
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
        }
    ])
}

const benchmarksDir = Join(__dirname, './benchmarks');
const runOptions = { '--delay': '0', '--max-time': '5', '--min-time': '0'};

recursive(benchmarksDir, ['*.!(js)'])
    .then(askForBenchmark)
    .then(({ toRun }) => {
        
        new Runner(runOptions,toRun).run();
    });
