'use strict';

const defaultMaker = () => Math.random() * 1000;

const generator = (maker = defaultMaker, setSize = 1e5) => {

    const bigSet = [];

    while (setSize) {
        bigSet.push(maker());
        setSize--;
    }

    return bigSet;
};

const { writeObj } = require('../utils');
const { makeUser } = require('./generators');
const generateUsers = () => {

    writeObj('users.json', generator(makeUser));
};

module.exports = {
    generator, generateUsers
};

generateUsers();