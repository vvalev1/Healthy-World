(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
    typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError'; 
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError'; 
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError'; 
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError'; 
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError'; 
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError'; 
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;


    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: logout does not return a result
                // in this case the content type header should be omitted, to allow checks on the client
                if (result !== undefined) {
                    result = JSON.stringify(result);
                } else {
                    status = 204;
                    delete headers['Content-Type'];
                }
            }
        };
    }



    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register PATCH action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        patch(name, handler) {
            this.registerAction('PATCH', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;


    const data = fs__default['default'].existsSync('./data') ? fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {}) : {};

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens.slice(0, -1)) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined && responseData[tokens.slice(-1)] !== undefined) {
                responseData[tokens.slice(-1)] = body;
            }
            return responseData[tokens.slice(-1)];
        },
        patch: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.patch(':collection', actions.patch);
    dataService.delete(':collection', actions.delete);


    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { AuthorizationError: AuthorizationError$1 } = errors;



    const userService = new Service_1();

    userService.get('me', getSelf);
    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);


    function getSelf(context, tokens, query, body) {
        if (context.user) {
            const result = Object.assign({}, context.user);
            delete result.hashedPassword;
            return result;
        } else {
            throw new AuthorizationError$1();
        }
    }

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } = errors;


    var crud = {
        get,
        post,
        put,
        patch,
        delete: del
    };


    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }


    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first to last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }
    		
    		if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        context.canAccess(responseData);

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }
        context.canAccess(undefined, body);

        body._ownerId = context.user._id;
        let responseData;

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function patch(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.merge(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing);

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    /*
     * This service requires storage and auth plugins
     */

    const dataService$1 = new Service_1();
    dataService$1.get(':collection', crud.get);
    dataService$1.post(':collection', crud.post);
    dataService$1.put(':collection', crud.put);
    dataService$1.patch(':collection', crud.patch);
    dataService$1.delete(':collection', crud.delete);

    var data$1 = dataService$1.parseRequest;

    const imgdata = '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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>SUPS Admin Panel</title>\n    <style>\n        * {\n            padding: 0;\n            margin: 0;\n        }\n\n        body {\n            padding: 32px;\n            font-size: 16px;\n        }\n\n        .layout::after {\n            content: '';\n            clear: both;\n            display: table;\n        }\n\n        .col {\n            display: block;\n            float: left;\n        }\n\n        p {\n            padding: 8px 16px;\n        }\n\n        table {\n            border-collapse: collapse;\n        }\n\n        caption {\n            font-size: 120%;\n            text-align: left;\n            padding: 4px 8px;\n            font-weight: bold;\n            background-color: #ddd;\n        }\n\n        table, tr, th, td {\n            border: 1px solid #ddd;\n        }\n\n        th, td {\n            padding: 4px 8px;\n        }\n\n        ul {\n            list-style: none;\n        }\n\n        .collection-list a {\n            display: block;\n            width: 120px;\n            padding: 4px 8px;\n            text-decoration: none;\n            color: black;\n            background-color: #ccc;\n        }\n        .collection-list a:hover {\n            background-color: #ddd;\n        }\n        .collection-list a:visited {\n            color: black;\n        }\n    </style>\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html@1.3.0?module';\nimport { until } from 'https://unpkg.com/lit-html@1.3.0/directives/until?module';\n\nconst api = {\n    async get(url) {\n        return json(url);\n    },\n    async post(url, body) {\n        return json(url, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(body)\n        });\n    }\n};\n\nasync function json(url, options) {\n    return await (await fetch('/' + url, options)).json();\n}\n\nasync function getCollections() {\n    return api.get('data');\n}\n\nasync function getRecords(collection) {\n    return api.get('data/' + collection);\n}\n\nasync function getThrottling() {\n    return api.get('util/throttle');\n}\n\nasync function setThrottling(throttle) {\n    return api.post('util', { throttle });\n}\n\nasync function collectionList(onSelect) {\n    const collections = await getCollections();\n\n    return html`\n    <ul class=\"collection-list\">\n        ${collections.map(collectionLi)}\n    </ul>`;\n\n    function collectionLi(name) {\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\n    }\n}\n\nasync function recordTable(collectionName) {\n    const records = await getRecords(collectionName);\n    const layout = getLayout(records);\n\n    return html`\n    <table>\n        <caption>${collectionName}</caption>\n        <thead>\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\n        </thead>\n        <tbody>\n            ${records.map(r => recordRow(r, layout))}\n        </tbody>\n    </table>`;\n}\n\nfunction getLayout(records) {\n    const result = new Set(['_id']);\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\n\n    return [...result.keys()];\n}\n\nfunction recordRow(record, layout) {\n    return html`\n    <tr>\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\n    </tr>`;\n}\n\nasync function throttlePanel(display) {\n    const active = await getThrottling();\n\n    return html`\n    <p>\n        Request throttling: </span>${active}</span>\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\n    </p>`;\n\n    async function set(ev, state) {\n        ev.target.disabled = true;\n        await setThrottling(state);\n        display();\n    }\n}\n\n//import page from '//unpkg.com/page/page.mjs';\n\n\nfunction start() {\n    const main = document.querySelector('main');\n    editor(main);\n}\n\nasync function editor(main) {\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\n    let viewer = html`<div class=\"col\">\n    <p>Select collection to view records</p>\n</div>`;\n    display();\n\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\n    display();\n\n    async function display() {\n        render(html`\n        <section class=\"layout\">\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\n        </section>\n        <section class=\"layout\">\n            ${list}\n            ${viewer}\n        </section>`, main);\n    }\n\n    async function onSelect(ev, name) {\n        ev.preventDefault();\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\n        display();\n    }\n}\n\nstart();\n\n</script>\n</head>\n<body>\n    <main>\n        Loading&hellip;\n    </main>\n</body>\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k,v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Replace entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Record will be replaced!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = targetCollection.get(id);
            const record = assignSystemProps(deepCopy(data), existing);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Modify entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
         function merge(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, merge, delete: del, query };
    }


    function assignSystemProps(target, entry, ...rest) {
        const whitelist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let prop of whitelist) {
            if (entry.hasOwnProperty(prop)) {
                target[prop] = deepCopy(entry[prop]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$1, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$1('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = Object.assign({}, body, {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    });
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$1('Login or password don\'t match');
                    }
                } else {
                    throw new CredentialError$1('Login or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$1('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    /*
     * This plugin requires auth and storage plugins
     */

    const { RequestError: RequestError$3, ConflictError: ConflictError$2, CredentialError: CredentialError$2, AuthorizationError: AuthorizationError$2 } = errors;

    function initPlugin$3(settings) {
        const actions = {
            'GET': '.read',
            'POST': '.create',
            'PUT': '.update',
            'PATCH': '.update',
            'DELETE': '.delete'
        };
        const rules = Object.assign({
            '*': {
                '.create': ['User'],
                '.update': ['Owner'],
                '.delete': ['Owner']
            }
        }, settings.rules);

        return function decorateContext(context, request) {
            // special rules (evaluated at run-time)
            const get = (collectionName, id) => {
                return context.storage.get(collectionName, id);
            };
            const isOwner = (user, object) => {
                return user._id == object._ownerId;
            };
            context.rules = {
                get,
                isOwner
            };
            const isAdmin = request.headers.hasOwnProperty('x-admin');

            context.canAccess = canAccess;

            function canAccess(data, newData) {
                const user = context.user;
                const action = actions[request.method];
                let { rule, propRules } = getRule(action, context.params.collection, data);

                if (Array.isArray(rule)) {
                    rule = checkRoles(rule, data);
                } else if (typeof rule == 'string') {
                    rule = !!(eval(rule));
                }
                if (!rule && !isAdmin) {
                    throw new CredentialError$2();
                }
                propRules.map(r => applyPropRule(action, r, user, data, newData));
            }

            function applyPropRule(action, [prop, rule], user, data, newData) {
                // NOTE: user needs to be in scope for eval to work on certain rules
                if (typeof rule == 'string') {
                    rule = !!eval(rule);
                }

                if (rule == false) {
                    if (action == '.create' || action == '.update') {
                        delete newData[prop];
                    } else if (action == '.read') {
                        delete data[prop];
                    }
                }
            }

            function checkRoles(roles, data, newData) {
                if (roles.includes('Guest')) {
                    return true;
                } else if (!context.user && !isAdmin) {
                    throw new AuthorizationError$2();
                } else if (roles.includes('User')) {
                    return true;
                } else if (context.user && roles.includes('Owner')) {
                    return context.user._id == data._ownerId;
                } else {
                    return false;
                }
            }
        };



        function getRule(action, collection, data = {}) {
            let currentRule = ruleOrDefault(true, rules['*'][action]);
            let propRules = [];

            // Top-level rules for the collection
            const collectionRules = rules[collection];
            if (collectionRules !== undefined) {
                // Top-level rule for the specific action for the collection
                currentRule = ruleOrDefault(currentRule, collectionRules[action]);

                // Prop rules
                const allPropRules = collectionRules['*'];
                if (allPropRules !== undefined) {
                    propRules = ruleOrDefault(propRules, getPropRule(allPropRules, action));
                }

                // Rules by record id 
                const recordRules = collectionRules[data._id];
                if (recordRules !== undefined) {
                    currentRule = ruleOrDefault(currentRule, recordRules[action]);
                    propRules = ruleOrDefault(propRules, getPropRule(recordRules, action));
                }
            }

            return {
                rule: currentRule,
                propRules
            };
        }

        function ruleOrDefault(current, rule) {
            return (rule === undefined || rule.length === 0) ? current : rule;
        }

        function getPropRule(record, action) {
            const props = Object
                .entries(record)
                .filter(([k]) => k[0] != '.')
                .filter(([k, v]) => v.hasOwnProperty(action))
                .map(([k, v]) => [k, v[action]]);

            return props;
        }
    }

    var rules = initPlugin$3;

    var identity = "email";
    var protectedData = {
    	users: {
    		"35c62d76-8152-4626-8712-eeb96381bea8": {
    			email: "peter@abv.bg",
    			username: "Peter",
    			hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
    		},
    		"847ec027-f659-4086-8032-5173e2f9c93a": {
    			email: "george@abv.bg",
    			username: "George",
    			hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
    		},
    		"60f0cf0b-34b0-4abd-9769-8c42f830dffc": {
    			email: "admin@abv.bg",
    			username: "Admin",
    			hashedPassword: "fac7060c3e17e6f151f247eacb2cd5ae80b8c36aedb8764e18a41bbdc16aa302"
    		}
    	},
    	sessions: {
    	}
    };
    var seedData = {
    	recipes: {
    		"3987279d-0ad4-4afb-8ca9-5b256ae3b298": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			name: "Easy Lasagna",
    			img: "assets/lasagna.jpg",
    			ingredients: [
    				"1 tbsp Ingredient 1",
    				"2 cups Ingredient 2",
    				"500 g  Ingredient 3",
    				"25 g Ingredient 4"
    			],
    			steps: [
    				"Prepare ingredients",
    				"Mix ingredients",
    				"Cook until done"
    			],
    			_createdOn: 1613551279012
    		},
    		"8f414b4f-ab39-4d36-bedb-2ad69da9c830": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			name: "Grilled Duck Fillet",
    			img: "assets/roast.jpg",
    			ingredients: [
    				"500 g  Ingredient 1",
    				"3 tbsp Ingredient 2",
    				"2 cups Ingredient 3"
    			],
    			steps: [
    				"Prepare ingredients",
    				"Mix ingredients",
    				"Cook until done"
    			],
    			_createdOn: 1613551344360
    		},
    		"985d9eab-ad2e-4622-a5c8-116261fb1fd2": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			name: "Roast Trout",
    			img: "assets/fish.jpg",
    			ingredients: [
    				"4 cups Ingredient 1",
    				"1 tbsp Ingredient 2",
    				"1 tbsp Ingredient 3",
    				"750 g  Ingredient 4",
    				"25 g Ingredient 5"
    			],
    			steps: [
    				"Prepare ingredients",
    				"Mix ingredients",
    				"Cook until done"
    			],
    			_createdOn: 1613551388703
    		}
    	},
    	comments: {
    		"0a272c58-b7ea-4e09-a000-7ec988248f66": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			content: "Great recipe!",
    			recipeId: "8f414b4f-ab39-4d36-bedb-2ad69da9c830",
    			_createdOn: 1614260681375,
    			_id: "0a272c58-b7ea-4e09-a000-7ec988248f66"
    		}
    	},
    	records: {
    		i01: {
    			name: "John1",
    			val: 1,
    			_createdOn: 1613551388703
    		},
    		i02: {
    			name: "John2",
    			val: 1,
    			_createdOn: 1613551388713
    		},
    		i03: {
    			name: "John3",
    			val: 2,
    			_createdOn: 1613551388723
    		},
    		i04: {
    			name: "John4",
    			val: 2,
    			_createdOn: 1613551388733
    		},
    		i05: {
    			name: "John5",
    			val: 2,
    			_createdOn: 1613551388743
    		},
    		i06: {
    			name: "John6",
    			val: 3,
    			_createdOn: 1613551388753
    		},
    		i07: {
    			name: "John7",
    			val: 3,
    			_createdOn: 1613551388763
    		},
    		i08: {
    			name: "John8",
    			val: 2,
    			_createdOn: 1613551388773
    		},
    		i09: {
    			name: "John9",
    			val: 3,
    			_createdOn: 1613551388783
    		},
    		i10: {
    			name: "John10",
    			val: 1,
    			_createdOn: 1613551388793
    		}
    	},
    	catches: {
    		"07f260f4-466c-4607-9a33-f7273b24f1b4": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			angler: "Paulo Admorim",
    			weight: 636,
    			species: "Atlantic Blue Marlin",
    			location: "Vitoria, Brazil",
    			bait: "trolled pink",
    			captureTime: 80,
    			_createdOn: 1614760714812,
    			_id: "07f260f4-466c-4607-9a33-f7273b24f1b4"
    		},
    		"bdabf5e9-23be-40a1-9f14-9117b6702a9d": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			angler: "John Does",
    			weight: 554,
    			species: "Atlantic Blue Marlin",
    			location: "Buenos Aires, Argentina",
    			bait: "trolled pink",
    			captureTime: 120,
    			_createdOn: 1614760782277,
    			_id: "bdabf5e9-23be-40a1-9f14-9117b6702a9d"
    		}
    	},
    	furniture: {
    	},
    	orders: {
    	},
    	movies: {
    		"1240549d-f0e0-497e-ab99-eb8f703713d7": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			title: "Black Widow",
    			description: "Natasha Romanoff aka Black Widow confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises. Comes on the screens 2020.",
    			img: "https://miro.medium.com/max/735/1*akkAa2CcbKqHsvqVusF3-w.jpeg",
    			_createdOn: 1614935055353,
    			_id: "1240549d-f0e0-497e-ab99-eb8f703713d7"
    		},
    		"143e5265-333e-4150-80e4-16b61de31aa0": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			title: "Wonder Woman 1984",
    			description: "Diana must contend with a work colleague and businessman, whose desire for extreme wealth sends the world down a path of destruction, after an ancient artifact that grants wishes goes missing.",
    			img: "https://pbs.twimg.com/media/ETINgKwWAAAyA4r.jpg",
    			_createdOn: 1614935181470,
    			_id: "143e5265-333e-4150-80e4-16b61de31aa0"
    		},
    		"a9bae6d8-793e-46c4-a9db-deb9e3484909": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			title: "Top Gun 2",
    			description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    			img: "https://i.pinimg.com/originals/f2/a4/58/f2a458048757bc6914d559c9e4dc962a.jpg",
    			_createdOn: 1614935268135,
    			_id: "a9bae6d8-793e-46c4-a9db-deb9e3484909"
    		}
    	},
    	likes: {
    	},
    	ideas: {
    		"833e0e57-71dc-42c0-b387-0ce0caf5225e": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			title: "Best Pilates Workout To Do At Home",
    			description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima possimus eveniet ullam aspernatur corporis tempore quia nesciunt nostrum mollitia consequatur. At ducimus amet aliquid magnam nulla sed totam blanditiis ullam atque facilis corrupti quidem nisi iusto saepe, consectetur culpa possimus quos? Repellendus, dicta pariatur! Delectus, placeat debitis error dignissimos nesciunt magni possimus quo nulla, fuga corporis maxime minus nihil doloremque aliquam quia recusandae harum. Molestias dolorum recusandae commodi velit cum sapiente placeat alias rerum illum repudiandae? Suscipit tempore dolore autem, neque debitis quisquam molestias officia hic nesciunt? Obcaecati optio fugit blanditiis, explicabo odio at dicta asperiores distinctio expedita dolor est aperiam earum! Molestias sequi aliquid molestiae, voluptatum doloremque saepe dignissimos quidem quas harum quo. Eum nemo voluptatem hic corrupti officiis eaque et temporibus error totam numquam sequi nostrum assumenda eius voluptatibus quia sed vel, rerum, excepturi maxime? Pariatur, provident hic? Soluta corrupti aspernatur exercitationem vitae accusantium ut ullam dolor quod!",
    			img: "./images/best-pilates-youtube-workouts-2__medium_4x3.jpg",
    			_createdOn: 1615033373504,
    			_id: "833e0e57-71dc-42c0-b387-0ce0caf5225e"
    		},
    		"247efaa7-8a3e-48a7-813f-b5bfdad0f46c": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			title: "4 Eady DIY Idea To Try!",
    			description: "Similique rem culpa nemo hic recusandae perspiciatis quidem, quia expedita, sapiente est itaque optio enim placeat voluptates sit, fugit dignissimos tenetur temporibus exercitationem in quis magni sunt vel. Corporis officiis ut sapiente exercitationem consectetur debitis suscipit laborum quo enim iusto, labore, quod quam libero aliquid accusantium! Voluptatum quos porro fugit soluta tempore praesentium ratione dolorum impedit sunt dolores quod labore laudantium beatae architecto perspiciatis natus cupiditate, iure quia aliquid, iusto modi esse!",
    			img: "./images/brightideacropped.jpg",
    			_createdOn: 1615033452480,
    			_id: "247efaa7-8a3e-48a7-813f-b5bfdad0f46c"
    		},
    		"b8608c22-dd57-4b24-948e-b358f536b958": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			title: "Dinner Recipe",
    			description: "Consectetur labore et corporis nihil, officiis tempora, hic ex commodi sit aspernatur ad minima? Voluptas nesciunt, blanditiis ex nulla incidunt facere tempora laborum ut aliquid beatae obcaecati quidem reprehenderit consequatur quis iure natus quia totam vel. Amet explicabo quidem repellat unde tempore et totam minima mollitia, adipisci vel autem, enim voluptatem quasi exercitationem dolor cum repudiandae dolores nostrum sit ullam atque dicta, tempora iusto eaque! Rerum debitis voluptate impedit corrupti quibusdam consequatur minima, earum asperiores soluta. A provident reiciendis voluptates et numquam totam eveniet! Dolorum corporis libero dicta laborum illum accusamus ullam?",
    			img: "./images/dinner.jpg",
    			_createdOn: 1615033491967,
    			_id: "b8608c22-dd57-4b24-948e-b358f536b958"
    		}
    	},
    	catalog: {
    		"53d4dbf5-7f41-47ba-b485-43eccb91cb95": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			make: "Table",
    			model: "Swedish",
    			year: 2015,
    			description: "Medium table",
    			price: 235,
    			img: "./images/table.png",
    			material: "Hardwood",
    			_createdOn: 1615545143015,
    			_id: "53d4dbf5-7f41-47ba-b485-43eccb91cb95"
    		},
    		"f5929b5c-bca4-4026-8e6e-c09e73908f77": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			make: "Sofa",
    			model: "ES-549-M",
    			year: 2018,
    			description: "Three-person sofa, blue",
    			price: 1200,
    			img: "./images/sofa.jpg",
    			material: "Frame - steel, plastic; Upholstery - fabric",
    			_createdOn: 1615545572296,
    			_id: "f5929b5c-bca4-4026-8e6e-c09e73908f77"
    		},
    		"c7f51805-242b-45ed-ae3e-80b68605141b": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			make: "Chair",
    			model: "Bright Dining Collection",
    			year: 2017,
    			description: "Dining chair",
    			price: 180,
    			img: "./images/chair.jpg",
    			material: "Wood laminate; leather",
    			_createdOn: 1615546332126,
    			_id: "c7f51805-242b-45ed-ae3e-80b68605141b"
    		}
    	},
    	teams: {
    		"34a1cab1-81f1-47e5-aec3-ab6c9810efe1": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			name: "Storm Troopers",
    			logoUrl: "/assets/atat.png",
    			description: "These ARE the droids we're looking for",
    			_createdOn: 1615737591748,
    			_id: "34a1cab1-81f1-47e5-aec3-ab6c9810efe1"
    		},
    		"dc888b1a-400f-47f3-9619-07607966feb8": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			name: "Team Rocket",
    			logoUrl: "/assets/rocket.png",
    			description: "Gotta catch 'em all!",
    			_createdOn: 1615737655083,
    			_id: "dc888b1a-400f-47f3-9619-07607966feb8"
    		},
    		"733fa9a1-26b6-490d-b299-21f120b2f53a": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			name: "Minions",
    			logoUrl: "/assets/hydrant.png",
    			description: "Friendly neighbourhood jelly beans, helping evil-doers succeed.",
    			_createdOn: 1615737688036,
    			_id: "733fa9a1-26b6-490d-b299-21f120b2f53a"
    		}
    	},
    	members: {
    		"cc9b0a0f-655d-45d7-9857-0a61c6bb2c4d": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			teamId: "34a1cab1-81f1-47e5-aec3-ab6c9810efe1",
    			status: "member",
    			_createdOn: 1616236790262,
    			_updatedOn: 1616236792930
    		},
    		"61a19986-3b86-4347-8ca4-8c074ed87591": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			teamId: "dc888b1a-400f-47f3-9619-07607966feb8",
    			status: "member",
    			_createdOn: 1616237188183,
    			_updatedOn: 1616237189016
    		},
    		"8a03aa56-7a82-4a6b-9821-91349fbc552f": {
    			_ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
    			teamId: "733fa9a1-26b6-490d-b299-21f120b2f53a",
    			status: "member",
    			_createdOn: 1616237193355,
    			_updatedOn: 1616237195145
    		},
    		"9be3ac7d-2c6e-4d74-b187-04105ab7e3d6": {
    			_ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
    			teamId: "dc888b1a-400f-47f3-9619-07607966feb8",
    			status: "member",
    			_createdOn: 1616237231299,
    			_updatedOn: 1616237235713
    		},
    		"280b4a1a-d0f3-4639-aa54-6d9158365152": {
    			_ownerId: "60f0cf0b-34b0-4abd-9769-8c42f830dffc",
    			teamId: "dc888b1a-400f-47f3-9619-07607966feb8",
    			status: "member",
    			_createdOn: 1616237257265,
    			_updatedOn: 1616237278248
    		},
    		"e797fa57-bf0a-4749-8028-72dba715e5f8": {
    			_ownerId: "60f0cf0b-34b0-4abd-9769-8c42f830dffc",
    			teamId: "34a1cab1-81f1-47e5-aec3-ab6c9810efe1",
    			status: "member",
    			_createdOn: 1616237272948,
    			_updatedOn: 1616237293676
    		}
    	},
        products: { 
            "d236b099-6cea-46fa-bb85-ef780202a46a": {
                    "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                    "name": "Carrot",
                    "price": "23",
                    "imageUrl": "https://www.shutterstock.com/image-photo/carrot-isolated-on-white-background-600nw-795704785.jpg",
                    "country": "Bulgaria",
                    "kindProduct": "vegetable",
                    "quantity": "20",
                    "description": "The best carrot from BG!",
                    "_createdOn": 1701614143273,
                    "_id": "d236b099-6cea-46fa-bb85-ef780202a46a"
            },
            "2f9dac6d-ea11-4628-b13d-f42f14c416e1": {
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "name": "Apple red",
                "price": "30",
                "imageUrl": "data:image/jpeg;base64,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",
                "country": "България",
                "kindProduct": "fruit",
                "quantity": "234",
                "description": "The sweetest apples!",
                "_createdOn": 1701614308700,
                "_id": "2f9dac6d-ea11-4628-b13d-f42f14c416e1"
            },
            "f9de699c-2edb-44f3-abce-8ff3d47119c8": {
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "name": "Apple green",
                "price": "64",
                "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIjlB1cMvnb0c9HZIMBvGowV1EcBTRgS1Bog&usqp=CAU",
                "country": "Bulgaria",
                "kindProduct": "fruit",
                "quantity": "34",
                "description": "The green apples from Bulgaria!",
                "_createdOn": 1701614361432,
                "_id": "f9de699c-2edb-44f3-abce-8ff3d47119c8",
                "_updatedOn": 1701614373922
            },
            "d40fd58e-eec8-468f-b4df-cb66674353d0": {
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "name": "Cabage",
                "price": "34",
                "imageUrl": "data:image/jpeg;base64,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",
                "country": "Bulgaria",
                "kindProduct": "vegetable",
                "quantity": "80",
                "description": "The best cabage from Bulgaria!",
                "_createdOn": 1701621624888,
                "_id": "d40fd58e-eec8-468f-b4df-cb66674353d0",
                "_updatedOn": 1701621697792
            },
            "408e1beb-5099-49ab-8261-fb293c9325ce": {
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "name": "Banana",
                "price": "67",
                "imageUrl": "data:image/jpeg;base64,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",
                "country": "Bulgaria",
                "kindProduct": "fruit",
                "quantity": "56",
                "description": "The best bananas ever!",
                "_createdOn": 1701622265343,
                "_id": "408e1beb-5099-49ab-8261-fb293c9325ce"
            },
            "6b117b56-59b5-473d-853d-4574ce6f9111": {
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "name": "Strawberry",
                "price": "55.00",
                "imageUrl": "data:image/jpeg;base64,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",
                "country": "Bulgaria",
                "kindProduct": "fruit",
                "quantity": "80",
                "description": "The sweetest strawberries in the world!",
                "_createdOn": 1701623400898,
                "_id": "6b117b56-59b5-473d-853d-4574ce6f9111"
            }
        }
    };
    var rules$1 = {
    	users: {
    		".create": false,
    		".read": [
    			"Owner"
    		],
    		".update": false,
    		".delete": false
    	},
    	members: {
    		".update": "isOwner(user, get('teams', data.teamId))",
    		".delete": "isOwner(user, get('teams', data.teamId)) || isOwner(user, data)",
    		"*": {
    			teamId: {
    				".update": "newData.teamId = data.teamId"
    			},
    			status: {
    				".create": "newData.status = 'pending'"
    			}
    		}
    	}
    };
    var settings = {
    	identity: identity,
    	protectedData: protectedData,
    	seedData: seedData,
    	rules: rules$1
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2(),
        rules(settings)
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));

    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServerMaster = {

    };

    return softuniPracticeServerMaster;

})));
