const express = require("express");
const session = require("express-session");
const passport = require("passport");
const strategy = require("./strategy");
const request = require("request");

const app = express();

app.use(
    session({
        secret: "@nyth!ng y0u w@nT",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log("user: ", user);
    const { name, nickname } = user._json;
    return done(null, { name, nickname });
});
passport.deserializeUser((obj, done) => {
    return done(null, obj);
});

app.get(
    "/login",
    passport.authenticate("auth0", {
        successRedirect: "/followers",
        failureRedirect: "/login",
        failureFlash: true,
        connection: "github"
    })
);
app.get("/followers", (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    } else {
        const followersRequest = {
            url: `https://api.github.com/users/${req.user.nickname}/followers`,
            headers: {
                "User-Agent": req.user.name
            }
        };
        request(followersRequest, (error, response, body) => {
            // console.log(error);
            return res.status(200).send(body);
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
