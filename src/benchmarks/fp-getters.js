'use strict';
const { get } = require('lodash');
const { get: fpGet } = require('lodash/fp');
const { users } = require('../fake-data');
const { prop, props } = require('ramda');
const S = require('sanctuary');
const L = require('partial.lenses');

const sets = users();

const getName = fpGet('name');
const makeGet = (prop) => (o) => o[prop];
const arrowGetName = makeGet('name');
const RgetName = prop('name');
const SgetName = S.prop('name');
const LgetName = L.get(L.prop('name'));

module.exports = (suite, benchmark) => {

    const nameAtRootBenchmark = (set) => () => {

        benchmark('Compiled lodash/FP get', () => {

            set.map(getName);
        });
        benchmark('Ramda prop', () => {

            set.map(RgetName);
        });
        benchmark('Sanctuary prop', () => {

            set.map(SgetName);
        });
        benchmark('Partial lenses', () => {

            set.map(LgetName);
        });
        benchmark('Inline lodash get', () => {

            set.map((usr) => get(usr, 'name'));
        });
        benchmark('Declared arrow function', () => {

            set.map(arrowGetName);
        });
        benchmark('Inline arrow function', () => {

            set.map((usr) => usr.name);
        });
        benchmark('Inline destructuring', () => {

            set.map(({ name }) => name);
        });
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



        benchmark('Compiled lodash/FP get', () => {

            set.map(_getBirthYear);
        });
        benchmark('Ramda props', () => {

            set.map(RgetBirthYear);
        });
        benchmark('Sanctuary props', () => {

            set.map(SgetBirthYear);
        });
        benchmark('Partial lenses', () => {

            set.map(LgetBirthYear);
        });
        benchmark('Inline lodash get', () => {

            set.map((usr) => get(usr, ['bio', 'birthday', 'year']));
        });
        /* benchmark('Declared arrow function', () => {
    
                set.map(arrowGetName);
            });
            benchmark('Inline arrow function', () => {
    
                set.map((usr) => usr.name);
            });
            benchmark('Inline destructuring', () => {
    
                set.map(({ name }) => name);
            }); */
    };

    suite(`Get name prop at root (${sets.bigSet.length} users)`, nameAtRootBenchmark(sets.bigSet));
    suite(`Get name prop at root (${sets.smallSet.length} users)`, nameAtRootBenchmark(sets.smallSet));
    suite(`Get deep prop (${sets.bigSet.length} users)`, DeepBio(sets.bigSet));
    suite(`Get deep prop (${sets.smallSet.length} users)`, DeepBio(sets.smallSet));
};