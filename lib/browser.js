/* eslint-disable no-magic-numbers */
/* global cy */

function browserMock(config) {
    this.config = config;
}

browserMock.prototype.init = function (overrideConfig) {
    Object.entries(overrideConfig || this.config).map(([key, value]) => {
        if (value.filePath.indexOf('cypress/fixtures') !== -1) {
            value.filePath = value.filePath.split('cypress/fixtures')[1]
        }

        cy.intercept({
            method: value.verb || 'GET',
            query: value.params,
            url: `${key}*`,
            middleware: overrideConfig ? true : false
        }, req => {
            req.reply({
                statusCode: value.statusCode || 200,
                fixture: value.filePath
            });
        });
    });
}


module.exports = browserMock;
