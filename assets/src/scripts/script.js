$(function () {
    // stick floating ads
    $(".floating-ads").stick_in_parent({
        offset_top: 50
    });

    // trigger alm 
    almInitialize ();
    // Navigation
    $('.hamburger').on('click', function () {
        let $this = $(this);
        if($this.hasClass('opened')) {
            $this.removeClass('opened');
        } else {
            $this.addClass('opened');
        }
    })

    $('.toggle-comments').on('click', function (ev) {
        ev.preventDefault();
        let $this = $('.comments-main');
        if($this.hasClass('opened')) {
            $this.removeClass('opened');
        } else {
            $this.addClass('opened');
        }
    })
})

function almInitialize () {
    let timesALMisTriggered = 0;

    let $window = $(window);
    let $document = $(document);
    let offset = 0;
    let bottomReached = false;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function checkToTriggerALM() {
        let $appendAfter = $('.post-content');
        
        if (isMobile) {
            if ($window.scrollTop() + $window.height() + offset >= $appendAfter.height() + $appendAfter.offset().top - window.visualViewport.height && !bottomReached) {
                apppendContent($appendAfter);
                bottomReached = true;
                debounce();
            }
        } else {
            if ($window.scrollTop() + $window.height() + offset >= $appendAfter.height() +$appendAfter.offset().top && !bottomReached) {
                apppendContent($appendAfter);
                bottomReached = true;
                debounce();
            }
        }
    }

    function debounce () {
        setTimeout(function () {
            bottomReached = false;
            checkToTriggerALM();
        }, 300)
    }


    function apppendContent ($appendAfter) {
        if (timesALMisTriggered < 5) {
            $.getJSON( "./data.json", function( data ) {
                timesALMisTriggered++;
                // window.scrollTo(0, $appendAfter.offset().top+$appendAfter.height())
                $appendAfter.append(data.html);
            });
        }
    }

    $window.on('scroll', function () {
        checkToTriggerALM();
    })
}
