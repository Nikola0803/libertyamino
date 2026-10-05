<?php
if (!defined('ABSPATH')) exit;

/**
 * la_product   — every PDP field (mirrors the Next.js `Product` type exactly)
 * la_coa       — Certificates of Analysis shown on /lab-results (add/edit/remove independently of products)
 * la_content   — one entry per front-end page; holds every editable text/image field on that page
 * la_popup     — front-end popups & offers (exit-intent, timed, etc.)
 */
function la_cms_register_post_types() {
    register_post_type('la_product', [
        'label' => 'Products',
        'labels' => [
            'name' => 'Products',
            'singular_name' => 'Product',
            'add_new_item' => 'Add New Product',
            'edit_item' => 'Edit Product',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'la-cms',
        'menu_icon' => 'dashicons-tag',
        'supports' => ['title'],
        'show_in_rest' => false, // we expose a custom, fully-shaped endpoint instead — see includes/rest-api.php
    ]);

    register_post_type('la_coa', [
        'label' => 'Lab Results (COAs)',
        'labels' => [
            'name' => 'Lab Results (COAs)',
            'singular_name' => 'COA',
            'add_new_item' => 'Add New COA',
            'edit_item' => 'Edit COA',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'la-cms',
        'menu_icon' => 'dashicons-media-spreadsheet',
        'supports' => ['title'],
        'show_in_rest' => false,
    ]);

    register_post_type('la_content', [
        'label' => 'Page Content',
        'labels' => [
            'name' => 'Page Content',
            'singular_name' => 'Page',
            'edit_item' => 'Edit Page Content',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'la-cms',
        'menu_icon' => 'dashicons-edit-page',
        'supports' => ['title'],
        'show_in_rest' => false,
        // one post per page, identified by slug — created by the content seeder, not manually
        'capabilities' => ['create_posts' => 'do_not_allow'],
        'map_meta_cap' => true,
    ]);

    register_post_type('la_popup', [
        'label' => 'Popups & Offers',
        'labels' => [
            'name' => 'Popups & Offers',
            'singular_name' => 'Popup',
            'add_new_item' => 'Add New Popup',
            'edit_item' => 'Edit Popup',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'la-cms',
        'menu_icon' => 'dashicons-megaphone',
        'supports' => ['title'],
        'show_in_rest' => false,
    ]);
}
add_action('init', 'la_cms_register_post_types');
