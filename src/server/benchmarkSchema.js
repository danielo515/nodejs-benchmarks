'use strict';
const Joi = require('joi');
const str = Joi.string().trim();
const lowStr = str.lowercase();

const benchmark = Joi.object().keys({
    title: str.required(),
    body: Joi.string().required()
});
const dependency = Joi.object().keys({
    name: lowStr.required(),
    alias: str.optional(),
    destructuring: Joi.array().items(str).optional()
});

module.exports = Joi.object().keys({
    title: str,
    dependencies: Joi.array().items(dependency),
    preTest: Joi.string().optional(),
    suites: Joi.array().items(Joi.object().keys({
        title: str,
        benchmarks: Joi.array().items(benchmark)
    }))
});