var authConfig = require('./authConfig.json'),
    request = require('request');

module.exports = function (app) {

    app.get('/', isLoggedIn, function (req, res) {
        console.log(JSON.stringify(req.session.user.accessToken));
        res.render('index');
    });

    /***************************
     * OAuth authorization
     ***************************/
    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/auth/debitoor', function (req, res) {
        return res.redirect('https://app.debitoor.com/login/oauth2/authorize?response_type=code&client_id=' + authConfig.clientID + '&redirect_uri=' + app.get('site uri') + authConfig.callbackURI);
    });

    app.get('/auth/debitoor/callback', function (req, res) {
        request.post({
            url: 'https://app.debitoor.com/login/oauth2/access_token',
            form: { client_secret: authConfig.clientSecret, code: req.query.code, redirect_uri: app.get('site uri') }
        }, function (err, httpResponse, body) {
            if (err) return res.redirect(login);
            req.session.user = {};
            req.session.user.accessToken = JSON.parse(body).access_token;
            res.redirect('/');
        });
    });
}

function isLoggedIn (req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

