'use strict';

const Hapi = require('hapi');
const Routes = require('./routes');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

// Start the server
async function start() {

    try {
        await server.register(Routes);
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();