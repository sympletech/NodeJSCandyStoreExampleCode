var Routes = function(app) {
    var self = this;

    var dataContext = require('../data/CandyContext');

    app.get('/api/loadCandy', function(req, res) {

        dataContext.candyModel.remove({}, function() {
            dataContext.createCandy({name: 'Green Taffy', price: '0.50' });
            dataContext.createCandy({name: 'Sour Balls', price: '0.75' });
            dataContext.createCandy({name: 'Pixie Sticks', price: '1.50' });
            dataContext.createCandy({name: 'Pez', price: '3.50' });
            dataContext.createCandy({name: 'Black Licorice', price: '0.25' });
        
            res.send("Candy Created");            
        });
    });

    app.get('/api/Candy', function(req, res) {
        dataContext.candyModel.find(function(err, candies) {
            res.json(candies);
        });
    });

    app.post('/api/checkout', function(req, res) {
        var items = JSON.parse(req.body.items);

        dataContext.createOrder({
            timestamp : new Date(),
            items : items
        });

        res.send("Order Saved");     
    });
  

    return self;
};

module.exports = Routes;