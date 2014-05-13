var OrderModel = (function() {
    var self = this,
        mongoose = require('mongoose');

    self.model = mongoose.model('Order', {
        timestamp : Date,
        items : []
    });

    return self.model;

})();

module.exports = OrderModel;