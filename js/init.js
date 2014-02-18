pepFormController = function() {
    var pepForm = document.getElementsByClassName('js-pepyaka-generator');

    if (!pepForm.length) return;

    var pepInput = $('.js-main-text-input'),
        pepFontCheckboxes = $('.js-font-checkbox'),
        generatorBlock = $(pepForm[0]),
        previewBlock = $('.js-preview'),
        showCodeButtons = $('.js-show-code'),
        codeOutputArea = $('.js-code-output'),
        val = pepInput[0].value,
        fonts = [],
        picArr = [],
        activeMarkup = 'html',
        localStorageAvailable = !!window.localStorage;

    if (localStorageAvailable && localStorage.getItem('fonts')) {
        fonts = JSON.parse(localStorage.getItem('fonts'));

        pepFontCheckboxes.each(function() {
            var _this = this;

            if (fonts.indexOf(_this.name) !== -1) {
                _this.checked = true;
            }
        });
    }

    pepFontCheckboxes.on('change', function() {
        fonts = [];

        pepFontCheckboxes.each(function() {
            if (this.checked) fonts.push($(this).attr('name'));
        });

        if (localStorageAvailable) localStorage.setItem('fonts', JSON.stringify(fonts));

        getGifs();
        showCode();
    }).change();

    pepInput.on('change blur input keydown', function(e) {
        var pepInput = $(this);

        if (pepInput[0].value !== '') {
            generatorBlock.removeClass('no-text');
        }
        else {
            generatorBlock.addClass('no-text');
        }

        if (val != pepInput[0].value || e.keyCode == 13) {
            getGifs();
            showCode();
        }
    });

    showCodeButtons.on('click', function() {
        activeMarkup = $(this).attr('data-markup');

        showCode();

        codeOutputArea.focus();
    });

    function showCode(markup) {
        codeOutputArea.html(Pepyaka.generateMarkup(picArr, {
            markupName: activeMarkup,
            includeLink: true,
            includeDomain: true
        }));

        codeOutputArea.off('focus.select').one('focus.select', function() {
            var _this = this;
            
            setTimeout(function() {
                _this.select();
            }, 0);
        });
    }

    function getGifs() {
        val = pepInput[0].value;
        picArr = Pepyaka.getGifs(val, fonts);

        previewBlock.html(Pepyaka.generateMarkup(picArr));
    }
}

$(function() {

    $('.js-toggle-font-settings').on('click', function(e) {
        $('.js-font-settings').toggleClass('hidden');
    });

    var pepFallbackForm = $('.js-pepyaka-fallback-form'),
        pepFallbackFormElements = $('[form="pepyaka_fallback_form"]'),
        pepInput = $('.js-main-text-input'),
        title = $('.js-title');

    pepFallbackFormElements.removeAttr('form');
    pepFallbackForm.remove();

    title.html(Pepyaka.generateMarkup(Pepyaka.getGifs('Пепяка'), {includeLink: true})).removeClass('nojs');

    pepFormController();
    pepInput.focus();
});