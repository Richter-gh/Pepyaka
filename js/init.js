$.fn.dTabs = function() {
    var _this = $(this),
        tabs = _this.children('li');

    tabs.on('click', function() {
        tabs.removeClass('active');
        $(this).addClass('active');
    });

    return this;
};

$.fn.dTextareaSelectAll = function() {
    var _this = this;

    $(_this).off('focus.select').one('focus.select', function() {
        setTimeout(function() {
            _this.select();
        }, 0);
    });

    return this;
}

function loadScript(path, callback, errorCallback) {
    var done = false,
        script = document.createElement('script');

    script.onload = function() {
        if (!done) {
            done = true;
            callback && callback();
        }
    };

    script.onreadystatechange = function() {
        if (!done && (script.readyState === 'complete' || script.readyState === 'loaded')) {
            done = true;
            callback && callback();
        }
    };

    script.onerror = function() {
        if (!done) {
            done = true;
            errorCallback && errorCallback();
        }
    };

    script.async = true;
    script.src = path;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(script, s);
}

function pepFormController() {
    var pepGeneratorBlock = $('.js-pepyaka-generator');

    if (!pepGeneratorBlock.length) return;

    var pepInput = pepGeneratorBlock.find('.js-main-text-input');

    pepInput.on('change blur input keyup cut', function(e) {
        if (pepInput[0].value !== '') {
            pepGeneratorBlock.removeClass('is-empty');
        }
        else {
            pepGeneratorBlock.addClass('is-empty');
        }
    });
}

function pepGifFormController() {
    var pepGifGeneratorBlock = $('.js-pepyaka-gif-generator');

    if (!pepGifGeneratorBlock.length) return;

    var pepInput = pepGifGeneratorBlock.find('.js-main-text-input'),
        pepFontCheckboxes = pepGifGeneratorBlock.find('.js-font-checkbox'),
        randomizeButton = pepGifGeneratorBlock.find('.js-randomize-text'),
        previewBlock = pepGifGeneratorBlock.find('.js-preview'),
        showCodeButtons = pepGifGeneratorBlock.find('.js-show-code'),
        codeOutputArea = pepGifGeneratorBlock.find('.js-code-output'),
        val = pepInput[0].value,
        lastVal = '',
        fonts = [],
        picArr = [],
        activeMarkup = 'html',
        localStorageAvailable = !!window.localStorage,
        isSingleFontSelected = false;

    if (localStorageAvailable && localStorage.getItem('fonts-'+siteOptions.lang)) {
        fonts = JSON.parse(localStorage.getItem('fonts-'+siteOptions.lang));

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

        if (fonts.length != 1) {
            pepGifGeneratorBlock.removeClass('is-single-font-selected');
            isSingleFontSelected = false;
        }
        else {
            pepGifGeneratorBlock.addClass('is-single-font-selected');
            isSingleFontSelected = true;
        }

        if (localStorageAvailable) localStorage.setItem('fonts-'+siteOptions.lang, JSON.stringify(fonts));

        getLetters(true);
        showCode();
    }).change();

    pepInput.on('change blur input keyup cut', function(e) {
        if (val != pepInput[0].value || e.keyCode == 13) {
            getLetters(e.keyCode == 13);
            showCode();
        }
    });

    randomizeButton.on('click', function() {
        getLetters(true);
        showCode();
    });

    showCodeButtons.on('click', function() {
        activeMarkup = $(this).attr('data-markup');

        showCode();
    });

    function showCode() {
        codeOutputArea[0].value = Pepyaka.generateMarkup(picArr, {
            markupName: activeMarkup,
            includeLink: true,
            includeDomain: true
        });

        codeOutputArea.dTextareaSelectAll();
    }

    function getLetters( regenerate ) {
        var i, _i, pos1, pos2, part1, part2, length1, length2, maxPos1, maxPos2, lastLength, max1, max2;
        val = pepInput[0].value;
        if( regenerate ){
            picArr = Pepyaka.getGifs(val, fonts);
        }else{
            if( lastVal !== val ){
                if( val.length === lastVal.length ){
                    for( i = 0, _i = lastVal.length; i < _i; i++ )
                        if( lastVal.charAt(i) !== val.charAt(i) )
                            picArr[i] = Pepyaka.getGifs(val.charAt(i), fonts)[0];
                }else{
                    part1 = '';
                    part2 = lastVal;
                    length1 = 0;
                    lastLength = length2 = lastVal.length;

                    max1 = 0;
                    max2 = 0;
                    maxPos1 = 0;
                    maxPos2 = 0;
                    for( i = 0, _i = lastLength + 1; i < _i;
                         i++,
                             part1 += part2.charAt(0),
                             part2 = part2.substr(1),
                             length1++,
                             length2--
                        ){

                        if( i > 0 ){
                            pos1 = val.indexOf(part1);
                            pos1 === -1 && (pos1 = false);
                        }else
                            pos1 = false;

                        if( i < _i - 1 ){
                            pos2 = val.indexOf(part2,pos1!==false?pos1+length1:0);
                            pos2 === -1 && (pos2 = false);
                        }else
                            pos2 = false;
                        if( pos1 === false || pos2 === false || pos1+length1 < pos2 ){
                            if( pos1 !== false && length1 > max1 ){
                                max1 = length1;
                                maxPos1 = pos1;
                            }
                            if( maxPos2 < maxPos1 + max1 ){
                                max2 = false;
                            }
                            if( pos2 !== false && length2 > max2 ){
                                max2 = length2;
                                maxPos2 = pos2;
                            }
                        }
                        if( max1 + max2 >= lastLength )
                            break;

                    }
                    if(max1 + max2 > lastLength){ // case where we have an intersection and length of part1+part2 > length of last value
                        maxPos2 += max2;
                        max2 = _i - max1 - 1;
                        maxPos2 -= max2;
                    }
                    if( max1 > 0 || max2 > 0 ){
                        var combo = [];
                        combo.push( Pepyaka.getGifs( val.substr(0, maxPos1 > 0 ? maxPos1 : (maxPos2 > 0 && max1 == 0 ? maxPos2 : 0)), fonts ) );

                        if( max1 > 0 ){
                            combo.push( picArr.slice( 0, max1 ) );
                            combo.push( Pepyaka.getGifs( max2 > 0 ? val.substr(maxPos1+max1, maxPos2-maxPos1-max1) : val.substr(maxPos1+max1), fonts ) );
                        }
                        if( max2 > 0 ){
                            combo.push( picArr.slice( picArr.length - max2 ) );
                            combo.push( Pepyaka.getGifs( val.substr( maxPos2 + max2), fonts ) );
                        }
                        picArr = Array.prototype.concat.apply([], combo);
                    }else{
                        picArr = Pepyaka.getGifs(val, fonts);
                    }
                }
            }
        }
        lastVal = val;

        previewBlock.html(Pepyaka.generateMarkup(picArr));
    }
};

