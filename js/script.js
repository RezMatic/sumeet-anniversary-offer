
$(document).ready(function() {
    var bannerSlider = new Swiper ('.bannerSlider', {
        speed: 1000,
        loop: true,
        spaceBetween : 0,
        //effect: 'fade',
        autoplay: {
          delay: 4000,
        },
      })

      bannerSlider.on('slideChange', function () {
        if(bannerSlider.realIndex === 0) {
          $(".parisianLogo").css({"background-color" : "#a57b60"})
        }
        if(bannerSlider.realIndex === 1) {
          $(".parisianLogo").css({"background-color" : "#67222e"})
        }
        if(bannerSlider.realIndex === 2) {
          $(".parisianLogo").css({"background-color" : "#674624"})
        }
      });

      var exploreSlider = new Swiper('.exploreSlider', {
        slidesPerView :1.5,
        speed: 1000,
        centeredSlides : true,
        loop : true,
        simulateTouch : true,
        spaceBetween : 0,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
           el: '.swiper-pagination',
           clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 1.3,
          },
          480: {
            slidesPerView: 1.5,
          }
        }
      });

    // tab section
    $(".mobileTab ul li").click(function(){
      $(".mapViewTab").removeClass("active");
      $(".listViewTab").removeClass("active");
      $(".mobileTab ul li").removeClass("active");
      
      if ($(this).hasClass("listView")) {
          $(this).addClass("active");
          $(".listViewTab").addClass("active");
      }

      if ($(this).hasClass("mapView")) {
          $(this).addClass("active");
          $(".mapViewTab").addClass("active");
      }
  });

});