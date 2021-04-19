'use strict';

var server = require('server');

server.extend(module.superModule);

server.append('AddProduct', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var URLUtils = require('dw/web/URLUtils');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

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
    
        var emailObj = {
            to: customerEmail,
            subject: Resource.msg('cart.email.add.item.subject', 'cart', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
            type: emailHelpers.emailTypes.orderConfirmation
        };
        // Send the notification via email
        emailHelpers.sendEmail(emailObj, 'mail/addItemEmailTemplate', productObj);        
    }
    next();
});

module.exports = server.exports();
