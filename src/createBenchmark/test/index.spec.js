'use strict';
const Lab = require('lab');
const Util = require('util');
const Fs = require('fs');
const Join = require('path').join;
const readFile = Util.promisify(Fs.readFile);
const writeFile = Util.promisify(Fs.writeFile);

// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
const expect = lab.expect;

const makeBenchFile = require('../index');

describe('Full file creation', () => {

    it('Create a simple file with one set of benchmarks and one suite', async () => {

        const description = { title: 'test file', suites: [{ title: 'My first test suite', benchmarks: [{ title: 'Testing the console', body: 'console.log("anus");' }] }] }
        const benchFileText = makeBenchFile(description);
        const expected = await readFile(Join(__dirname, './expectedFile'), 'utf8');
        expect(benchFileText).to.equal(expected);
    });

    it('Create more complex file with a set of benchmarks and one suite', async () => {

        const code = `const sum = (x, y) => x + y;
        const result = [1, 2, 3, 4, 5].reduce(sum);
        console.log(result);`;
        const description = { title: 'test file', suites: [{ title: 'My second test suite', benchmarks: [{ title: 'Testing basic math', body: code }] }] }
        const benchFileText = makeBenchFile(description);
        const expected = await readFile(Join(__dirname, './expectedFileComplex'), 'utf8');
        expect(benchFileText).to.equal(expected);
    });

    it('Create file with one dependency', async () => {

        const code = `const sum = (x, y) => x + y;
        const result = [1, 2, 3, 4, 5].reduce(sum);
        console.log(result);`;
        const description = {
            title: 'test file',
            dependencies: ['lodash'],
            suites: [{ title: 'My second test suite', benchmarks: [{ title: 'Testing basic math', body: code }] }]
        };
        const benchFileText = makeBenchFile(description);
        const expected = await readFile(Join(__dirname, './oneDep'), 'utf8');
        // await writeFile('testFour', benchFileText, 'utf8');
        expect(benchFileText).to.equal(expected);
    });

    it('Create file with several dependencies', async () => {

        const code = `const sum = (x, y) => x + y;
        const result = [1, 2, 3, 4, 5].reduce(sum);
        console.log(result);`;
        const description = {
            title: 'test file',
            dependencies: ['lodash', 'ramda', 'transducers-js'],
            suites: [{ title: 'My second test suite', benchmarks: [{ title: 'Testing basic math', body: code }] }]
        };
        const benchFileText = makeBenchFile(description);
        const expected = await readFile(Join(__dirname, './manyDeps'), 'utf8');
        await writeFile('testFour', benchFileText, 'utf8');
        expect(benchFileText).to.equal(expected);
    });

    it('Create longer file with a set of benchmarks and suites', async () => {

        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const sArr = arr.slice(0, 5);
        const makeCode = (funName, operator, arr) => `const ${funName} = (x, y) => x ${operator} y;
        const result = [${arr.join(', ')}].reduce(${funName});
        console.log(result);`;
        const description = {
            title: 'test file',
            suites: [
                {
                    title: 'Math reduction with 5 numbers', benchmarks: [
                        { title: 'Testing addition', body: makeCode('sum', '+', sArr) },
                        { title: 'Testing division', body: makeCode('div', '/', sArr) },
                        { title: 'Testing mult', body: makeCode('mult', '*', sArr) },
                    ]
                },
                {
                    title: 'Math reduction with 10 numbers', benchmarks: [
                        { title: 'Testing addition', body: makeCode('sum', '+', arr) },
                        { title: 'Testing division', body: makeCode('div', '/', arr) },
                        { title: 'Testing mult', body: makeCode('mult', '*', arr) },
                    ]
                }
            ]
        }
        const benchFileText = makeBenchFile(description);
        const expected = await readFile(Join(__dirname, './expectedFileLong'), 'utf8');
        // await writeFile('testFour', benchFileText, 'utf8');
        expect(benchFileText).to.equal(expected);
    });

});