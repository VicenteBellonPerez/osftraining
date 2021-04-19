'use strict';

var server = require('server');

server.extend(module.superModule);

server.append('AddProduct', function (req, res, next) {

    var cartHelper = require('*/cartridge/scripts/helpers/cartHelpers');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var URLUtils = require('dw/web/URLUtils');
    if (req.currentCustomer.profile) {
        // User logged
        var customerEmail =  req.currentCustomer.profile.email;
        // Retrieve product information
        var quantity = req.form.quantity;
        var product = ProductMgr.getProduct(req.form.pid);
        var productObj = {
            productName: product.name,
            productDescription: product.shortDescription,
            productQuantity: quantity,
            productPrice: product.priceModel.pricePerUnit,
            productImage: product.getImage('medium').absURL
        };
        // Send the notification via email
        cartHelper.sendAddCartProductEmail(customerEmail,productObj);
    }
    next();
});

module.exports = server.exports();
