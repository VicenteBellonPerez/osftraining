'use strict';

var server = require('server');
var ArrayList = require('dw/util/ArrayList');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ProductMgr = require('dw/catalog/ProductMgr');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var apiProductSearch = new ProductSearchModel();
    // Retrieve the product selected
    var viewData = res.getViewData();
    var productPDP = viewData.product;
    var product = ProductMgr.getProduct(productPDP.id);
    // Retrieve the product's category
    var category = product.variant ? product.masterProduct.primaryCategory : product.primaryCategory;
    // Set the category product's
    apiProductSearch.setCategoryID(category.ID);
    // Get the sort rule prices order from low to high and set it to the ProductSearchModel
    var sortingRule = CatalogMgr.getSortingRule("price-low-to-high");
    apiProductSearch.setSortingRule(sortingRule);
    // Searching products
    apiProductSearch.search();
    // Take the first 4 elements in the list
    var maxItems = 4;
    var index = 1;
    var productList = new ArrayList();
    var productIterator = apiProductSearch.products;
    while (productIterator.hasNext() && index <= maxItems) {
        var p = productIterator.next();
        // Controlling that the product retrieved is not the same as the selected previously
        // If the product selected is a variant type one, we must take the ID of the variant Master Product
        var productSelectedID = product.variant ? product.masterProduct.ID : product.ID;
        if (p.ID != productSelectedID) {
            productList.add1(p);
            index++;
        }
    }
    viewData.productSearchCategory = productList;
    res.setViewData(viewData);
    next();

});

module.exports = server.exports();
