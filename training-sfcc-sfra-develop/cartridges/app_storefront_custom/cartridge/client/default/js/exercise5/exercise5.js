'use strict';

var formValidation = require('../../../../../../app_storefront_base/cartridge/client/default/js/components/formValidation');
var scrollAnimate = require('../../../../../../app_storefront_base/cartridge/client/default/js/components/scrollAnimate');

function getStatesCountry() {
    return {
            "countries": [
                {"country":"US", 
                "states": [
                    {
                        "stateID":"AL",
                        "state":'Alabama'
                    },
                    {
                        "stateID":"AK",
                        "state":'Alaska'
                    }
                ]},
                {
                "country":"ES",
                "states": [
                    {
                        "stateID":"AC",
                        "state":'A Coruña'
                    },
                    {
                        "stateID":"LU",
                        "state":'Lugo'
                    },
                    {
                        "stateID":"OU",
                        "state":'Ourense'
                    },
                    {
                        "stateID":"PO",
                        "state":'Pontevedra'
                    }
                ]},
                {
                "country":"IT",
                "states": [
                    {
                        "stateID":"LZ",
                        "state":'Lazio'
                    }
                ]},
                {
                    "country":"JP",
                    "states": [
                        {
                            "stateID":"PA",
                            "state":'Prefectura A'
                        }
                ]},
                {
                    "country":"FR",
                    "states": [
                        {
                            "stateID":"PR",
                            "state":'Paris'
                        },
                        {
                            "stateID":"LY",
                            "state":'Lyon'
                        }                        
                ]},
                {
                    "country":"UK",
                    "states": [
                        {
                            "stateID":"LD",
                            "state":'London'
                        },
                        {
                            "stateID":"MC",
                            "state":'Manchester'
                        }                        
                ]}                                                
            ]
    };
}

module.exports = {
    exercise5: function () {
        $("#infoSecurity").click(function(e) {
            e.preventDefault();
            if ($("#infoSecurityTextP").length > 0) {
                $("#infoSecurityTextP").remove();
            }
            else {
                $("#infoSecurityText").after("<p id=\"infoSecurityTextP\">Insert the CVV code of the card you're using</p>");
            }
        });
        $("#infoEmail").click(function(e) {
            e.preventDefault();
            if ($("#infoEmailTextP").length > 0) {
                $("#infoEmailTextP").remove();
            }
            else {
                $("#infoEmailText").after("<p id=\"infoEmailTextP\">Insert an email address</p>");
            }
        });  
        $('#comment').keyup(function(e) {
            e.preventDefault();
            var chars = this.value.length;
            $('#remainChars').text(this.maxLength - chars);
        });  
        $('.back-to-top-exercise5').click(function (e) {
            e.preventDefault();
            scrollAnimate();
        });  
        $('#country').change(function(e) {
            e.preventDefault();
            //Borramos todas los estados previamente recuperados
            $("#state option").remove();
            var valueSelected = this.value;
            var statesCountries = getStatesCountry();
            $.each(statesCountries.countries,function(i,v) {
                if (valueSelected === v.country) {
                    $.each(v.states,function(i,st) {
                        $('#state').append("<option id="+st.stateID+">"+st.state+"</option>");
                    });
                }
                else {
                    console.log("SIGO BUSCANDO");
                }
            });
        });
        $('form.exercise5-form').submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr('action');
            $form.spinner().start();
            console.log($form.serialize);
            $('form.exercise5-form').trigger('exercise5:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    console.log(data);
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        location.href = data.redirectURL;
                    }
                },
                error: function (err) {
                    console.log('ERROR!');
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectURL;
                    }
                    $form.spinner().stop();
                }
            });
            return false;
        });
    }
};