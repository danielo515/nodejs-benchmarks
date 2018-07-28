'use strict';
const { get } = require('lodash');
const { get: fpGet } = require('lodash/fp');
const { users } = require('../fake-data');
const { prop, props } = require('ramda');
const R = require('ramda');
const S = require('sanctuary');
const L = require('partial.lenses');
const { samplify } = require('../utils');

const sets = users();

const getName = fpGet('name');
const makeGet = (prop) => (o) => o[prop];
const arrowGetName = makeGet('name');
const RgetName = prop('name');
const SgetName = S.prop('name');
const LgetName = L.get(L.prop('name'));
const RamdaLensName = R.view(R.lensPath(['name']));

module.exports = (suite, benchmark) => {

    const nameAtRootBenchmark = (set) => () => {

        [
            ['Compiled lodash/FP get', getName],
            ['Ramda prop', RgetName],
            ['Sanctuary prop', SgetName],
            ['Partial lenses', LgetName],
            ['Ramda lens', RamdaLensName],
            ['Inline lodash get', (usr) => get(usr, 'name')],
            ['Declared arrow function', arrowGetName],
            ['Inline arrow function', (usr) => usr.name],
            ['Inline destructuring', ({ name }) => name]
        ].map(
            ([description, fn]) => benchmark(description, () => /* samplify(description) */ (set.map(fn)))
        );
    };

    const DeepBio = (set) => () => {

        const RgetBirthYear = props(['bio', 'birthday', 'year']);
        const SgetBirthYear = S.props(['bio', 'birthday', 'year']);
        const _getBirthYear = fpGet(['bio', 'birthday', 'year']);
        const LgetBirthYear = L.get(L.compose(
            L.prop('bio'),
            L.prop('birthday'),
            L.prop('year')
        ));
        const RamdaLensBirthYear = R.view(R.lensPath(['bio', 'birthday', 'year']));

        const arrowGetBirthYear = it => ((it.bio || {}).birthday || {}).year;

        [
            ['Compiled lodash/FP get', _getBirthYear],
            ['Ramda props', RgetBirthYear],
            ['Sanctuary props', SgetBirthYear],
            ['Partial lenses', LgetBirthYear],
            ['Ramda lenses', RamdaLensBirthYear],
            ['Inline lodash get', (usr) => get(usr, ['bio', 'birthday', 'year'])],
            ['Declared arrow function', arrowGetBirthYear],
            ['Inline arrow function', it => ((it.bio || {}).birthday || {}).year],
            ['Inline destructuring', ({ bio: { birthday: { year } = {} } = {} } = {}) => year]
        ].map(
            ([description, fn]) => benchmark(description, () => set.map(fn))
        );
    };

    suite(`Get name prop at root (${sets.bigSet.length} users)`, nameAtRootBenchmark(sets.bigSet));
    suite(`Get name prop at root (${sets.smallSet.length} users)`, nameAtRootBenchmark(sets.smallSet));
    suite(`Get deep prop (${sets.bigSet.length} users)`, DeepBio(sets.bigSet));
    suite(`Get deep prop (${sets.smallSet.length} users)`, DeepBio(sets.smallSet));
};