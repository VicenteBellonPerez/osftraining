'use strict';

var server = require('server');

server.get('Show',function(req,res,next) {
    res.render('exercise8');
    next();
})

module.exports = server.exports();