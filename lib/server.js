import { rest } from 'msw';
import config from './config';
import { queryStringToParams } from './helpers';
import { setupServer } from 'msw/node';

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

const apiHandlers = Object.entries(config).map(([key, value]) => {
    const { params, filePath } = value;

    return rest.get(`*${key}`, async (req, res, ctx) => {
        const data = await import(/* webpackChunkName: "[request]" */ `${filePath}`);

        let isMatchFound = true;

        if (!params) {
            isMatchFound = matchQueryParams(req.url.search, params);
        }

        if (!isMatchFound) {
            return undefined;
        }

        return res(
            ctx.json(data),
            ctx.status(value.status)
        );
    });
});

export const handlers = setupServer(...apiHandlers);
