window.jQuery = window.$ = require('jquery');
var processInclude = require('./util');

$(document).ready(function () {
    processInclude(require('../../../../../app_storefront_base/cartridge/client/default/js/main'));
    //processInclude(require('./components/test'));
    processInclude(require('slick-carousel/slick/slick'));
    processInclude(require('./exercise7/exercise7'));
});