var authConfig = require('./authConfig.json'),
    request = require('request'),
    parser = require('./lib/parser'),
    debitoor = require('./lib/debitoor');

module.exports = function (app) {

    app.get('/', isLoggedIn, function (req, res) {
        res.render('index');
    });

    app.post('/upload', isLoggedIn, function (req, res) {
        parser(req.files.contactsFile.path, function (contacts) {
            debitoor.addCustomers(req.session.accessToken, contacts, function (err, contacts) {
                if (err) return res.send(500, 'Something went wrong: ' + err);
                req.session.contacts = contacts;
                res.redirect(303, '/show');
            });
        });
    });

    app.get('/show', isLoggedIn, function (req, res) {
        if (!req.session.contacts) return res.redirect('/');
        res.render('customerList', { contacts: req.session.contacts });
    });

    /***************************
     * OAuth authorization
     ***************************/
    app.get('/login', function (req, res) {
        if (req.session.accessToken) return res.redirect('/');
        res.render('login');
    });

    app.get('/logout', isLoggedIn, function (req, res) {
        req.session.destroy();
        res.redirect('/');
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
            req.session.accessToken = JSON.parse(body).access_token;
            res.redirect('/');
        });
    });
}

function isLoggedIn (req, res, next) {
    if (req.session.accessToken) return next();
    res.redirect('/login');
}

