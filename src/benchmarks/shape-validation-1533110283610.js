'use strict';
const Joi = require ('joi');
const { conforms, isNumber, isString } = require ('lodash');

const user = {
    name: 'Gordo'
    , surname: 'Fat'
    , sex: 'male'
    , email: 'you@me.com'
    , age: 22
};
module.exports = (suite, benchmark) => {
    
    suite(`Validating a simple object`, () => {

        benchmark(`Joi`, () => {

            Joi.object().keys({
                name: Joi.string(),
                surname: Joi.string(),
                sex: Joi.string(),
                email: Joi.string(),
                age: Joi.number()
            }).validate(user);
        });
        benchmark(`Lodash conforms`, () => {

            conforms({
                name: isString,
                surname: isString,
                sex: isString,
                email: isString,
                age: isNumber
            })(user);
        });

    });

};
