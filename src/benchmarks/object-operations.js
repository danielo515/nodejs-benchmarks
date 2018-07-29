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
            ['Ramda omit', R.omit(['name'])],
            ['Ramda dissoc', R.dissoc('name')],
            ['Partial lenses', L.remove('name')],
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
            ['Partial lenses', L.get(L.props('name', 'phone','bio'))],
            ['Ramda', R.pick(['name', 'phone','bio'])],
            ['Croks', C.pick(['name', 'phone','bio'])],
        ].map(
            ([description, fn]) => benchmark(description, () => /* samplify (description) */ (set.map(fn)))
        );
    };
    const pickNestedProps = (set) => () => {

        [
            ['lodash/FP', pickFp(['name','profile.email','meta.column', 'bio.birthday.year'])],
            ['Inlined lodash', (usr) => pick(usr, ['name','profile.email','meta.column', 'bio.birthday.year'])],
            ['Sanctuary ap', S.ap({'name':S.I, profile: S.ap({ email: S.I }), bio: S.ap({birthday: S.ap({year: S.I})})})],
            ['Object translate', Ot({'name':'name', profile: { email: 'profile.email'}, 'bio':{birthday: {year: 'bio.birthday.year'}}})],
            ['Partial lenses', L.get(L.pickIn({name: [], profile: {email: []}, bio: {birthday: {year: []}}}))],
        ].map(
            ([description, fn]) => benchmark(description, () => /* samplify (description) */ (set.map(fn)))
        );
    };
    const pickNestedToFlat = (set) => () => {

        [
            ['Sanctuary ap', S.ap({'name':S.I, profile: S.prop('email'), bio: S.props(['birthday','year'])})],
            ['Object translate', Ot({'name':'name', profile: 'profile.email', 'bio':'bio.birthday.year'})],
            ['Partial lenses', L.get(L.pick({name: 'name', profile: ['profile','email'], bio:['bio','birthday','year']}))],
        ].map(
            ([description, fn]) => benchmark(description, () => /* samplify (description) */ (set.map(fn)))
        );
    };

    suite(`Omit name (${sets.bigSet.length} users)`, omitName(sets.bigSet));
    suite(`Omit name (${sets.smallSet.length} users)`, omitName(sets.smallSet));
    suite(`Pick 3 root props (${sets.bigSet.length} users)`, pickProps(sets.bigSet));
    suite(`Pick 3 root props (${sets.smallSet.length} users)`, pickProps(sets.smallSet));
    suite(`Pick nested props same structure (${sets.bigSet.length} users)`, pickNestedProps(sets.bigSet));
    suite(`Pick nested props same structure (${sets.smallSet.length} users)`, pickNestedProps(sets.smallSet));
    suite(`Pick nested props to flat object (${sets.bigSet.length} users)`, pickNestedToFlat(sets.bigSet));
    suite(`Pick nested props to flat object (${sets.smallSet.length} users)`, pickNestedToFlat(sets.smallSet));
};