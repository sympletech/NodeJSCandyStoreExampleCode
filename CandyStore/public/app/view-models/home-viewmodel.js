var fakeData = [
    {id : 1, name : 'Green Taffy', price:'0.50'},
    {id : 2, name : 'Sour Balls', price:'0.75'},
    {id : 3, name : 'Pixie Sticks', price:'1.50'},
    {id : 4, name : 'Pez', price:'3.50'},
    {id : 5, name : 'Black Licorice', price:'0.25'}

];

var homeViewModel = function () {
    var self = this;

    //***************************************
    //  Candy Catalog
    //***************************************
    self.candyChoices = ko.observableArray();
    
    self.loadCandyChoices = function() {
        self.candyChoices(fakeData);
    };
    self.loadCandyChoices();

    //***************************************
    //  Shopping Cart
    //***************************************
    self.cart = ko.observableArray();

    self.addCandyToCart = function(candy) {
        self.cart.push(candy);
    };

    self.removeCandyFromCart = function(candy) {
        var smallerList = _.reject(self.cart(), function(cartItem) {
            return cartItem == candy;
        });
        self.cart(smallerList);
    };

    self.cartTotal = ko.computed(function() {
        if (self.cart().length == 0) {
            return 0;
        }

        var cartPrices = _.map(self.cart(), function(cartItem) {
            return parseFloat(cartItem.price);
        });
        var cartTotal = _.reduce(cartPrices, function(memo, num) {
            return memo + num;
        });
        return cartTotal;
    });

    self.showCheckout = ko.observable(false);
    self.checkout = function() {
        self.showCheckout(true);
    };

    return self;
};