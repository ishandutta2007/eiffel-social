module.exports = function(authService) {

    const getOauthAuthorizeUrl = async (provider, uid) => {
        const url = await authService.getOauthAuthorizeUrl(provider, uid);
        if (!url) { throw { status: 404, message: `No such provider: ${provider}` }; }
        return url;
    };

    const getOauthAccessToken = async (provider, query) => {
        if (query.error) { throw { status: 400, message: JSON.stringify(query) }; }
        const tokenData = await authService.getOauthAccessToken(provider, query.code);
        if (!tokenData) { throw { status: 404, message: `No such provider: ${provider}` }; }
        if (!tokenData.accessToken) { throw { status: 502, message: `Unable to obtain access token: ${JSON.stringify(tokenData)}` }; }
        return tokenData;
    };

    const getOauthData = async (provider) => {
        const tokenData = await authService.getOauthData(provider);
        if (!tokenData) { throw { status: 404, message: `No such provider: ${provider}` }; }
        if (tokenData.expiry < Date.now()) { throw { status: 502, message: `Unable to refresh expired access token: ${JSON.stringify(tokenData)}` }; }
        return tokenData;
    };

    return {
        getOauthAuthorizeUrl: getOauthAuthorizeUrl,
        getOauthAccessToken: getOauthAccessToken,
        getOauthData: getOauthData,
    };

};
