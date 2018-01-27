'use strict';

const { map, filter, comp, into, toFn } = require('transducers-js');
const { reduce } = require('lodash');

const push = (arr, x) => { arr.push(x); return arr; };

const inc = (n) => n + 1;
const isEven = (n) => n % 2 === 0;
const xf = comp(map(inc), filter(isEven));
const fnTransducer = toFn(xf, push); 

const bigSet = [];
let setSize = 1e5;

while (setSize){
    bigSet.push( Math.random() * 1000 );
    setSize--;
}

module.exports = (suite, benchmark) => {

    const makeBenchmarks = (set) => () => { 

        benchmark('Native filter and map', () => {

            set.map(inc).filter(isEven);
        });
        benchmark('Using transducers', () => {

            into([], xf, set);
        });
        benchmark('Using transducers combined with native', () => {

            set.reduce(fnTransducer, []); // native
        });
        benchmark('Using transducers combined with lodash', () => {

            reduce(set,fnTransducer, []); // native
        });
    };

    suite(`Big random array (${bigSet.length}), increasing and finding even numbers`, makeBenchmarks(bigSet));

    const mediumLength = bigSet.length / 2;
    suite(`Medium random array (${mediumLength}), increasing and finding even numbers`, makeBenchmarks(bigSet.slice(0,mediumLength)));

    const smallLength = mediumLength / 10;
    suite(`Small random array (${smallLength}), increasing and finding even numbers`, makeBenchmarks(bigSet.slice(0,smallLength)));

    const ssLength = smallLength / 10;
    suite(`Super small random array (${ssLength}), increasing and finding even numbers`, makeBenchmarks(bigSet.slice(0,ssLength)));
};
