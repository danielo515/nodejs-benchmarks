'use strict';
const Lab = require('lab');

// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
const expect = lab.expect;

const { makeBenchmark, makeSuite, makeMain } = require('./templates');

describe('Basic template sections', () => {

    it('Create benchmark', () => {

        const expected = `benchmark(\`This benchmark is supa\`, () => {

    console.log('duuude')
});`

        const benchmark = makeBenchmark({
            title: 'This benchmark is supa', body: `console.log('duuude')`
        })
        expect(benchmark.trim()).to.equal(expected);
    });
})