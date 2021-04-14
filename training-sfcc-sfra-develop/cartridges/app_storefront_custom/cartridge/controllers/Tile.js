'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var StringUtils = require('dw/util/StringUtils');
var Resource = require('dw/web/Resource');
var Decimal = require('dw/util/Decimal');

server.extend(module.superModule);

server.append('Show', cache.applyPromotionSensitiveCache, function (req, res, next) {
    // In this extended controller we're to calculate the discount percentage price, if applies
    var viewData = res.getViewData();

    var product = viewData.product;
    var discountMessage = "0";
    if (product.price.list !== null) {
        var percentDiscount = new Decimal((1-(product.price.sales.decimalPrice/product.price.list.decimalPrice))*100);
        discountMessage = Resource.msgf('custom.message','pricing',null,StringUtils.formatNumber(percentDiscount.round(0)));
    }
    viewData.discountMessage = discountMessage;
    res.setViewData(viewData);

    next();
});

module.exports = server.exports();
