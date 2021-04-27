'use strict';

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var logger = require('dw/system/Logger');
var XMLStreamWriter = require('dw/io/XMLIndentingStreamWriter');
var ProductMgr = require('dw/catalog/ProductMgr');

/**
 * generate a new catalog file which assigns the products which belongs to a particular brand to a category
 * @param {string} args - the parameters sent by a job
 */
function generateCatalogFile(args) {

    var catalogPath = File.TEMP + File.SEPARATOR + "exercise6Catalog.xml";
    var catalogFile = new File(catalogPath);
    var fileWriter = new FileWriter(catalogFile,'UTF-8');
    var xmlSW = new XMLStreamWriter(fileWriter);
    try {
        // Create the XML
        xmlSW.writeStartDocument("UTF-8", "1.0");
        xmlSW.writeStartElement('catalog');
        xmlSW.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/catalog/2006-10-31');
        xmlSW.writeAttribute('catalog-id', 'storefront-catalog-m-en');
        // Get the parameter brand from the job
        var brand = args.get('brand');
        // Get the products with a brand defined
        var products = ProductMgr.queryAllSiteProducts();
        while (products.hasNext()) {
            var product = products.next();
            if (product.brand == brand) {
                // Create an element
                xmlSW.writeStartElement('category-assignment');
                // Include the product in the category electronics-game-consoles
                xmlSW.writeAttribute('category-id','electronics-game-consoles');
                xmlSW.writeAttribute('product-id',product.ID);
                xmlSW.writeStartElement('primary-flag');
                xmlSW.writeCharacters('true');
                xmlSW.writeEndElement();
                xmlSW.writeEndElement();
            }
        }
        // Closing the XML
        xmlSW.writeEndElement();
        xmlSW.writeEndDocument();
    } catch (error) {
        logger.error('ERROR!! >> ' + error)
    } finally {
        xmlSW.flush();
        filewriter.flush();
        xmlSW.close();
        fileWriter.close();
    }
}

module.exports = {
    generateCatalogFile: generateCatalogFile
};