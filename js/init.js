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
            getGifs(e.keyCode == 13);
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
    var lastVal = '';
    function getGifs( regenerate ) {
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
                }else if( val.length > lastVal.length ){
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
                        //console.log(part1,part2,pos1,pos2)
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
                    if( max1 > 0 && max2 === 0 ){
                        picArr = Array.prototype.concat.apply([],[

                            maxPos1 > 0 ? Pepyaka.getGifs( val.substr(0, maxPos1), fonts ) : [],
                            maxPos1 > 0 ? picArr.slice( 0, max1 ) : [],
                            max1 > 0 && max2 > 0 ? (Pepyaka.getGifs( val.substr(maxPos1+max1, maxPos2-maxPos1-max1), fonts )) :
                                ( max1 > 0 ? Pepyaka.getGifs( val.substr(maxPos1+max1), fonts ) : []),
                            max2 > 0 ? picArr.slice( picArr.length - max2 ) : [],
                            max2 > 0 ? Pepyaka.getGifs( val.substr( maxPos2 + max2), fonts ) : [],
                        ]);

                    }else if( max2 > 0 && max1 === 0 ){
                        picArr = Array.prototype.concat.apply([],[
                            maxPos2 > 0 ? Pepyaka.getGifs( val.substr(0, maxPos2), fonts ) : [],
                            max2 > 0 ? picArr.slice( picArr.length - max2 ) : [],
                            max2 > 0 ? Pepyaka.getGifs( val.substr( maxPos2 + max2), fonts ) : [],
                        ]);
                    }else if( max1 > 0 && max2 > 0 ){
                        picArr = Array.prototype.concat.apply([],[
                            maxPos1 > 0 ? Pepyaka.getGifs( val.substr(0, maxPos1), fonts ) : [],
                            max1 > 0 ? picArr.slice( 0, max1 ) : [],
                            max1 > 0 && max2 > 0 ? (Pepyaka.getGifs( val.substr(maxPos1+max1, maxPos2-maxPos1-max1), fonts )) :
                                ( max1 > 0 ? Pepyaka.getGifs( val.substr(maxPos1+max1), fonts ) : []),
                            max2 > 0 ? picArr.slice( picArr.length - max2 ) : [],
                            max2 > 0 ? Pepyaka.getGifs( val.substr( maxPos2 + max2), fonts ) : [],
                        ]);
                    }else{
                        picArr = Pepyaka.getGifs(val, fonts);
                    }
                    //console.log(max1,max2,maxPos1,maxPos2)
                }else{
                    picArr = Pepyaka.getGifs(val, fonts);
                }

            }
        }
        lastVal = val;

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

/*
Pepyaka = {getGifs:function(a){ return a.split('').map(function(a){return [a];});}};
fonts = 8

var test = function(lastVal, val){
    picArr = Pepyaka.getGifs(lastVal)
    if( lastVal !== val ){
        if( val.length === lastVal.length ){
            for( i = 0, _i = lastVal.length; i < _i; i++ )
                if( lastVal.charAt(i) !== val.charAt(i) )
                    picArr[i] = Pepyaka.getGifs(val.charAt(i), fonts)[0];
        }else if( val.length > lastVal.length ){
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
                console.log(part1,part2,pos1,pos2)
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
                console.log(picArr)
                picArr = Array.prototype.concat.apply([],[
                    max1 > 0 ? Pepyaka.getGifs( val.substr(0, maxPos1), fonts ) : [],
                    max1 > 0 ? picArr.slice( maxPos1, max1 ) : [],
                    max1 > 0 && max2 > 0 ? (Pepyaka.getGifs( val.substr(maxPos1+max1, maxPos2-maxPos1-max1), fonts )) :
                        ( max1 > 0 ? Pepyaka.getGifs( val.substr(maxPos1+max1), fonts ) : []),
                    max2 > 0 ? picArr.slice( picArr.length - max2 ) : [],
                    max2 > 0 ? Pepyaka.getGifs( val.substr( maxPos1 + max1, maxPos2-maxPos1-max1-3), fonts ) : [],
                ])
                console.log(picArr)
            }else{
                picArr = Pepyaka.getGifs(val, fonts);
            }
            console.log(max1,max2,maxPos1,maxPos2)
        }else{
            picArr = Pepyaka.getGifs(val, fonts);
        }

    }
    if( picArr.join('') !== val )
        throw (picArr.join('') +'!='+ val)
    return picArr;
}
test('12345','127745');

test('123123','12377321');

test('12345','12772345');
test('12345','789719999');*/