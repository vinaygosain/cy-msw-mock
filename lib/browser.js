/* eslint-disable no-magic-numbers */
/* global cy */

function browserMock(config) {
    this.config = config;

    this.init = function () {
        Object.entries(this.config).map(([key, value]) => {
            if (value.filePath.indexOf('cypress/fixtures') !== -1) {
                value.filePath = value.filePath.split('cypress/fixtures')[1]
            }
            cy.intercept({
                method: value.verb || 'GET',
                query: value.params,
                url: `${key}*`
            }, req => {
                req.reply({
                    statusCode: value.statusCode || 200,
                    fixture: value.filePath
                });
            });
        });
    }
}

module.exports = browserMock;
