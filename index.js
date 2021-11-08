/* global window */

const ServerMock = require('./lib/server');
const BrowserMock = require('./lib/browser');


function mockServer(config) {
    let browserMockInstance = null;
    let serverMockInstance = null;
    return {
        init: function () {
            if (typeof window === 'undefined') {
                if (!serverMockInstance) {
                    serverMockInstance = new ServerMock(config);
                }
                serverMockInstance.init();

                return serverMockInstance;
            }

            if (!browserMockInstance) {
                browserMockInstance = new BrowserMock(config);
            }
            browserMockInstance.init();
            return browserMockInstance;
        },
        override: function (overrideConfig) {
            if (browserMockInstance) {
                browserMockInstance.init(overrideConfig);
            }

            if (serverMockInstance) {
                serverMockInstance.init(overrideConfig);
            }
        }
    }
}

module.exports = mockServer;