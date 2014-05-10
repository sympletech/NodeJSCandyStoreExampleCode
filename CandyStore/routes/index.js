var Routes = function(app) {
    var self = this;

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });    


    app.get('/users', function(req, res) {
        res.send("respond with a resource");
    });   

    return self;
};

module.exports = Routes;