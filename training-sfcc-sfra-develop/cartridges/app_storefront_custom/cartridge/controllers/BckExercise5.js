'use strict';
var server = require('server');

server.get('Show',function (req, res, next) {
    var form = server.forms.getForm('bck_exercise5');
    form.clear();
    res.render('newsletter/newsletterForm',{form:form});
    next();
});

server.post('Subscribe', function(req,res,next) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');
    var CouponMgr = require('dw/campaign/CouponMgr');
    var Transaction = require('dw/system/Transaction');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    var form = server.forms.getForm('bck_exercise5');

    if (form.valid) {
        // Get the form values
        var email = form.newsletterEmail.value;
        var firstName = form.newsletterFirstName.value;
        var lastName = form.newsletterLastName.value;
        var newsletterObj = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            form: form,
        };
        res.setViewData(newsletterObj);
        this.on('route:BeforeComplete', function (req,res) { // eslint-disable-line no-shadow
            var newsletterForm = res.getViewData('newsletterObj');
            var processResult;
            Transaction.wrap(function () {
                // Query if the same email had been registered before
                var newsletterSubscription = CustomObjectMgr.getCustomObject('NewsletterSubscription',newsletterForm.email);

                // Email already registered, no action needed
                if (newsletterSubscription) {
                    processResult = "EmailRegistered";
                    newsletterForm.form.clear();
                }
                // Email not registered, proceed
                else {
                    processResult = "EmailNotRegistered";
                    // Register a new CO
                    newsletterSubscription = CustomObjectMgr.createCustomObject('NewsletterSubscription',newsletterForm.email);
                    newsletterSubscription.custom.FullName = newsletterForm.firstName + " " + newsletterForm.lastName;
                    // Get the coupon
                    var coupon = CouponMgr.getCoupon('bckExercise5Coupon');
                    var couponCode = coupon.getNextCouponCode();
                    var newsletterEmailObj = {
                        emailHeader : Resource.msgf('newsletter.email.header', 'homePage', null, newsletterForm.firstName)
                    };

                    if (couponCode) {
                        // There are coupon codes available to apply 
                        newsletterEmailObj.couponText = Resource.msg('newsletter.join.text.coupon.assigned', 'homePage', null);
                        newsletterEmailObj.couponCode = Resource.msgf('newsletter.join.text.coupon.code', 'homePage', null, couponCode);
                        // Assign the coupon code retrieved to the CO
                        newsletterSubscription.custom.couponCode = couponCode;
                    }
                    else {
                        // No more coupon codes available
                        newsletterEmailObj.couponText = Resource.msg('newsletter.join.text.coupon.not.available', 'homePage', null);
                    }
                    var emailObj = {
                        to: newsletterForm.email,
                        subject: Resource.msg('newsletter.email.subject', 'homePage', null),
                        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
                        type: emailHelpers.emailTypes.registration
                    };
                    emailHelpers.sendEmail(emailObj, 'email/newsletterEmailTemplate', newsletterEmailObj); 
                }
            });
            res.render('newsletter/newsletterForm',{processResult: processResult});
        });
    }
    return next();
});

module.exports = server.exports();
