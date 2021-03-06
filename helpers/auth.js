var passport = require('passport'),
    config = rootRequire('helpers/config'),
    BBWSStrategy = require('./passport-bookbrainz-ws');

var auth = {};

auth.init = function(app) {
	var ws = app.get('webservice');

	passport.use(new BBWSStrategy({
		wsURL: ws,
		clientID: config.site.clientID
	}, function(req, accessToken, refreshToken, profile, done) {
		req.session.bearerToken = accessToken;

		done(null, profile);
	}));

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	app.use(passport.initialize());
	app.use(passport.session());
};

auth.authenticate = function() {
	return function(req, res, next) {
		var options = {
			username: req.body.username,
			password: 'abc'
		};

		passport.authenticate('bbws', options)(req, res, next);
	}
};

auth.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();

	req.session.redirectTo = req.originalUrl;
	res.redirect(303, '/login');
};

module.exports = auth;
