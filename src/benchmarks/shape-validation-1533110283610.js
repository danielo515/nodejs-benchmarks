'use strict';
const Joi = require ('joi');
const { conforms, isNumber, isString } = require ('lodash');
const R = require ('runtypes');
const t = require('io-ts');

const user = {
    name: 'Gordo'
    , surname: 'Fat'
    , sex: 'male'
    , email: 'you@me.com'
    , age: 22
};
module.exports = (suite, benchmark) => {
    
    suite(`Validating a simple object`, () => {

        const JoiSchema = 
            Joi.object().keys({
                name: Joi.string(),
                surname: Joi.string(),
                sex: Joi.string(),
                email: Joi.string(),
                age: Joi.number()
            });
        const lodashSchema = 
            conforms({
                name: isString,
                surname: isString,
                sex: isString,
                email: isString,
                age: isNumber
            });
        const runtypesSchema = 
            R.Record({
                name: R.String,
                surname: R.String,
                sex: R.String,
                email: R.String,
                age: R.Number
            });

        const ioSchema = 
            t.type({
                name: t.string,
                surname: t.string,
                sex: t.string,
                email: t.string,
                age: t.number
            });

        benchmark(`Joi`, () => {

            JoiSchema.validate(user);
        });
        benchmark(`Lodash conforms`, () => {

            lodashSchema(user);
        });
        benchmark(`Runtypes`, () => {

            runtypesSchema.check(user);
        });
        benchmark(`io-ts`, () => {

            ioSchema.decode(user);
        });

    });

};
