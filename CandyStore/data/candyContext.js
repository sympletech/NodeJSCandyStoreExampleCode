var CandyContext = function() {
    var self = this,
        mongoose = require('mongoose');

    mongoose.connection.on('error', function(err) {
        console.log('Connection Error : ' + err);
    });
    mongoose.connect('mongodb://localhost/NodeCandyStore');

    
    self.candyModel = require('./models/candyModel');
    self.createCandy = function(data) {
        var newCandy = self.candyModel(data);
        newCandy.save();
    };
    
    self.orderModel = require('./models/orderModel');
    self.createOrder = function(data) {
        var newOrder = self.orderModel(data);
        newOrder.save();
    };


    return self;
};

module.exports = new CandyContext();