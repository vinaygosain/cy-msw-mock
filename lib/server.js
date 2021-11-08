const { rest } = require('msw');
const { queryStringToParams } = require('./helpers');
const { setupServer } = require('msw/node');
const path = require('path');

const matchQueryParams = (query, params) => {
    query = query.split('?')[1];
    const queryObj = queryStringToParams(query);
    const queryKeys = Object.keys(queryObj);
    const paramsKeys = Object.keys(params);

    if (queryKeys.length !== paramsKeys.length) {
        return false;
    }

    let isMatchFound = true;

    queryKeys.forEach(key => {
        if (queryObj[key] !== params[key]) {
            isMatchFound = false;
        }
    });
    return isMatchFound;
};

function ServerMock(config) {
    this.config = config;
}

ServerMock.prototype.init = function (overrideConfig) {
    const entries = Object.entries(overrideConfig || this.config).map(([key, value]) => {
        const { params, filePath, shouldNotMatchParams } = value;

        return rest.get(`*${key}`, async (req, res, ctx) => {
            const data = require(path.resolve(filePath));

            let isMatchFound = true;

            if (!shouldNotMatchParams && !params) {
                isMatchFound = matchQueryParams(req.url.search, params);
            }

            if (!isMatchFound) {
                return undefined;
            }

            return res(
                ctx.json(data),
                ctx.status(value.statusCode)
            );
        });
    });
    const server = setupServer(...entries);
    server.listen()
}

module.exports = ServerMock;
