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
                form: tokenQuery,
                headers: tokenHeaders,
                responseType: 'json',
            });
            const token = {
                provider: provider,
                accessToken: tokenResponse.access_token,
                expiry: Date.now() + tokenResponse.expires_in * 1000,
                refreshToken: tokenResponse.refresh_token,
                raw: JSON.stringify(tokenResponse),
            };
            await db.query(tokenInsertQuery, Object.values(token));
            return token;
        }
        catch (err) {
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
                form: tokenQuery,
                headers: tokenHeaders,
                responseType: 'json',
            });
            const newToken = {
                provider: provider,
                accessToken: tokenResponse.access_token,
                expiry: Date.now() + tokenResponse.expires_in * 1000,
                // Google reuses refresh tokens, but Hootsuite refresh tokens are one-time use
                refreshToken: tokenResponse.refresh_token || token.refreshToken,
                raw: JSON.stringify(tokenResponse),
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

    return {
        getOauthAuthorizeUrl: getOauthAuthorizeUrl,
        getOauthAccessToken: getOauthAccessToken,
        getOauthData: getOauthData,
    };

};
