var csv = require('csv');

module.exports = function (path, callback) {
    csv()
        .from.path(path)
        .to.array(callback);
};
