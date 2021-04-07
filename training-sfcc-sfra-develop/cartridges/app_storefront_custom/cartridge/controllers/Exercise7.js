'use strict';

var server = require('server');

server.get('Show',function(req,res,next) {
    res.render('exercise7');
    next();
})

module.exports = server.exports();