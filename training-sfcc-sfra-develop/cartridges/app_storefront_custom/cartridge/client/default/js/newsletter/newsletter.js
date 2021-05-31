'use strict';

/**
 * appends params to a url
 * @param {string} url - Original url
 * @param {Object} params - Parameters to append
 * @returns {string} result url with appended parameters
 */
 function appendToUrl(url, params) {
    var newUrl = url;
    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return newUrl;
}

/**
 * re-renders the newsletter form and its error message
 * @param {Object} message - Error message to display
 */
 function createErrorNotification(message) {
    var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
        'fade show" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' + message + '</div>';

    $('.newsletter-error').append(errorHtml);
}

/**
 * re-renders the newsletter form and its success message
 * @param {Object} message - success message to display
 */
 function createSuccessNotification(message) {
    var successHtml = '<div class="success alert-success-text  fade show">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' + message + '</div>';

    $('.newsletter-success').append(successHtml);
}

/**
 * renders the error message for each of the form fields
 * @param {Object} message - Error message to display
 */
function createErrorFormFields(message) {
    
    if (message.errorEmailMessage) {
        $('#newsletterEmail').addClass('formFieldErrorMark');
        $('.invalid-feedback-email').empty().append(message.errorEmailMessage);
    }
    
    if (message.errorFirstNameMessage) {
        $('#newsletterFirstName').addClass('formFieldErrorMark');
        $('.invalid-feedback-firstName').empty().append(message.errorFirstNameMessage);
    }
    
    if (message.errorLastNameMessage) {
        $('#newsletterLastName').addClass('formFieldErrorMark');
        $('.invalid-feedback-lastName').empty().append(message.errorLastNameMessage);
    }
}

/**
 * clears all error messages associated with the form fields
 */
function clearErrorMessages() {
    $('.invalid-feedback-email').empty();
    $('#newsletterEmail').removeClass('formFieldErrorMark');
    $('.invalid-feedback-firstName').empty();
    $('#newsletterFirstName').removeClass('formFieldErrorMark');
    $('.invalid-feedback-lastName').empty();
    $('#newsletterLastName').removeClass('formFieldErrorMark');
}

module.exports = function () {
    $('body').on('click', '.subscribe-newsletter', function (e) {
        e.preventDefault();
        clearErrorMessages();
        var actionUrl = $(this).data('action');
        var email = $('#newsletterEmail').val();
        var firstName = $('#newsletterFirstName').val();
        var lastName = $('#newsletterLastName').val();
        var $newsletterConfirmBtn = $('.newsletter-confirmation-btn');
    
        $newsletterConfirmBtn.data('action', actionUrl);
        $newsletterConfirmBtn.data('email', email);
        $newsletterConfirmBtn.data('firstName', firstName);
        $newsletterConfirmBtn.data('lastName', lastName);
    
    });

    $('body').on('click', '.newsletter-confirmation-btn', function (e) {
        e.preventDefault();

        var url = $(this).data('action');
        var email = $(this).data('email');
        var firstName = $(this).data('firstName');
        var lastName = $(this).data('lastName');
        var urlParams = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        url = appendToUrl(url, urlParams);

        $('body > .modal-backdrop').remove();

        $.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                $.spinner().stop();
                createSuccessNotification(data.welcomeText);
                window.location.href = data.urlHome;
            },
            error: function (err) {
                if (err.responseJSON.errorValidationFieldsMessage) {
                    createErrorFormFields(err.responseJSON.errorValidationFieldsMessage);
                }
                else {
                    createErrorNotification(err.responseJSON.errorMessage);
                }
                $.spinner().stop();
            }
        });
    });    
}
