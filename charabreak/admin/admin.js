(function ($) {
    function chooseImage(field) {
        const mediaType = field.data('gwMediaType') || 'image';
        const options = {
            title: mediaType === 'audio' ? '音源を選択' : '画像を選択',
            button: { text: mediaType === 'audio' ? 'この音源を使う' : 'この画像を使う' },
            multiple: false,
        };

        if (mediaType === 'audio') {
            options.library = { type: 'audio' };
        }

        const frame = wp.media(options);

        frame.on('select', function () {
            const attachment = frame.state().get('selection').first().toJSON();
            field.find('.gaming-web-media-field__input').val(attachment.id || '');
            const url = (attachment.sizes && attachment.sizes.thumbnail && attachment.sizes.thumbnail.url) || attachment.url || '';
            const title = attachment.filename || attachment.title || attachment.name || url || '選択済み';
            const preview = field.find('.gaming-web-media-field__preview').empty();
            if (mediaType !== 'audio' && url) {
                $('<img>').attr({ src: url, alt: '' }).appendTo(preview);
            } else {
                $('<span>').text(mediaType === 'audio' ? title : '標準ドット表示').appendTo(preview);
            }
        });

        frame.open();
    }

    function updateFilters(filters) {
        const root = filters.closest('form');
        const query = String(filters.find('[data-gw-admin-search]').val() || '').trim().toLowerCase();
        const activeFilters = {};

        filters.find('[data-gw-admin-filter]').each(function () {
            const key = $(this).data('gwAdminFilter');
            const value = String($(this).val() || '');
            if (key && value) {
                activeFilters[key] = value;
            }
        });

        let visible = 0;
        let total = 0;

        root.find('[data-gw-admin-row]').each(function () {
            const row = $(this);
            total += 1;

            let matches = !query || String(row.data('gwSearch') || '').toLowerCase().includes(query);
            Object.keys(activeFilters).forEach(function (key) {
                if (String(row.data('gw' + key.charAt(0).toUpperCase() + key.slice(1)) || '') !== activeFilters[key]) {
                    matches = false;
                }
            });

            row.toggle(matches);
            if (matches) {
                visible += 1;
            }
        });

        filters.find('[data-gw-admin-count]').text('表示 ' + visible + ' / ' + total);
    }

    $(document).on('click', '.gaming-web-media-field__choose', function (event) {
        event.preventDefault();
        chooseImage($(this).closest('.gaming-web-media-field'));
    });

    $(document).on('click', '.gaming-web-media-field__clear', function (event) {
        event.preventDefault();
        const field = $(this).closest('.gaming-web-media-field');
        field.find('.gaming-web-media-field__input').val('');
        field.find('.gaming-web-media-field__preview').html('<span>' + (field.data('gwMediaType') === 'audio' ? '標準シンセ' : '標準ドット表示') + '</span>');
    });

    $(document).on('input change', '[data-gw-admin-filters] input, [data-gw-admin-filters] select', function () {
        updateFilters($(this).closest('[data-gw-admin-filters]'));
    });

    $(document).on('change', 'input[name="gaming_web_stage_enabled[]"]', function () {
        $(this).closest('[data-gw-admin-row]').attr('data-gw-enabled', this.checked ? '1' : '0').data('gwEnabled', this.checked ? '1' : '0');
    });

    $(document).on('change', 'select[name^="gaming_web_world_map_type"]', function () {
        $(this).closest('[data-gw-admin-row]').attr('data-gw-type', this.value).data('gwType', this.value);
    });

    $(document).on('change', 'select[name$="[role]"], select[name$="[behavior]"]', function () {
        const row = $(this).closest('[data-gw-admin-row]');
        const role = row.find('select[name$="[role]"]').val() || '';
        const behavior = row.find('select[name$="[behavior]"]').val() || '';
        row.attr('data-gw-role', role).data('gwRole', role);
        row.attr('data-gw-behavior', behavior).data('gwBehavior', behavior);
    });

    $('[data-gw-admin-filters]').each(function () {
        updateFilters($(this));
    });
})(jQuery);
