var request = require('request'),
    async = require('async'),
    _ = require('underscore');

exports.addCustomers = function (accessToken, contacts, callback) {
    contacts = _.map(contacts, function (contactArray) {
        return {
            name: contactArray[0],
            email: contactArray[1],
            paymentTermsId: 1,
            countryCode: 'UA'
        }
    });
    async.each(contacts,
        function (contact, cb) {
            request.post({
                url: 'https://api.debitoor.com/api/v1.0/customers?access_token=' + accessToken,
                json: contact
            }, function (err, res, body) {
                if (res.statusCode !== 200 && !err) {
                    err = new Error(res.statusCode);
                }
                cb(err);
            });
        }, function (err) {
            callback(err, contacts);
        });
};
