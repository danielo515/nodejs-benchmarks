'use strict';
const recursive = require('recursive-readdir');
const Join = require('path').join;
const inquirer = require('inquirer');
const {map} = require('lodash/fp');
const Runner = require('benchr/lib/runner.js')

const askForBenchmark = (files)=> {

    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'toRun',
            message: 'Select which benchmarks you want to run',
            choices: files,
        }
    ])
}

const benchmarksDir = Join(__dirname,'./benchmarks')

recursive(benchmarksDir,['*.!(js)'])
.then(askForBenchmark)
.then( ({toRun}) => {
    const spawn = require('child_process').spawn;
    const touch1 = spawn('npm', ['run', 'bench', '--', ...toRun ], { stdio: 'inherit' });
})
