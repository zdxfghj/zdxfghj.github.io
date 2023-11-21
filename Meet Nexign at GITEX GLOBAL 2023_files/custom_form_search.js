Drupal.behaviors.custom_form_search = {
    attach: function (context, settings) {
        $('.custom-form-search').each(function (){
            let inputSearch = $(this).find('input[name="search"]'),
                submit = $(this).find('input[type="submit"]');

            function runSearch() {
                let value = inputSearch.val();
                value = value.split(' ').join('+');
                window.location = "/" + drupalSettings.path.currentLanguage + '/search?search=' + value;
            }

            inputSearch.keypress(function (e) {
                if (e.which === 13) {
                    runSearch();
                }
            });

            submit.click(function (){
                runSearch();
            });

            if(drupalSettings.path.currentPath === 'search') {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                let value = urlParams.get('search');

                if(value) {
                    value = value.split('+').join(' ');
                    inputSearch.val(value);
                }
            }
        });
    }
}
