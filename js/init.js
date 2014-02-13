$(function() {

    $('.js-toggle-font-settings').on('click', function(e) {
        $('.js-font-settings').toggleClass('hidden');
        e.preventDefault? e.preventDefault() : e.returnValue = false;
    });    

});