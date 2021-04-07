'use strict';

import 'slick-carousel';

$('.exercise7-slide-main').slick();
$('.exercise7-slide-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    centerMode: true,
    focusOnSelect: true,
    infinite: false,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            dots: true
          }
        },
        {
            breakpoint: 2048,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: false,
              dots: true
            }
        },        
        {
            breakpoint: 4196,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: false,
              dots: true
            }
        }
    ]
});
