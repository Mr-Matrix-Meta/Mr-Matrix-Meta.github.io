// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });

    function getPreviewSrc($element) {
        return $element.attr('data-preview-src') || $element.attr('data-src') || $element.attr('src');
    }

    function isZoomableImage($element) {
        if ($element.hasClass('inline-badge')) {
            return false;
        }

        return $element.is('.figure-img, .rounded-circle, .lazy.w-100, .img-fluid.rounded-xl, .img-fluid.rounded-xl-top, .img-fluid.rounded-xl-bottom, .media img');
    }

    $(document).on('click', 'img', function (event) {
        var $image = $(this);
        if (!isZoomableImage($image)) {
            return;
        }

        var previewSrc = getPreviewSrc($image);
        if (!previewSrc || previewSrc.indexOf('empty_300x200.png') !== -1) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        $('#image-preview-target')
            .attr('src', previewSrc)
            .attr('alt', $image.attr('alt') || 'Image preview');

        $('#image-preview-modal').modal('show');
    });

    $('#image-preview-modal').on('hidden.bs.modal', function () {
        $('#image-preview-target').attr('src', '');
    });
})
