<?php
if (!defined('ABSPATH')) exit;

/**
 * Headless REST API consumed by the Next.js frontend. Namespace: la/v1.
 * Read endpoints are public (no auth) since this only ever exposes published,
 * non-sensitive storefront content — same data model as a public WooCommerce
 * store REST feed.
 */
add_action('rest_api_init', function () {
    register_rest_route('la/v1', '/products', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            $posts = get_posts(['post_type' => 'la_product', 'numberposts' => -1, 'post_status' => 'publish']);
            return array_map(fn($p) => la_cms_get_product_data($p->ID), $posts);
        },
    ]);

    register_rest_route('la/v1', '/products/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($req) {
            $posts = get_posts([
                'post_type' => 'la_product',
                'post_status' => 'publish',
                'numberposts' => 1,
                'meta_key' => '_la_slug',
                'meta_value' => $req['slug'],
            ]);
            if (empty($posts)) return new WP_Error('not_found', 'Product not found', ['status' => 404]);
            return la_cms_get_product_data($posts[0]->ID);
        },
    ]);

    register_rest_route('la/v1', '/coas', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($req) {
            $args = ['post_type' => 'la_coa', 'numberposts' => -1, 'post_status' => 'publish'];
            $posts = get_posts($args);
            return array_map(fn($p) => la_cms_get_coa_data($p->ID), $posts);
        },
    ]);

    register_rest_route('la/v1', '/content/(?P<page>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($req) {
            $page = la_cms_get_content_page($req['page']);
            if (!$page) return new WP_Error('not_found', 'Page content not found', ['status' => 404]);
            return $page;
        },
    ]);

    register_rest_route('la/v1', '/content', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            $out = [];
            foreach (array_keys(la_cms_content_schema()) as $key) {
                $out[$key] = la_cms_get_content_page($key);
            }
            return $out;
        },
    ]);

    register_rest_route('la/v1', '/popups/active', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            $posts = get_posts(['post_type' => 'la_popup', 'numberposts' => -1, 'post_status' => 'publish']);
            $active = array_map(fn($p) => la_cms_get_popup_data($p->ID), $posts);
            return array_values(array_filter($active, fn($p) => $p['active'] === '1'));
        },
    ]);
});
