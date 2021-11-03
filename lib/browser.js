/* eslint-disable no-magic-numbers */
/* global cy */
import config from './config';

const apiHandlers = Object.entries(config).map(([key, value]) => {
    cy.intercept({
        method: value.verb || 'GET',
        query: value.query,
        url: key
    }, req => {
        req.reply({
            statusCode: value.statusCode || 200,
            fixture: value.filePath
        });
    });
});

export default apiHandlers;
