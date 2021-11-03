const safelyDecodeURIComponent = value => {
    let decodedValue;

    if (value && value.replace) {
        value = value.replace(/\+/g, ' ');
    }

    try {
        decodedValue = decodeURIComponent(value);
    }
    catch (error) {
        decodedValue = value;
    }

    return decodedValue;
};

const queryStringToParams = queryString => {
    const response = {};
    const decodedQS = decodeURI(queryString).split('&');

    forEach(decodedQS, param => {
        const [paramKey, paramValue] = param.split('=');

        try {
            response[paramKey] = JSON.parse(paramValue);
        }
        catch (e) {
            response[paramKey] = safelyDecodeURIComponent(paramValue);
        }
    });

    return response;
};