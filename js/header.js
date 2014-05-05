(function(doc) {
    var tag = doc.getElementsByTagName('html')[0];

    function addClass(el, cl) {
        if ((' ' + el.className + ' ').indexOf(' ' + cl + ' ') === -1) {
            el.className = (el.className + ' ' + cl).replace(/^\s+|\s+$/g, '');
        }
    }

    function removeClass(el, cl) {
        el.className = (' ' + el.className + ' ').replace(' ' + cl + ' ', ' ').replace(/^\s+|\s+$/g, '');
    }

    removeClass(tag, 'no-js');
    addClass(tag, 'js');
})(document);