function pepCssFormController() {
    var pepCssGeneratorBlock = $('.js-pepyaka-css-generator');

    if (!pepCssGeneratorBlock.length) return;

    var browserSupport = !window.Modernizr || Modernizr.textshadow && Modernizr.cssanimations && Modernizr.csstransforms,
        pepInput = pepCssGeneratorBlock.find('.js-main-text-input'),
        previewBlock = pepCssGeneratorBlock.find('.js-preview'),
        codeOutputArea = pepCssGeneratorBlock.find('.js-code-output'),
        val = pepInput[0].value,
        asyncInput = pepCssGeneratorBlock.find('[name="async"]'),
        smoothInput = pepCssGeneratorBlock.find('[name="smooth"]'),
        pepClasses = '',
        oldRand,
        options = {
            async: true,
            smooth: false
        };

    if (!browserSupport) pepCssGeneratorBlock.addClass('is-error');

    /* for the glory of JekPot! (https://twitter.com/JekPot) */
    function antiJekpotRandom(min, max, old) {
        var rand = Math.floor((Math.random()*(max-min+1))+min);

        /* sick recursion! */
        return (rand == old?antiJekpotRandom(min, max, old):rand);
    }

    function redraw() {
        var result = '',
            classes = ['pepyaka'];

        if (options.smooth) classes.push('smooth');

        val = pepInput[0].value;

        for (var i = 0; i < val.length; i++) {
            var rand,
                asyncClass = '';

            if (options.async) {
                rand = antiJekpotRandom(0, 7, oldRand);
                asyncClass = ' class="pep'+rand+'"';
                oldRand = rand;
            }

            result += '<span' + asyncClass + '>' + (val[i]==' '?'&nbsp;':val[i]) + '</span>';
        }

        result = '<span class="' + classes.join(' ') + '">' + result + '</span>';

        //if (!result) result = '<i class="icon-bug"></i>';

        if (browserSupport) previewBlock.html(result);
        codeOutputArea[0].value = result;
        codeOutputArea.dTextareaSelectAll();
    }

    pepInput.on('change blur input keyup cut', function() {
        if (val != pepInput[0].value) redraw();
    })
    
    asyncInput.on('change', function() {
        options.async = !options.async;
        redraw();
    });

    smoothInput.on('change', function() {
        options.smooth = !options.smooth;
        redraw();
    });
}

/* sum options */
var siteOptions = {};
siteOptions.lang = document.getElementsByTagName('html')[0].getAttribute('lang') || 'ru';
siteOptions.path = Pepyaka.o.path = (siteOptions.lang !== 'ru'? siteOptions.lang + '/' : '');

$(function() {
    var body = document.getElementsByTagName('body')[0],
        pepFallbackForm = $('.js-pepyaka-fallback-form'),
        pepFallbackFormElements = $('[form="pepyaka_fallback_form"]'),
        pepInput = $('.js-main-text-input'),
        title = $('.js-title'),
        titleText = title.attr('data-title');

    pepFallbackFormElements.removeAttr('form');
    pepFallbackForm.remove();

    title.html(Pepyaka.generateMarkup(Pepyaka.getGifs(titleText), {includeLink: true})).removeClass('nojs');

    pepFormController();
    pepGifFormController();
    pepCssFormController();

    /* focus input on big screens */
    if (!window.matchMedia ||
        (window.matchMedia('(min-width: 64em)').matches && window.matchMedia('(min-height: 42em)').matches)) {
        pepInput.focus();
    }

    $('.js-tabs').dTabs();

    /* prevent focus after mouse clicks */  
    body.addEventListener('mouseup', function(event) {
        setTimeout(function() {
            var activeElement = document.activeElement;

            if ((activeElement.tagName == 'BUTTON' ||
            (activeElement.tagName == 'INPUT' &&  activeElement.getAttribute('type') == 'checkbox') ||
            activeElement.getAttribute('tabindex'))) {
                $(activeElement).addClass('is-mouse-clicked').on('blur', function(){
                    $(activeElement).removeClass('is-mouse-clicked');
                });
            }
        }, 0);
    });

    /* SOCIAL AND METRIKA */
    $(window).load(function() { /* loading this crap after everything else*/
        $('.js-share').addClass('is-active');

        /* yandex share plugin */
        loadScript('http://yandex.st/share/share.js');

        /* yandex metrika */
        (window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || []).push(function() {
            try {
                window.yaCounter167628 = new Ya.Metrika({id:167628});
            }
            catch(e) {}
        });
        loadScript('http://mc.yandex.ru/metrika/watch.js');
    });
});