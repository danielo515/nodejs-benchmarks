'use strict';
const { get } = require('lodash');
const { get: fpGet } = require('lodash/fp');
const { users } = require('../fake-data');

const sets = users();

const getName = fpGet('name');
const makeGet = (prop) => (o) => o[prop];
const arrowGetName = makeGet('name');

module.exports = (suite, benchmark) => {

    const makeBenchmarks = (set) => () => {

        benchmark('Compiled lodash/FP get', () => {

            set.map(getName);
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

    suite(`Big array of users (${sets.bigSet.length})`, makeBenchmarks(sets.bigSet));
    suite(`Medium array of users (${sets.smallSet.length})`, makeBenchmarks(sets.smallSet));
};