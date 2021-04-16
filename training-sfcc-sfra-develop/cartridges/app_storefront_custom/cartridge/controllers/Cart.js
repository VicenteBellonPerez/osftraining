'use strict';

var server = require('server');
var Resource = require('dw/web/Resource');
var Site = require('dw/system/Site');

server.extend(module.superModule);

function alertImportExceeded(importExceededMessage,basketTotal) {
        
    var basketImportLimit = Site.current.getCustomPreferenceValue('basketImportLimit');
    var totalImportAsNumber = Number(basketTotal.grandTotal.replace(/[^0-9.-]+/g,""));
    if (totalImportAsNumber > basketImportLimit) {
        importExceededMessage = Resource.msgf('alert.cart.import.exceeded','cart',null,basketImportLimit,basketTotal.grandTotal);
    }
    return importExceededMessage;
}

server.append('Show',function(req, res, next) {

    var viewData = res.getViewData();
    var alertMessage = "0";
    if (viewData.numItems > 0) {
        var basketTotal = viewData.totals;
        alertMessage = alertImportExceeded(alertMessage,basketTotal);
        viewData.alertMessage = alertMessage;
    }
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
