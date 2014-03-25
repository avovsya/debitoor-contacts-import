var expect = require('chai').expect,
    parser = require('../lib/parser');

describe('CSV Parser', function () {
    it('should take path to csv file and return array with contacts', function (done) {
        parser(__dirname + '/test-data.csv', function (contacts) {
            expect(contacts.length).to.equal(4);
            done();
        });
    });
});
