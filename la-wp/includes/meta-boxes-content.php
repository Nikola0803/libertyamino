<?php
if (!defined('ABSPATH')) exit;

/** Renders the schema-driven field editor for one la_content page entry. */
add_action('add_meta_boxes', function () {
    add_meta_box('la_content_fields', 'Page Content Fields', 'la_cms_render_content_meta_box', 'la_content', 'normal', 'high');
});

function la_cms_render_content_meta_box($post) {
    wp_nonce_field('la_cms_save_content', 'la_cms_content_nonce');
    $fields = get_post_meta($post->ID, '_la_fields', true);
    if (!is_array($fields)) $fields = [];

    echo '<table class="form-table"><tbody>';
    foreach ($fields as $key => $field) {
        $label = isset($field['label']) ? $field['label'] : $key;
        $type = isset($field['type']) ? $field['type'] : 'text';
        $value = isset($field['value']) ? $field['value'] : '';
        $name = 'la_field_' . $key;

        echo '<tr><th style="width:260px;text-align:left"><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label></th><td>';
        if ($type === 'textarea' || $type === 'richtext') {
            echo '<textarea style="width:100%" rows="' . ($type === 'richtext' ? '6' : '3') . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">' . esc_textarea($value) . '</textarea>';
        } elseif ($type === 'image' || $type === 'video') {
            echo '<input type="text" style="width:70%" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" /> ';
            echo '<button type="button" class="button altr-media-picker" data-target="' . esc_attr($name) . '">Choose ' . ($type === 'image' ? 'Image' : 'Video') . '</button>';
        } else {
            echo '<input type="text" style="width:100%" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" />';
        }
        echo '<input type="hidden" name="la_field_type_' . esc_attr($key) . '" value="' . esc_attr($type) . '" />';
        echo '<input type="hidden" name="la_field_label_' . esc_attr($key) . '" value="' . esc_attr($label) . '" />';
        echo '</td></tr>';
    }
    echo '</tbody></table>';

    if (empty($fields)) {
        echo '<p><em>No fields defined for this page yet. Fields are seeded automatically from the content schema on plugin activation.</em></p>';
    }
}

add_action('save_post_la_content', function ($post_id) {
    if (!isset($_POST['la_cms_content_nonce']) || !wp_verify_nonce($_POST['la_cms_content_nonce'], 'la_cms_save_content')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $existing = get_post_meta($post_id, '_la_fields', true);
    if (!is_array($existing)) return;

    $updated = [];
    foreach ($existing as $key => $field) {
        $type = isset($_POST['la_field_type_' . $key]) ? sanitize_text_field(wp_unslash($_POST['la_field_type_' . $key])) : (isset($field['type']) ? $field['type'] : 'text');
        $label = isset($_POST['la_field_label_' . $key]) ? sanitize_text_field(wp_unslash($_POST['la_field_label_' . $key])) : (isset($field['label']) ? $field['label'] : $key);
        $raw = isset($_POST['la_field_' . $key]) ? wp_unslash($_POST['la_field_' . $key]) : '';
        $value = ($type === 'richtext') ? wp_kses_post($raw) : sanitize_text_field($raw);
        $updated[$key] = ['type' => $type, 'label' => $label, 'value' => $value];
    }
    update_post_meta($post_id, '_la_fields', $updated);
});

/** Get a single field's current value by page key + field key — for REST output. */
function la_cms_get_content_page($page_key) {
    $post = get_page_by_path($page_key, OBJECT, 'la_content');
    if (!$post) return null;
    $fields = get_post_meta($post->ID, '_la_fields', true);
    if (!is_array($fields)) $fields = [];
    $out = ['key' => $page_key, 'label' => $post->post_title];
    foreach ($fields as $fkey => $field) {
        $out['fields'][$fkey] = isset($field['value']) ? $field['value'] : '';
    }
    return $out;
}
