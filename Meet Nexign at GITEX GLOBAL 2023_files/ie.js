(function ($) {
    $(document).ready(function () {
        let ua = window.navigator.userAgent;
        let isIE = /MSIE|Trident/.test(ua);
        if(isIE) {
            $('.header nav > ul.menu > li').each(function () {
                $(this).find('> ul.menu').css('margin-left','-' + $(this).width() + 'px');
            });
        }
    });
})(jQuery);

