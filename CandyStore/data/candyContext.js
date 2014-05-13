var CandyContext = function() {
    var self = this;

    self.fakeData = [
        { id: 1, name: 'Green Taffy', price: '0.50' },
        { id: 2, name: 'Sour Balls', price: '0.75' },
        { id: 3, name: 'Pixie Sticks', price: '1.50' },
        { id: 4, name: 'Pez', price: '3.50' },
        { id: 5, name: 'Black Licorice', price: '0.25' }
    ];

    return self;
};

module.exports = new CandyContext();