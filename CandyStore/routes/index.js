var Routes = function(app) {
    var self = this;

    app.get('/users', function(req, res) {
        res.send("respond with a resource");
    });   

    return self;
};

module.exports = Routes;