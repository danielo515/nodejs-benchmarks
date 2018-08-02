'use strict';
const renderCreateBenchmark = require('../templates/create');
const createBenchMarkSrc = require('../createBenchmark');
const payload = require('./benchmarkSchema');
const { createFile } = require('./github');
const { constant } = require('lodash');

const register = async (server, options) => {

    const routes = [
        {
            method: 'GET',
            path: '/create',
            handler: function (request, h) {

                return renderCreateBenchmark();
            }
        }, {
            method: 'POST',
            path: '/create',
            options: {
                validate: {
                    payload,
                    failAction: async (request, h, err) => {
                        console.error(err);
                        throw err;
                    }
                }
            },
            handler: function ({ payload }, h) {

                const { title, name, email } = payload;
                const src = createBenchMarkSrc(payload);
                return createFile({ content: src, name: title, author: { name, email } })
                    .then(constant({ src }))
                    .catch(err => {
                        console.error('Failed creating the file', err);
                        throw err;
                    });
            }
        }
    ];

    // routes.map(r => server.route(r));
    server.route(routes);
};


module.exports = {
    register,
    name: 'routes',
    version: '1.0.1'
};
