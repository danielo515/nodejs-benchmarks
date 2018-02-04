'use strict';
const { startCase, assign } = require('lodash');
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

const stringSchema = (name, { format, i } = {}) => ({
    title: startCase(name),
    type: 'string',
    format,
    propertyOrder: i
});

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
            name: stringSchema('name', { i: 0 }),
            alias: stringSchema('alias', { i: 1 }),
            destructuring: arrayStringSchema('destructuring', { uniqueItems: true, i: 2, format: 'table' })
        }
    },
    { format: 'table' });

baseSchema.properties = assign(
    {},
    {
        dependencies: dependencySchema,
        suites: suiteSchema
    }
);

module.exports = baseSchema;