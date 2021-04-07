'use strict';

var server = require('server');

var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');

function getStatesCountry() {
    return {
        "US": [
            {
                "stateID":"AL",
                "state":Resource.msg('state.us.alabama','forms',null)
            },
            {
                "stateID":"AK",
                "state":Resource.msg('state.us.alaska','forms',null)
            }
        ],
        "ES": [
            {
                "stateID":"AC",
                "state":Resource.msg('state.es.acoruna','forms',null)
            },
            {
                "stateID":"LU",
                "state":Resource.msg('state.es.lugo','forms',null)
            },
            {
                "stateID":"OU",
                "state":Resource.msg('state.es.ourense','forms',null)
            },
            {
                "stateID":"PO",
                "state":Resource.msg('state.es.pontevedra','forms',null)
            }
        ]
    };
}

function getDetailsObject(form) {
    return {
        cardNumber: form.cardNumber.value,
        expirationMonth: form.expirationMonth.value,
        expirationYear: form.expirationYear.value,
        securityCode: form.securityCode.value,
        email: form.email.value,
        saveCard: form.saveCard.value,
        form: form
    };
}

server.get('Show',function(req,res,next){
    var form = server.forms.getForm('exercise5');
    form.clear();
    form.saveCard.checked = true;
    var statesCountry = getStatesCountry();
    res.render('exercise5',{form:form,states:statesCountry});
    next();
});

server.post('Process',function(req,res,next){
    var form = server.forms.getForm('exercise5');
    var formJSON = getDetailsObject(form);
    if (form.valid) {
        res.json({
            success: "true",
            redirectURL: URLUtils.url('Exercise5-OK').toString(),
            formJSON: formJSON
        });
    }
    else {
        res.json({
            redirectURL: URLUtils.url('Exercise5-KO').toString(),
            formJSON: formJSON    
        })
    }
    //res.render('exercise5',{result:'Form filled!'})
    return next();
});

server.get('OK',function(req,res,next){
    res.render('exercise5ok');
    next();
});

server.get('KO',function(req,res,next){
    res.render('exercise5ko');
    next();
});


module.exports = server.exports();
