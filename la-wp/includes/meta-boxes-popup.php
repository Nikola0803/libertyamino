<?php
if (!defined('ABSPATH')) exit;

/** Admin-configurable marketing popups/offers for the front-end (opt-in per popup, off by default). */
function la_cms_popup_fields() {
    return [
        'active'       => 'Active (shown on front-end)',
        'trigger'      => 'Trigger (page-load / exit-intent / timed / scroll)',
        'delay_seconds'=> 'Delay in seconds (for "timed" trigger)',
        'scroll_percent'=> 'Scroll % (for "scroll" trigger)',
        'headline'     => 'Headline',
        'body'         => 'Body copy',
        'image'        => 'Image',
        'cta_label'    => 'CTA button label',
        'cta_link'     => 'CTA button link',
        'dismiss_label'=> 'Dismiss/close label',
        'pages'        => 'Show on pages (comma-separated paths, blank = all pages)',
        'start_date'   => 'Start date (optional)',
        'end_date'     => 'End date (optional)',
    ];
}

add_action('add_meta_boxes', function () {
    add_meta_box('la_popup_fields', 'Popup / Offer Settings', 'la_cms_render_popup_meta_box', 'la_popup', 'normal', 'high');
});

function la_cms_render_popup_meta_box($post) {
    wp_nonce_field('la_cms_save_popup', 'la_cms_popup_nonce');
    $fields = la_cms_popup_fields();

    echo '<table class="form-table"><tbody>';
    foreach ($fields as $key => $label) {
        $value = get_post_meta($post->ID, '_la_' . $key, true);
        echo '<tr><th style="width:260px;text-align:left"><label for="la_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';

        if ($key === 'active') {
            echo '<input type="checkbox" id="la_active" name="la_active" value="1" ' . checked($value, '1', false) . ' />';
        } elseif ($key === 'trigger') {
            echo '<select id="la_trigger" name="la_trigger">';
            foreach (['page-load' => 'Page load', 'exit-intent' => 'Exit intent', 'timed' => 'Timed delay', 'scroll' => 'Scroll depth'] as $val => $text) {
                echo '<option value="' . esc_attr($val) . '" ' . selected($value, $val, false) . '>' . esc_html($text) . '</option>';
            }
            echo '</select>';
        } elseif ($key === 'body') {
            echo '<textarea style="width:100%" rows="3" id="la_body" name="la_body">' . esc_textarea($value) . '</textarea>';
        } elseif ($key === 'image') {
            echo '<input type="text" style="width:70%" id="la_image" name="la_image" value="' . esc_attr($value) . '" /> ';
            echo '<button type="button" class="button altr-media-picker" data-target="la_image">Choose Image</button>';
        } elseif (in_array($key, ['start_date', 'end_date'], true)) {
            echo '<input type="date" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '" value="' . esc_attr($value) . '" />';
        } else {
            echo '<input type="text" style="width:100%" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '" value="' . esc_attr($value) . '" />';
        }
        echo '</td></tr>';
    }
    echo '</tbody></table>';
}

add_action('save_post_la_popup', function ($post_id) {
    if (!isset($_POST['la_cms_popup_nonce']) || !wp_verify_nonce($_POST['la_cms_popup_nonce'], 'la_cms_save_popup')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    foreach (array_keys(la_cms_popup_fields()) as $key) {
        if ($key === 'active') {
            update_post_meta($post_id, '_la_active', isset($_POST['la_active']) ? '1' : '0');
            continue;
        }
        if (isset($_POST['la_' . $key])) {
            $raw = wp_unslash($_POST['la_' . $key]);
            $value = ($key === 'body') ? sanitize_textarea_field($raw) : sanitize_text_field($raw);
            update_post_meta($post_id, '_la_' . $key, $value);
        }
    }
});

function la_cms_get_popup_data($post_id) {
    $data = ['id' => (string) $post_id, 'title' => get_the_title($post_id)];
    foreach (array_keys(la_cms_popup_fields()) as $key) {
        $data[$key] = get_post_meta($post_id, '_la_' . $key, true);
    }
    $data['pages'] = array_filter(array_map('trim', explode(',', (string) $data['pages'])));
    return $data;
}
