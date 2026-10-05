jQuery(function ($) {
    // Wires the WP media library picker to any "Choose Image/File/Video" button
    // rendered by the meta boxes (data-target = the id of the text input to fill).
    $(document).on('click', '.altr-media-picker', function (e) {
        e.preventDefault();
        var button = $(this);
        var targetId = button.data('target');

        var frame = wp.media({
            title: 'Select Media',
            button: { text: 'Use this media' },
            multiple: false,
        });

        frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            $('#' + targetId).val(attachment.url);

            var preview = button.closest('td').find('img');
            if (preview.length) {
                preview.attr('src', attachment.url);
            }
        });

        frame.open();
    });
});
