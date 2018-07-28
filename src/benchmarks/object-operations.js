'use strict';
const { omit, sample, pick } = require('lodash');
const { omit: omitFp, pick: pickFp } = require('lodash/fp');
const { users } = require('../fake-data');
const C = require('crocks');
const R = require('ramda');
const S = require('sanctuary').unchecked;
const Ot = require('object-translate');
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
    const pickProps = (set) => () => {

        [
            ['lodash/FP', pickFp(['name', 'phone','bio'])],
            ['Inlined lodash', (usr) => pick(usr, ['name', 'phone','bio'])],
            ['Sanctuary ap', S.ap({'name':S.I, 'phone':S.I,'bio':S.I})],
            ['Object translate', Ot({'name':'name', 'phone':'phone','bio':'bio'})],
            ['Ramda', R.pick(['name', 'phone','bio'])],
            ['Croks', C.pick(['name', 'phone','bio'])],
        ].map(
            ([description, fn]) => benchmark(description, () => /* samplify (description) */ (set.map(fn)))
        );
    };

    suite(`Omit name of (${sets.bigSet.length} users)`, omitName(sets.bigSet));
    suite(`Omit name of (${sets.smallSet.length} users)`, omitName(sets.smallSet));
    suite(`Pick 3 props of (${sets.bigSet.length} users into a new obj)`, pickProps(sets.bigSet));
    suite(`Pick 3 props of (${sets.smallSet.length} users into a new obj)`, pickProps(sets.smallSet));
};