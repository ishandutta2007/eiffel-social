const crypto = require('crypto');
const got = require('got');
const querystring = require('querystring');
const DOMAIN = process.env.DOMAIN;

const config = require('./config.json');

module.exports = function(db) {

    const CommonService = require('../common/common.service.js');
    const { generateSignature } = new CommonService(db);

    const urlPrefix = `https://${DOMAIN}/api`;
    const getOauthAuthorizeUrl = async (provider, uid) => {
        // get provider data
        if (!(provider in config)) { return false; }
        const { clientId, scope, authorizationUrl } = config[provider];
        // build the authorization query parameters
        const path = `/auth/${provider}/callback`;
        const query = { uid: uid, time: Date.now() };
        const payload = { path: path, ...query };
        const hmac = await generateSignature(payload, uid);
        query.hmac = hmac;
        const state = Buffer.from(JSON.stringify(query), 'utf8').toString('base64');
        const callbackUrl = `${urlPrefix}${path}`;
        const authorizationQuery = {
            client_id: clientId,
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: scope,
            state: state,
        };
        // add provider-specific parameters
        switch (provider) {
            case 'google':
                authorizationQuery.access_type = 'offline';
                // TODO: could set login_hint to the user's email address
                break;
            case 'hootsuite':
                // no additional parameters required
                break;
            default:
                break;
        }
        // return the combined URL
        return `${authorizationUrl}?${querystring.stringify(authorizationQuery)}`;
    };

    const tokenInsertQuery = 'insert into oauth_tokens (provider, accessToken, expiry, refreshToken, raw) values ($1, $2, $3, $4, $5) on conflict (provider) do update set accessToken=excluded.accessToken, expiry=excluded.expiry, refreshToken=excluded.refreshToken, raw=excluded.raw';
    const getOauthAccessToken = async (provider, code) => {
        if (!(provider in config)) { return false; }
        const { clientId, clientSecret, scope, accessTokenUrl } = config[provider];
        const tokenQuery = {
            code: code,
            redirect_uri: `${urlPrefix}/auth/${provider}/callback`,
            grant_type: 'authorization_code',
        };
        const tokenHeaders = {};
        switch (provider) {
            case 'google':
                tokenQuery.client_id = clientId;
                tokenQuery.client_secret = clientSecret;
                // no additional headers
                break;
            case 'hootsuite':
                tokenQuery.scope = scope;
                const authString = `${clientId}:${clientSecret}`;
                tokenHeaders.Authorization = `Basic ${Buffer.from(authString, 'utf8').toString('base64')}`;
                break;
            default:
                break;
        }
        try {
            const tokenResponse = await got.post(accessTokenUrl, {
                body: tokenQuery,
                form: true,
                headers: tokenHeaders,
                json: true,
            });
            const token = {
                provider: provider,
                accessToken: tokenResponse.body.access_token,
                expiry: Date.now() + tokenResponse.body.expires_in * 1000,
                refreshToken: tokenResponse.body.refresh_token,
                raw: JSON.stringify(tokenResponse.body),
            };
            await db.query(tokenInsertQuery, Object.values(token));
            return token;
        }
        catch (err) {
            console.error('Error in getOauthAccessToken:', err, tokenQuery, tokenHeaders);
            return { accessToken: false, error: err };
        }
    };

    const tokenSelectQuery = 'select provider, accessToken, expiry, refreshToken, raw from oauth_tokens where provider=$1';
    const getOauthData = async (provider) => {
        if (!(provider in config)) { return false; }
        const { clientId, clientSecret, scope, accessTokenUrl } = config[provider];
        const tokenSelectResult = await db.query(tokenSelectQuery, [provider]);
        if (!tokenSelectResult.rows.length) { return false; }
        const token = tokenSelectResult.rows[0];
        // PostgreSQL is case insensitive: copy values to camel case
        token.accessToken = token.accesstoken;
        token.refreshToken = token.refreshtoken;
        // if the access token is fresh, return it
        if (token.expiry > Date.now()) { return token; }
        // token is expired: try to refresh it
        const tokenQuery = {
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        };
        const tokenHeaders = {};
        switch (provider) {
            case 'google':
                tokenQuery.client_id = clientId;
                tokenQuery.client_secret = clientSecret;
                // no additional headers
                break;
            case 'hootsuite':
                tokenQuery.scope = scope;
                const authString = `${clientId}:${clientSecret}`;
                tokenHeaders.Authorization = `Basic ${Buffer.from(authString, 'utf8').toString('base64')}`;
                break;
            default:
                break;
        }
        try {
            const tokenResponse = await got.post(accessTokenUrl, {
                body: tokenQuery,
                form: true,
                headers: tokenHeaders,
                json: true,
            });
            const newToken = {
                provider: provider,
                accessToken: tokenResponse.body.access_token,
                expiry: Date.now() + tokenResponse.body.expires_in * 1000,
                // Google reuses refresh tokens, but Hootsuite refresh tokens are one-time use
                refreshToken: tokenResponse.body.refresh_token || token.refreshToken,
                raw: JSON.stringify(tokenResponse.body),
            };
            await db.query(tokenInsertQuery, Object.values(newToken));
            return newToken;
        }
        catch (err) {
            // swallow the error and return the stale token
            console.error(`Token refresh failed: ${JSON.stringify(err)} for ${provider} token ${JSON.stringify(token)}`);
            return token;
        }
    };

    const createMultipart = (gotOptions) => {
        // NB: gotOptions is passed by reference and gets mutated
        // set the multipart boundary
        const boundary = crypto.randomBytes(16).toString('hex');
        gotOptions.headers['Content-Type'] = `multipart/related; boundary=${boundary}`;
        // got 9.6.0 won't allow a different body type when receiving JSON
        gotOptions.headers['Accept'] = 'application/json';
        gotOptions.json = false;
        // build the body
        const bodyStrings = [];
        for (const part of gotOptions.body) {
            bodyStrings.push(`--${boundary}\r\nContent-Type: ${part['Content-Type']}\r\n`);
            bodyStrings.push(part.body);
        }
        bodyStrings.push(`--${boundary}--`);
        gotOptions.body = bodyStrings.join('\r\n');
    };
    const oauthApiCall = async (provider, method, endpoint, body) => {
        const token = await getOauthData(provider);
        if (!token) { throw { status: 'missing_token', message: `Could not get token for ${provider}.` }; }
        if (token.expiry < Date.now()) { throw { status: 'stale_token', message: 'Could not get fresh token' }; }
        const url = `${config[provider].apiPrefix}${endpoint}`;
        const options = {
            headers: { Authorization: `Bearer ${token.accessToken}` },
            json: true,
            method: method,
        };
        if (body) {
            options.body = body;
            if (Array.isArray(body)) { createMultipart(options); }
        }
        try {
            const response = await got(url, options);
            if (Array.isArray(body)) { return JSON.parse(response.body); }
            else { return response.body; }
        }
        catch (err) {
            throw { status: 'error', response: err };
        }
    };

    return {
        getOauthAuthorizeUrl: getOauthAuthorizeUrl,
        getOauthAccessToken: getOauthAccessToken,
        getOauthData: getOauthData,
        oauthApiCall: oauthApiCall,
    };

};
