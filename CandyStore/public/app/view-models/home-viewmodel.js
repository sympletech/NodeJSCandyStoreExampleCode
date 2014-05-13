var fakeData = [
    {id : 1, name : 'candy name', price:0.5},
    {id : 2, name : 'candy name', price:0.5},
    {id : 3, name : 'candy name', price:0.5},
    {id : 4, name : 'candy name', price:0.5}
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

    self.showCheckout = ko.observable(false);
    self.checkout = function() {
        self.showCheckout(true);
    };

    return self;
};