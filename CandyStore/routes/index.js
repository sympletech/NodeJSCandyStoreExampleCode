var Routes = function(app) {
    var self = this;

    var dataContext = require('../data/CandyContext');

    app.get('/api/Candy', function(req, res) {
        res.send(dataContext.fakeData);
    });

    app.get('/users', function(req, res) {
        res.send("respond with a resource");
    });   

    return self;
};

module.exports = Routes;