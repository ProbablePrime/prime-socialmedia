'use strict';

$(function () {
    if(!nodecg.bundleConfig) {
        nodecg.log.error('cfg/' + nodecg.bundleName +' was not found. In the root of your nodecg installation' +
            'This file is where the settings for this bundle are stored ' +
            'Without these the bundle will not function. Check the bundle directory for an example'); 
    }
    
    // pass data straight into our function that handles it, preferred for simplicity
    nodecg.listenFor('socialmediaIn', showLinks);
    nodecg.listenFor('socialmediaOut', hideLinks);
    var popups = null;
    var i = 0;
    
    var showing = false;
    var nextSocial = null;

    var shouldShow = nodecg.Replicant('socialIntervalEnabled', {defaultValue: false});
    var gap = nodecg.Replicant('socialIntervalGapLength', {defaultValue: 1000 * 60 * 10});
    var holdTime = nodecg.Replicant('socialHoldTime', {defaultValue: 1000 * 4});

    shouldShow.on("change", function(oldValue,newValue){
        if(newValue) {
            queueNextLoop();
        } else {
            hideLinks();
            clearNextLoop();
        }
    });
    gap.on("change",function() {
        clearNextLoop();
        queueNextLoop();
    });

    
    $.ionSound({
        sounds: [           // set needed sounds names
            'socialmedia_in-v2',
            'socialmedia_out-v2'
        ],
        path: 'snd/',       // set path to sounds
        multiPlay: true,    // can play multiple sounds at once
        volume: '0.15'      // not so loud please
    });
    function init() {
        var source   = $("#social-template").html();
        var template = Handlebars.compile(source);
        console.log(window.nodecg.bundleConfig.socialLinks);
        $('#popup-container').html(template({
            social:window.nodecg.bundleConfig.socialLinks
        }));

        popups = $('.animate-popup');
    }


    function showLinks() {
        // play sound
        if(!showing) {
            $.ionSound.play('socialmedia_in-v2');
            // Animate Popup
            animatePopup();
        } else {
            console.log('already showing')
        }
    }

    function queueNextLoop() {
        console.log('queueing for' + gap.value);
        nextSocial = setTimeout(animatePopup, gap.value);
    }

    function clearNextLoop() {
        clearTimeout(nextSocial);
    }

    function animatePopup() {
        if (i >= popups.length) {
            i = 0;
        }
        showing = true;
        popups.eq(i).addClass("show-popup")
            .delay(holdTime.value)
            .queue(function() {
                $(this).removeClass("show-popup");
                $(this).dequeue();
                if (i == popups.length) {
                    showing = false;
                    queueNextLoop();
                } else {
                    animatePopup();
                }
            });
        i++;
    }

    function hideLinks() {
        if(showing) {
            $.ionSound.play('socialmedia_out-v2');
            $('.show-popup').removeClass('show-popup').finish();
            i = 0;
            //clearTimeout(nextSocial);
            showing = false;
        }
    }
    init();
});
