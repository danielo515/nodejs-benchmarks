'use strict';
const { get } = require('lodash');
const { get: fpGet } = require('lodash/fp');
const { users } = require('../fake-data');
const { prop } = require('ramda');
const L = require('partial.lenses');

const sets = users();

const getName = fpGet('name');
const makeGet = (prop) => (o) => o[prop];
const arrowGetName = makeGet('name');
const RgetName = prop('name');
const LgetName = L.get(L.prop('name'));

module.exports = (suite, benchmark) => {

    const makeBenchmarks = (set) => () => {

        benchmark('Compiled lodash/FP get', () => {

            set.map(getName);
        });
        benchmark('Ramda prop', () => {

            set.map(RgetName);
        });
        benchmark('Partial lenses', () => {

            set.map(LgetName);
        });
        benchmark('Compiled arrow function get', () => {

            set.map(arrowGetName);
        });
        benchmark('Normal lodash get', () => {

            set.map((usr) => get(usr, 'name'));
        });
        benchmark('Inline function', () => {

            set.map((usr) => usr.name);
        });
        benchmark('Inline destructuring', () => {

            set.map(({ name }) => name);
        });
    };

    suite(`Get name prop at root (${sets.bigSet.length} users)`, makeBenchmarks(sets.bigSet));
    suite(`Get name prop at root ((${sets.smallSet.length} users)`, makeBenchmarks(sets.smallSet));
};