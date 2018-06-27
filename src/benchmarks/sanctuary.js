'use strict';

const { create, env } = require('sanctuary');
const { users } = require('../fake-data');

const sets = users();

const S = create({ checkTypes: false, env }); // Normal sanctuary
const SS = create({ checkTypes: true, env }); // Safe sanctuary


const getName = S.prop('name');
const sGetName = SS.prop('name');

const getAvatar = S.props(['profile', 'avatar']);
const sGetAvatar = SS.props(['profile', 'avatar']);

module.exports = (suite, benchmark) => {

    const propGetBench = (set) => () => {

        benchmark('Type safe get-name', () => {

            SS.map(sGetName)(set);
        });
        benchmark('Normal get-name', () => {

            S.map(getName)(set);
        });
    };

    const deepGetBench = (set) => () => {

        benchmark('Deep type safe prop get', () => {

            SS.map(sGetAvatar)(set);
        });
        benchmark('Deep NON-type safe prop get', () => {

            S.map(getAvatar)(set);
        });
    };

    // // suite(`S.map Medium array of users (${sets.mediumSet.length}): Plain get`, propGetBench(sets.mediumSet));
    suite(`S.map medium array of users (${sets.xSmallSet.length}): Plain get`, propGetBench(sets.xSmallSet));
    // // suite(`S.map Medium array of users (${sets.mediumSet.length}): Deep get`, deepGetBench(sets.mediumSet));
    suite(`S.map medium array of users (${sets.xSmallSet.length}): Deep get`, deepGetBench(sets.xSmallSet));
};