'use strict';
const { omit, sample } = require('lodash');
const { omit: omitFp } = require('lodash/fp');
const { users } = require('../fake-data');
const C = require('crocks');
const R = require('ramda');
const S = require('sanctuary');
const L = require('partial.lenses');

const sets = users();
const samplify = desc => x => console.log(desc, sample(x))

module.exports = (suite, benchmark) => {

    const omitName = (set) => () => {

        [
            ['lodash/FP', omitFp('name')],
            ['Ramda', R.omit(['name'])],
            ['Croks', C.omit(['name'])],
            ['Inlined lodash', (usr) => omit(usr, 'name')],
        ].map(
            ([description, fn]) => benchmark(description, () => set.map(fn))
        );
    };

    suite(`Omit name of (${sets.bigSet.length} users)`, omitName(sets.bigSet));
    suite(`Omit name of (${sets.smallSet.length} users)`, omitName(sets.smallSet));
};