'use strict';

const Faker = require('faker');

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

module.exports = {
    makeUser
};