(function($) {
    $('.scrollTo-link').click(function (e) {
        e.preventDefault();
        if($(this).attr('data-to') !== undefined) {
            let speed = ($(this).attr('data-speed') === undefined) ? 500 : $(this).attr('data-speed');
            $.scrollTo($(this).attr('data-to'),speed);
        }
    });

    $('.js-part-world__switch').click(function () {
        if(!$(this).hasClass('part-world__switch--collapse')) {
            $.scrollTo('#block-views-block-contacts-block-2',500);
        }
    });

})(jQuery);