var CandyModel = (function() {
    var self = this,
        mongoose = require('mongoose');

    self.model = mongoose.model('Candy', {
        name : String,
        price : Number
    });

    return self.model;

})();

module.exports = CandyModel;