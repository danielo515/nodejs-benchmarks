'use strict';
const { startCase, assign } = require('lodash');
const { dependencies } = require('../../../package');

const baseSchema = {
    title: 'New Benchmark',
    type: 'object',
    no_additional_properties: true,
    properties: {}
};

const makeSchema = (schema, offset = 0) =>

    (final, name, i) =>

        assign(
            final,
            { [name]: schema(name, i + offset) }
        );

const basicSchema = (name, opts) => assign
    (
    { title: startCase(name) },
    opts
    );

const stringSchema = (name, opts = {}) => assign(
    basicSchema(name, opts),
    { type: 'string' }
);

const numberSchema = (name, i) => ({
    title: startCase(name),
    type: 'number',
    format: 'number',
    propertyOrder: i
});

const objectSchema = (name, properties) => ({
    title: startCase(name),
    type: 'object',
    properties
});

const arraySchema = (name, items, { format, uniqueItems = true, i } = {}) => (
    {
        title: startCase(name),
        type: 'array',
        [i && 'propertyOrder']: i,
        [format && 'format']: format,
        uniqueItems,
        items
    });

const arrayStringSchema = (name, ...args) => arraySchema(name, { type: 'string' }, ...args);

const enumSchema = (name, values) => stringSchema(name, { enum: values });

const benchSchema = objectSchema('benchmark', {
    title: stringSchema('title'),
    body: stringSchema('body', { format: 'javascript' })
});

const suiteSchema = arraySchema('suites', {
    type: 'object',
    title: 'Suite',
    properties: {
        title: stringSchema('title'),
        benchmarks: arraySchema('benchmarks', benchSchema, false)
    }
});

const dependencySchema = arraySchema('dependencies',
    {
        type: 'object',
        properties: {
            name: enumSchema('name', Object.keys(dependencies), { propertyOrder: 1 }),
            alias: stringSchema('alias', { propertyOrder: 2 }),
            destructuring: arrayStringSchema('destructuring', { uniqueItems: true, i: 3 })
        }
    },
    { format: 'table' });

baseSchema.properties = assign(
    {},
    {
        title: stringSchema('name'),
        description: stringSchema('what is this about'),
        dependencies: dependencySchema,
        preTest: stringSchema('pre-test', { format: 'javascript' }),
        suites: suiteSchema
    }
);

module.exports = baseSchema;