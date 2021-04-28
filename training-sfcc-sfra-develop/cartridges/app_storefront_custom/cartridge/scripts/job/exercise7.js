'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLIndentingStreamWriter');
var logger = require('dw/system/Logger');

/**
 * generate a payments element with all the payment methods used in the order
 * @param {dw.util.Collection} payments - the list of payment methods used in the order
 * @param {dw.io.XMLIndentingStreamWriter} streamWriter - the XML stream writer used for generate the XML file
 */
function createPaymentsElement(payments,streamWriter) {
    var paymentIterator = payments.iterator();
    streamWriter.writeStartElement('payments');
    while (paymentIterator.hasNext()) {
        var payment = paymentIterator.next();
        streamWriter.writeStartElement('payment');
        streamWriter.writeCharacters(payment.getPaymentMethod());
        streamWriter.writeEndElement();
    }
    streamWriter.writeEndElement();
}

/**
 * generate an items element with all the products included in the order
 * @param {dw.util.Collection} items - the list of products included in the order
 * @param {dw.io.XMLIndentingStreamWriter} streamWriter - the XML stream writer used for generate the XML file
 */

function createItemsElement(items,streamWriter) {
    var itemIterator = items.iterator();
    streamWriter.writeStartElement('items');
    while (itemIterator.hasNext()) {
        var item = itemIterator.next();
        streamWriter.writeStartElement('item');
        streamWriter.writeStartElement('itemID');
        streamWriter.writeCharacters(item.getProductID());
        streamWriter.writeEndElement();
        streamWriter.writeStartElement('itemName');
        streamWriter.writeCharacters(item.getProduct().getName());
        streamWriter.writeEndElement();
        streamWriter.writeEndElement();
    }
    streamWriter.writeEndElement();
}

/**
 * generate an order element in the XML file
 * @param {dw.order.Order} order - an order
 * @param {dw.io.XMLIndentingStreamWriter} streamWriter - the XML stream writer used for generate the XML file
 */
function createOrderElement(order,streamWriter) {
    streamWriter.writeStartElement('order');
    // Order number
    streamWriter.writeStartElement('orderNo');
    streamWriter.writeCharacters(order.orderNo);
    streamWriter.writeEndElement();
    // Customer name
    streamWriter.writeStartElement('customerName');
    streamWriter.writeCharacters(order.getCustomerName());
    streamWriter.writeEndElement();
    // Customer number
    streamWriter.writeStartElement('customerNumber');
    streamWriter.writeCharacters(order.getCustomerNo());
    streamWriter.writeEndElement();
    // Customer email
    if (order.getCustomerEmail()) {
        streamWriter.writeStartElement('customerEmail');
        streamWriter.writeCharacters(order.getCustomerEmail());
        streamWriter.writeEndElement();    
    }
    // Order date created
    streamWriter.writeStartElement('orderDateCreated');
    streamWriter.writeCharacters(order.getCreationDate());
    streamWriter.writeEndElement();
    // Order total amount
    streamWriter.writeStartElement('orderTotalAmount');
    streamWriter.writeCharacters(order.getMerchandizeTotalGrossPrice());
    streamWriter.writeEndElement();
    // List of payments
    createPaymentsElement(order.getPaymentInstruments(),streamWriter);
    // List of items
    createItemsElement(order.getProductLineItems(),streamWriter);
    streamWriter.writeEndElement();
}

/**
 * generate an order file which lists the orders still not exported
 * @param {string} args - the parameters sent by a job
 */
function exportOrders(args) {
    try {
        // Create the file in the dest folder selected in the job
        var destFile = args.get('destFolder') + File.SEPARATOR + "exercise7.xml";
        var ordersFile = new File(destFile);
        var fileWriter = new FileWriter(ordersFile,'UTF-8');
        var xmlSW = new XMLStreamWriter(fileWriter);
        // Create the XML header
        xmlSW.writeStartDocument("UTF-8", "1.0");
        xmlSW.writeStartElement('orders');
        // Retrieve the orders which have not been exported yet
        var queryOrders = "exportStatus = " + Order.EXPORT_STATUS_READY + " OR exportStatus = " + Order.EXPORT_STATUS_NOTEXPORTED;
        var querySort = "orderNo desc";
        var orders = OrderMgr.searchOrders(queryOrders,querySort);        
        while (orders.hasNext()) {
            var order = orders.next();
            createOrderElement(order,xmlSW)
        }
        // Closing the XML
        xmlSW.writeEndElement();
        xmlSW.writeEndDocument();
    } catch(err) {
        logger.error('ERROR!! >> '+ err);
    } finally {
        if (orders) {
            orders.close();
        }
        xmlSW.flush();
        fileWriter.flush();
        xmlSW.close();
        fileWriter.close();
    }
}

module.exports = {
    exportOrders: exportOrders
}