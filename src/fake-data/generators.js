'use strict';

const Faker = require('faker');
const { random } = require('lodash');

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
    },
    bio: {
        birthday: {
            year: random(1900, 2018),
            day: random(1, 31)
        }
    }
});

module.exports = {
    makeUser
};