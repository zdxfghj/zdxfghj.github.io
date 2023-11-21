(function($, Drupal) {

    Drupal.webform = Drupal.webform || {};
    Drupal.webform.select2 = Drupal.webform.select2 || {};
    Drupal.webform.select2.options = Drupal.webform.select2.options || {};
    Drupal.webform.select2.options.width = Drupal.webform.select2.options.width || '100%';
    Drupal.webform.select2.options.widthInline = Drupal.webform.select2.options.widthInline || '50%';

    Drupal.behaviors.webform_default_select = {
        attach: function (context, settings) {

            if (!$.fn.select2) {
                return;
            }

            $('.webform-default select').once('init-select2-once').each(function () {
                let $select = $(this);
                let options = {};
                let containerCssClass = [];
                let dropdownCssClass = [];

                let selectActive = function (select) {
                    if(select.val()) {
                        select.parent('.js-form-type-select').addClass('active');
                    } else {
                        select.parent('.js-form-type-select').removeClass('active');
                    }
                };

                selectActive($select);
                $select.on('change', function () {
                    selectActive($(this));
                });

                if ($select.parents('.webform-element--title-inline').length) {
                    options.width = Drupal.webform.select2.options.widthInline;
                }
                options = $.extend(options, Drupal.webform.select2.options);
                if ($select.data('placeholder')) {
                    options.placeholder = $select.data('placeholder');
                    if (!$select.prop('multiple')) {
                        // Allow single option to be deselected.
                        options.allowClear = true;
                    }
                }
                if ($select.data('limit')) {
                    options.maximumSelectionLength = $select.data('limit');
                }

                // Remove required attribute from IE11 which breaks
                // HTML5 clientside validation.
                // @see https://github.com/select2/select2/issues/5114
                if (window.navigator.userAgent.indexOf('Trident/') !== false
                    && $select.attr('multiple')
                    && $select.attr('required')) {
                    $select.removeAttr('required');
                }

                if(!$select.hasClass('select-search')) {
                    options.minimumResultsForSearch = -1;
                }

                if($select.hasClass('error')) containerCssClass.push('error');
                if($select.hasClass('dropdown-bg-gray')) dropdownCssClass.push('dropdown-bg-gray');

                if(containerCssClass.length) {
                    options.containerCssClass = containerCssClass.join(' ');
                }

                if(dropdownCssClass.length) {
                    options.dropdownCssClass = dropdownCssClass.join(' ');
                }

                let $select2 = $select.select2(options);

                $select2.on("select2:open", function () {
                    $('.select2-results__options').niceScroll({
                        // autohidemode: false,
                        cursorcolor: "#00AD21",
                        cursorwidth: 2,
                        cursorborder: 'none',
                        cursoropacitymin: 0.2,
                    });
                    if($(this).hasClass('select-search')) {
                        document.querySelector('.select2-container--open .select2-search__field').focus();
                    }
                });

                $select2.on("select2:closing", function () {
                    $(this).trigger('focusout');
                });
            });
        }
    };

    Drupal.behaviors.webform_default_textarea = {
        attach: function (context, settings) {
            $('.webform-default textarea')
                .once('init-textarea-once')
                .each(function () {
                    autosize($(this));
                });
        }
    };

    Drupal.behaviors.select_trigger = {
        attach: function (context, settings) {
            $('select.select-trigger')
                .once('init-select-trigger-once')
                .each(function () {
                    selectTrigger($(this));
                });
        }
    };

    Drupal.behaviors.ajax_webform_autoload = {
        attach: function (context, settings) {
            $('.ajax-webform-autoload')
                .once('ajax-webform-autoload-once')
                .each(function () {
                    let id = $(this).attr('id');
                    if(id !== undefined) {
                        $('#' + id)[0].click();
                    }
                });
        }
    };

    Drupal.behaviors.form_error = {
        attach: function (context, settings) {
            $('form.form-error').find('input,textarea,select').each(function(){
                if($(this).hasClass('error')) $(this).parents('.form-item').addClass('form-item-error');
            });
        }
    }

    Drupal.behaviors.webform_field_animation = {
        attach: function (context, settings) {
            $('.webform-field-animation .js-form-type-textfield input, .webform-field-animation .js-form-type-email input, .webform-field-animation .js-form-type-textarea textarea').once('init-form-item-once').each(function () {
                let useAnim = true;
                let webformInputs = $(this);
                if(useAnim) {
                    webformInputs.on('change', function () {
                        isWebformInputsActiveAnim($(this));
                    });

                    webformInputs.hover(function () {
                        isWebformInputsActiveAnim($(this));
                    });

                    webformInputs.mouseout(function () {
                        isWebformInputsActiveAnim($(this), true);
                    });

                    webformInputs.on('focus', function () {
                        let self = $(this);
                        setTimeout(function() { isWebformInputsActiveAnim($(self)); }, 0);
                    });

                    webformInputs.on('blur', function () {
                        isWebformInputsActiveAnim($(this));
                    });

                    $(webformInputs).on('animationstart', function (e) {
                        switch (e.originalEvent.animationName) {
                            case 'autofill' :
                                activateInputs($(this));
                                break;
                        }
                    });

                    $(webformInputs).each(function () {
                        isWebformInputsActiveAnim($(this));
                    });
                }
            });
        }
    };

    function selectTrigger(select) {
        let form = select.attr('data-form-exposed');
        let selectChangeName = select.attr('data-select-change-name');

        if(form && selectChangeName) {
            select.on('change', function () {
                $('select[name="' + selectChangeName + '"]').val(select.val());
                $(form).find('input[type="submit"]').trigger('click');
            });
        }
    }

    function isWebformInputsActiveAnim(input, mouseout) {
        let isTextarea = input[0].type === 'textarea';
        if ((input.is(':hover') && !mouseout) || input.is(':focus') || input.val()) {
            isTextarea ? input.parent().prev('label').addClass('active') : input.prev('label').addClass('active');
        } else {
            isTextarea ? input.parent().prev('label').removeClass('active') :  input.prev('label').removeClass('active');
        }
        input.parents('.parent-active').removeClass('parent-active');
    }

    function activateInputs(input) {
        let isTextarea = input[0].type === 'textarea';
        isTextarea ? input.parent().prev('label').addClass('active') : input.prev('label').addClass('active');
    }

    function disableInputs(input) {
        let isTextarea = input[0].type === 'textarea';
        isTextarea ? input.parent().prev('label').removeClass('active') : input.prev('label').removeClass('active');
    }

})(jQuery, Drupal);


