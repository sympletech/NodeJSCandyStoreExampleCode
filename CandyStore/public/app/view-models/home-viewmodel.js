var homeViewModel = function () {
    var self = this;

    //***************************************
    //  Candy Catalog
    //***************************************
    self.candyChoices = ko.observableArray();
    
    self.loadCandyChoices = function() {
        $.get('/api/candy', function(data) {
            self.candyChoices(data);
        });
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

    
    self.checkout = function() {
        $('#myModal').modal('show');
    };

    //***************************************
    //  Modal
    //***************************************
    self.modalData = {
        modalId : "myModal",
        modalTitle : ko.observable("Checkout Window"),
        modalBodyTemplate : {name : 'checkout-template', data: self},
        submit : function() {
            var cartItems = ko.viewmodel.toModel(self.cart);
            
            $.post('/api/checkout', { items: JSON.stringify(cartItems) }, function(data) {
                $('#myModal').modal('hide');
                self.cart([]);
            });
        }
    };

    return self;
};