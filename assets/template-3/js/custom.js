jQuery(document).ready(function () {
    "use strict";
    jQuery(".animated").each(function () {
        jQuery(this).imagesLoaded(function () {
            var windowWidth = jQuery(window).width();
            if (windowWidth >= 960) {
                jQuery(this).waypoint(
                    function (direction) {
                        var animationClass = jQuery(this).data("animation");
                        jQuery(this).addClass(animationClass, direction === "down");
                    },
                    { offset: "100%" }
                );
            }
        });
    });
    var parallaxSpeed = 0.5;
    if (jQuery(window).width() > 1200) {
        parallaxSpeed = 0.7;
    }
    jQuery(".parallax").each(function () {
        var parallaxObj = jQuery(this);
        jQuery(this).jarallax({
            zIndex: 0,
            speed: parallaxSpeed,
            onCoverImage: function () {
                parallaxObj.css("z-index", 0);
            },
        });
    });
    jQuery(".rev_slider_wrapper.fullscreen-container").each(function () {
        jQuery(this).append('<div class="icon-scroll"></div>');
    });
    if (jQuery(".one.fullwidth.slideronly").length > 0) {
        jQuery("body").addClass("overflow_hidden");
    }
});
