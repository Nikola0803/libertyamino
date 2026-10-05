<?php
if (!defined('ABSPATH')) exit;

/** Full field parity with the Next.js `Product` TypeScript type. */
function la_cms_product_fields() {
    return [
        'slug'             => 'Slug (URL, e.g. bpc-157-10mg)',
        'sku'              => 'SKU',
        'category'         => 'Category (peptides / growth-hormone / ancillaries)',
        'category_label'   => 'Category label (display text)',
        'image'            => 'Product image (path or URL)',
        'price'            => 'Price (USD)',
        'bulk_qty'         => 'Bulk option — quantity',
        'bulk_price'       => 'Bulk option — price',
        'bulk_save_percent'=> 'Bulk option — save %',
        'purity'           => 'Purity (e.g. ≥99%)',
        'avg_mass'         => 'Average mass',
        'rating'           => 'Rating (0–5)',
        'review_count'     => 'Review count',
        'in_stock'         => 'In stock (1/0)',
        'short_description'=> 'Short description',
        'description'      => 'Full description',
        'storage'          => 'Storage instructions',
        'reconstitution'   => 'Reconstitution instructions',
        'badges'           => 'Badges (comma-separated)',
        'batch_code'       => 'Batch — code',
        'batch_date'       => 'Batch — date',
        'batch_status'     => 'Batch — status (PASS / PENDING)',
    ];
}

add_action('add_meta_boxes', function () {
    add_meta_box('la_product_fields', 'Product Details (PDP fields)', 'la_cms_render_product_meta_box', 'la_product', 'normal', 'high');
});

function la_cms_render_product_meta_box($post) {
    wp_nonce_field('la_cms_save_product', 'la_cms_product_nonce');
    $fields = la_cms_product_fields();
    echo '<table class="form-table"><tbody>';
    foreach ($fields as $key => $label) {
        $value = get_post_meta($post->ID, '_la_' . $key, true);
        $is_textarea = in_array($key, ['description', 'short_description', 'storage', 'reconstitution'], true);
        echo '<tr><th style="width:260px;text-align:left"><label for="la_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
        if ($is_textarea) {
            echo '<textarea style="width:100%" rows="3" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '">' . esc_textarea($value) . '</textarea>';
        } elseif ($key === 'in_stock') {
            echo '<input type="checkbox" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '" value="1" ' . checked($value, '1', false) . ' />';
        } elseif ($key === 'image') {
            echo '<input type="text" style="width:70%" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '" value="' . esc_attr($value) . '" /> ';
            echo '<button type="button" class="button altr-media-picker" data-target="la_' . esc_attr($key) . '">Choose Image</button>';
            if ($value) echo '<div style="margin-top:8px"><img src="' . esc_url($value) . '" style="max-width:120px;height:auto;border:1px solid #ddd" /></div>';
        } else {
            echo '<input type="text" style="width:100%" id="la_' . esc_attr($key) . '" name="la_' . esc_attr($key) . '" value="' . esc_attr($value) . '" />';
        }
        echo '</td></tr>';
    }
    echo '</tbody></table>';
}

add_action('save_post_la_product', function ($post_id) {
    if (!isset($_POST['la_cms_product_nonce']) || !wp_verify_nonce($_POST['la_cms_product_nonce'], 'la_cms_save_product')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    foreach (la_cms_product_fields() as $key => $label) {
        if ($key === 'in_stock') {
            update_post_meta($post_id, '_la_in_stock', isset($_POST['la_in_stock']) ? '1' : '0');
            continue;
        }
        if (isset($_POST['la_' . $key])) {
            $raw = wp_unslash($_POST['la_' . $key]);
            $sanitized = in_array($key, ['description', 'short_description'], true) ? sanitize_textarea_field($raw) : sanitize_text_field($raw);
            update_post_meta($post_id, '_la_' . $key, $sanitized);
        }
    }
});

/** Flat array of every field for a given la_product post — used by the REST API and the importer. */
function la_cms_get_product_data($post_id) {
    $data = ['id' => (string) $post_id, 'name' => get_the_title($post_id)];
    foreach (array_keys(la_cms_product_fields()) as $key) {
        $data[$key] = get_post_meta($post_id, '_la_' . $key, true);
    }
    return $data;
}
