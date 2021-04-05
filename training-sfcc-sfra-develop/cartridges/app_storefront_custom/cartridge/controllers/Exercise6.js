'use strict';

var server = require('server');

server.get('Show',function(req,res,next) {
    res.render('pt_service');
    next();
});

module.exports = server.exports();