$.fn.pepInputController = function() {
    var _this = $(this),
        generatorBlock = $('.js-pepyaka-generator'),
        previewBlock = $('.js-preview'),
        val = _this[0].value;

    _this.on('change blur input keydown', function(e) {
        var _this = $(this);

        if (_this[0].value !== '') {
            generatorBlock.removeClass('no-text');
        }
        else {
            generatorBlock.addClass('no-text');
        }

        if (val != _this[0].value || e.keyCode == 13) {
            getGifs();
        }
    });

    function getGifs() {
        val = _this[0].value;

        previewBlock.html(Pepyaka.generateMarkup(Pepyaka.getGifs(val)));
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

    pepInput.pepInputController();
    pepInput.focus();
});