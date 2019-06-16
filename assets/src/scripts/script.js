$(function () {
    $(".floating-ads").stick_in_parent({
        offset_top: 50
    });

    let timesALMisTriggered = 0;
    let $appendAfter = $('.post-content')

    let $window = $(window);
    let $document = $(document)
    let offset = 500
    let bottomReached = false;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    function checkToTriggerALM() {
        if (isMobile) {
            if ($window.scrollTop() + $window.height() + offset >= $document.height() - window.visualViewport.height && !bottomReached) {
                apppendContent()
                bottomReached = true;
                debounce()
            }
        } else {
            if ($window.scrollTop() + $window.height() + offset >= $document.height() && !bottomReached) {
                apppendContent()
                bottomReached = true;
                debounce()
            }
        }
    }

    function debounce () {
        setTimeout(function () {
            bottomReached = false;
            checkToTriggerALM()
        }, 300)
    }


    function apppendContent () {
        if (timesALMisTriggered < 5) {
            $.getJSON( "./data.json", function( data ) {
                timesALMisTriggered++
                $appendAfter.append(data.html)
            });
        }
    }

    $window.on('scroll', function () {
        checkToTriggerALM()
    })
})