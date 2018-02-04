'use strict';
const Joi = require('joi');
const renderCreateBenchmark = require('../templates/create');
const createBenchMarkSrc = require('../createBenchmark');


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
            handler: function (request, h) {

                const src = createBenchMarkSrc(JSON.parse(request.payload));
                console.log(src);
                return { src }
            }
        }];

    // routes.map(r => server.route(r));
    server.route(routes);
};


module.exports = {
    register,
    name: 'routes',
    version: '1.0.1'
};
