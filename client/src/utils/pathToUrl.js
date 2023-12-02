export const pathToUrl = (path, params) => {
    const url = Object.keys(params).reduce((result, param) => {
        console.log(params[param])
        return result.replace(`:${param}`, params[param]);
    }, path);

    return url;
};
