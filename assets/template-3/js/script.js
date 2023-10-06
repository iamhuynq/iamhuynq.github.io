/*    =====================================
                   loader
     ====================================== */

     $(window).on("load", function () {
        "use strict";
        setTimeout(function () {
            $(".loader").fadeOut(800);
        }, 1000);
    
    });
    
    
    
    jQuery(function ($) {
        "use strict";
    
        $(".nav-link.scroll").on("click", function (event) {
            event.preventDefault();
            $("html,body").animate({
                scrollTop: $(this.hash).offset().top - 60}, 300);
        });
        /* =====================================
                       About sec js
         ====================================== */
    
        $('.about-sec .about-cards .ab-card').on('mouseover', function () {
            $('.about-sec .about-cards .ab-card:nth-child(3)').removeClass('active');
        });
        $('.about-sec .about-cards .ab-card').on('mouseleave', function () {
            $('.about-sec .about-cards .ab-card:nth-child(3)').addClass('active');
        });
        /* =====================================
                       Parallaxie js
         ====================================== */
    
        if ($(window).width() < 780) {
    
            $('.count-sec').addClass("parallax-disable");
            $('.timeline-sec').addClass("parallax-disable");
            $('.slide-sec').addClass("parallax-disable");
    
        } else {
            $('.count-sec').removeClass("parallax-disable");
            $('.timeline-sec').removeClass("parallax-disable");
            $('.slide-sec').removeClass("parallax-disable");
    
            // parallax
            $('.count-sec').parallaxie({
                speed: 0.5,
                offset: -250,
            });
            $('.timeline-sec').parallaxie({
                speed: 0.5,
                offset: -50,
            });
            $('.slide-sec').parallaxie({
                speed: 0.5,
                offset: -220,
            });
    
        }

        /* =====================================
                   image portfolio
         ====================================== */
    
        (function ($, window, document, undefined) {
            'use strict';
    
            // init cubeportfolio
            $('#js-grid-full-width').cubeportfolio({
                filters: '#js-filters-full-width',
                layoutMode: 'mosaic',
                sortByDimension: true,
                defaultFilter: '*',
                animationType: 'fadeOutTop',
                gapHorizontal: 0,
                gapVertical: 0,
                gridAdjustment: 'responsive',
                mediaQueries: [{
                    width: 1500,
                    cols: 6,
                }, {
                    width: 1100,
                    cols: 6,
                }, {
                    width: 800,
                    cols: 6,
                }, {
                    width: 480,
                    cols: 4,
                    options: {
                        caption: ' ',
                        gapHorizontal: 10,
                        gapVertical: 10,
                    }
                }],
                caption: 'zoom',
                displayType: 'fadeIn',
                displayTypeSpeed: 100,
    
                // lightbox
                lightboxDelegate: '.cbp-lightbox',
                lightboxGallery: true,
                lightboxTitleSrc: 'data-title',
                lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    
                plugins: {
                    loadMore: {
                        element: '#js-loadMore-full-width',
                        action: 'auto',
                        loadItems: 3,
                    }
                },
            });
        })(jQuery, window, document);
    
    
        /* =====================================
               timeline sec
         ====================================== */
    
        if ($(window).width() < 768) {
            $('.timeline-sec .timeline-block.simple-timeline').addClass('in-time');
            $('.timeline-sec .timeline-block.in-time').removeClass('simple-timeline');
            $('.timeline-sec .timeline-block.in-time').addClass('inverse-timeline');
        } else {
            $('.timeline-sec .timeline-block.in-time').removeClass('inverse-timeline');
            $('.timeline-sec .timeline-block.in-time').addClass('simple-timeline');
            $('.timeline-sec .timeline-block.simple-timeline').removeClass('in-time');
        }

        /*=====================================
    ============Slider js================
    =====================================*/
        if ($("#slider-sec").length) {
            var revapi4;
            revapi4 = jQuery("#rev_slider_1_1").show().revolution({
                sliderType: "standard",
                jsFileLocation: "//localhost/reveditor/revslider/public/assets/js/",
                sliderLayout: "fullscreen",
                dottedOverlay: "none",
                delay: 9000,
                snow: {
                    startSlide: "first",
                    endSlide: "last",
                    maxNum: "150",
                    minSize: "0.3",
                    maxSize: "6",
                    minOpacity: "0.3",
                    maxOpacity: "1",
                    minSpeed: "10",
                    maxSpeed: "100",
                    minSinus: "1",
                    maxSinus: "100",
                    hide_under: 767,
                },
                navigation: {
                    keyboardNavigation: "off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation: "off",
                    mouseScrollReverse: "default",
                    onHoverStop: "off",
                    touch:{
                        touchenabled:"on",
                        touchOnDesktop:"on",
                        swipe_threshold: 75,
                        swipe_min_touches: 1,
                        swipe_direction: "horizontal",
                        drag_block_vertical: false
                    },
                    arrows: {
                        style: "gyges",
                        enable: false,
                        hide_onmobile: true,
                        hide_under: 767,
                        hide_onleave: false,
                        tmp: '',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        enable: true,
                        hide_onmobile: true,
                        hide_under: 767,
                        style: "berex",
                        hide_onleave: false,
                        direction: "vertical",
                        h_align: "left",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0,
                        space: 5,
                        tmp: '<div class="tp-bullet-inner"></div><div class="tp-line"></div>'
                    }
                },
                visibilityLevels: [1240, 1024, 778, 480],
                gridwidth: [1140, 1024, 778, 480],
                gridheight: [700, 768, 960, 420],
                lazyType: "none",
                parallax: {
                    type: "mouse",
                    origo: "enterpoint",
                    speed: 400,
                    speedbg: 0,
                    speedls: 0,
                    levels: [2, 3, 5, 10, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50, 51, 55],
                    disable_onmobile: "on"
                },
                shadow: 0,
                spinner: "off",
                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                shuffle: "off",
                autoHeight: "off",
                fullScreenAutoWidth: "off",
                fullScreenAlignForce: "off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "",
                disableProgressBar: "on",
                hideThumbsOnMobile: "off",
                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                debugMode: false,
                fallbacks: {
                    simplifyAll: "off",
                    nextSlideOnWindowFocus: "off",
                    disableFocusListener: false,
                }
            });
            RsSnowAddOn(jQuery, revapi4);
        }
    });