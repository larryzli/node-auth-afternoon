const { domain, clientID, clientSecret } = require("./config");
const Auth0Strategy = require("passport-auth0");

module.exports = new Auth0Strategy(
    {
        domain,
        clientID,
        clientSecret,
        scope: "openid profile",
        callbackURL: "/login"
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
);
