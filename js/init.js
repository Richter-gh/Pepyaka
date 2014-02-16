pepFormController = function() {
    var pepInput = $('.js-main-text-input'),
        pepFontCheckboxes = $('.js-font-checkbox'),
        generatorBlock = $('.js-pepyaka-generator'),
        previewBlock = $('.js-preview'),
        val = pepInput[0].value,
        fonts = [];

    pepFontCheckboxes.on('change', function() {
        fonts = [];

        pepFontCheckboxes.each(function() {
            if (this.checked) fonts.push($(this).attr('name'));
        });

        getGifs();
    });

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
        }
    });

    function getGifs() {
        var picArr;

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