'use strict';

module.exports = {
    exercise7: function () {
        $('.exercise7-slide-main').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.exercise7-slide-nav'
          });
        $('.exercise7-slide-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.exercise7-slide-main',
            dots: true,
            centerMode: true,
            focusOnSelect: true
        });        
    }
};