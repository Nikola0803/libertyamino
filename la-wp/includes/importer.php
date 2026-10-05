<?php
if (!defined('ABSPATH')) exit;

/** One-click, idempotent import of the current live catalog. Skips any slug that already exists so re-running is safe. */
function la_cms_run_product_import() {
    $imported = 0;
    $skipped = 0;

    foreach (la_cms_importer_products() as $row) {
        $existing = get_posts([
            'post_type' => 'la_product',
            'numberposts' => 1,
            'meta_key' => '_la_slug',
            'meta_value' => $row['slug'],
            'post_status' => 'any',
        ]);

        if (!empty($existing)) {
            $skipped++;
            continue;
        }

        $post_id = wp_insert_post([
            'post_type'   => 'la_product',
            'post_title'  => $row['name'],
            'post_status' => 'publish',
        ]);

        if (is_wp_error($post_id) || !$post_id) continue;

        foreach ($row as $key => $value) {
            if ($key === 'name') continue;
            update_post_meta($post_id, '_la_' . $key, $value);
        }
        $imported++;
    }

    return ['imported' => $imported, 'skipped' => $skipped];
}

add_action('admin_post_la_cms_import_products', function () {
    if (!current_user_can('manage_options')) wp_die('Not allowed.');
    check_admin_referer('la_cms_import_products');

    $result = la_cms_run_product_import();
    set_transient('la_cms_import_result', $result, 30);

    wp_safe_redirect(admin_url('admin.php?page=la-cms-setup&imported=1'));
    exit;
});
