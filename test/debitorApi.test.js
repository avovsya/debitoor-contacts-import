var expect = require('chai').expect,
    debitoor = require('../lib/debitoor'),
    customers = [['Ivan', 'ivan@gmail.com'], ['Petr', 'petr@gmail.com']],
    authConfig = require('../authConfig'),
    accessToken = authConfig.accessToken;

describe('Debitoor API addCustomers', function () {
    it('should add customers to debitoor given accessToken and customers array',
        function (done) {
            debitoor.addCustomers(accessToken, customers, function (err) {
                expect(err).to.not.exist;
                done();
            });
        });

    it('should return array with contacts formated as object',
        function (done) {
            debitoor.addCustomers(accessToken, customers, function (err, contacts) {
                expect(contacts.length).to.equal(2);
                expect(contacts[0].name).to.equal('Ivan');
                done();
            });
        });
});
