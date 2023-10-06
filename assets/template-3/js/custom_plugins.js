jQuery.fn.center = function () {
    this.css("left", (jQuery(window).width() / 2) - (this.outerWidth() / 2));
    return this
}