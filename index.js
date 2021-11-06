/* global window */

const server = require('./lib/server');
const browser = require('./lib/browser');

let mockServer = browser;
if (typeof window === 'undefined') {
    mockServer = server;
}

module.exports = mockServer;