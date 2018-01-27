'use strict';
const { get } = require('lodash');
const { get:fpGet } = require('lodash/fp');
const Faker = require('faker');
const makeSet = require('../makeSet');

const makeUser = () => ({ 
    name: Faker.name.firstName(),
    phone: Faker.phone.phoneNumber(),
    profile: {
        email: Faker.internet.email(),
        avatar: Faker.internet.avatar()
    },
    meta: {
        column: Faker.database.column(),
        type: Faker.database.type()
    }
});

const sets = makeSet(makeUser);

const getName = fpGet('name');
const makeGet = (prop) => (o)=> o[prop]
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

            set.map((usr) => get(usr,'name'));
        });
        benchmark('Inline function', () => {

            set.map((usr)=> usr.name);
        });
        benchmark('Inline destructuring', () => {

            set.map(({name}) => name);
        });
    };

    suite(`Big array of users (${sets.bigSet.length})`, makeBenchmarks(sets.bigSet));
    suite(`Medium array of users (${sets.smallSet.length})`, makeBenchmarks(sets.smallSet));
};