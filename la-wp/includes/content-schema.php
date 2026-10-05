<?php
if (!defined('ABSPATH')) exit;

/**
 * One la_content post per front-end page/section. Each holds a flexible
 * array of fields (label + type + value) as post meta '_la_fields', so
 * every text line and image on the site has a home here — nothing is
 * hardcoded "without an excuse".
 */
function la_cms_content_schema() {
    return [
        'home-hero' => [
            'label' => 'Homepage — Hero',
            'fields' => [
                'eyebrow'      => ['type' => 'text', 'label' => 'Eyebrow', 'value' => 'RESEARCH USE ONLY'],
                'headline'     => ['type' => 'text', 'label' => 'Headline', 'value' => 'THE STANDARD. NOT THE MARKUP.'],
                'subheadline'  => ['type' => 'textarea', 'label' => 'Subheadline', 'value' => 'Change your state.'],
                'cta_label'    => ['type' => 'text', 'label' => 'CTA button label', 'value' => 'Shop Peptides'],
                'cta_link'     => ['type' => 'text', 'label' => 'CTA button link', 'value' => '/shop'],
                'badge_text'   => ['type' => 'text', 'label' => 'Rotating badge text', 'value' => 'THIRD-PARTY VERIFIED · BATCH TESTED ·'],
                'bg_video'     => ['type' => 'video', 'label' => 'Background video', 'value' => '/videos/hero-water-2.mp4'],
            ],
        ],
        'home-trust-bar' => [
            'label' => 'Homepage — Trust Bar',
            'fields' => [
                'item_1' => ['type' => 'text', 'label' => 'Trust item 1', 'value' => 'Third-Party Tested'],
                'item_2' => ['type' => 'text', 'label' => 'Trust item 2', 'value' => 'Made in the USA'],
                'item_3' => ['type' => 'text', 'label' => 'Trust item 3', 'value' => '≥99% Purity'],
                'item_4' => ['type' => 'text', 'label' => 'Trust item 4', 'value' => 'Discreet Shipping'],
            ],
        ],
        'home-about' => [
            'label' => 'Homepage — The LA Standard',
            'fields' => [
                'headline'    => ['type' => 'text', 'label' => 'Headline', 'value' => 'THE LA STANDARD'],
                'body'        => ['type' => 'richtext', 'label' => 'Body copy', 'value' => ''],
                'video'       => ['type' => 'video', 'label' => 'Section video', 'value' => '/videos/standard-vial.mp4'],
            ],
        ],
        'home-science' => [
            'label' => 'Homepage — Science Section',
            'fields' => [
                'headline'   => ['type' => 'text', 'label' => 'Headline', 'value' => 'THE SCIENCE'],
                'article_1_title' => ['type' => 'text', 'label' => 'Article 1 title', 'value' => 'Purity Standards'],
                'article_1_image' => ['type' => 'image', 'label' => 'Article 1 image', 'value' => '/images/science/purity.jpg'],
                'article_2_title' => ['type' => 'text', 'label' => 'Article 2 title', 'value' => 'Independent Testing'],
                'article_2_image' => ['type' => 'image', 'label' => 'Article 2 image', 'value' => '/images/science/testing.jpg'],
                'article_3_title' => ['type' => 'text', 'label' => 'Article 3 title', 'value' => 'The LA Standard'],
                'article_3_image' => ['type' => 'image', 'label' => 'Article 3 image', 'value' => '/images/science/standard.jpg'],
            ],
        ],
        'home-lab-preview' => [
            'label' => 'Homepage — Lab Results Preview',
            'fields' => [
                'headline'      => ['type' => 'text', 'label' => 'Headline', 'value' => 'Every batch. Verified.'],
                'purity_stat'   => ['type' => 'text', 'label' => 'Purity stat', 'value' => '≥99%'],
                'status_label'  => ['type' => 'text', 'label' => 'Status label', 'value' => 'Verified Independently · Pass'],
            ],
        ],
        'home-testimonials' => [
            'label' => 'Homepage — Testimonials',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'Trusted by researchers'],
                'stat'     => ['type' => 'text', 'label' => 'Stat callout', 'value' => '150+ Researchers'],
            ],
        ],
        'home-final-cta' => [
            'label' => 'Homepage — Final CTA',
            'fields' => [
                'headline'  => ['type' => 'text', 'label' => 'Headline', 'value' => 'Ready to start?'],
                'cta_label' => ['type' => 'text', 'label' => 'Button label', 'value' => 'Shop All Products'],
            ],
        ],
        'footer' => [
            'label' => 'Footer',
            'fields' => [
                'ruo_statement' => ['type' => 'textarea', 'label' => 'RUO legal statement', 'value' => 'All products sold by LA are for laboratory research use only. Not for human consumption.'],
                'newsletter_heading' => ['type' => 'text', 'label' => 'Newsletter heading', 'value' => 'Stay in the loop'],
            ],
        ],
        'science-page' => [
            'label' => 'Science Page',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'The Science'],
                'intro'    => ['type' => 'richtext', 'label' => 'Intro copy', 'value' => ''],
            ],
        ],
        'about-page' => [
            'label' => 'About Page',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'About LA'],
                'body'     => ['type' => 'richtext', 'label' => 'Body copy', 'value' => ''],
            ],
        ],
        'faq-page' => [
            'label' => 'FAQ Page',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'Frequently Asked Questions'],
            ],
        ],
        'contact-page' => [
            'label' => 'Contact Page',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'Contact Us'],
                'email'    => ['type' => 'text', 'label' => 'Contact email', 'value' => ''],
            ],
        ],
        'journal-page' => [
            'label' => 'Journal Page',
            'fields' => [
                'headline' => ['type' => 'text', 'label' => 'Headline', 'value' => 'Journal'],
                'coming_soon_note' => ['type' => 'text', 'label' => 'Coming soon note', 'value' => 'New articles coming soon.'],
            ],
        ],
    ];
}

/** Create one la_content post per schema key, pre-filled — runs on activation only. */
function la_cms_seed_default_content() {
    foreach (la_cms_content_schema() as $key => $page) {
        $existing = get_page_by_path($key, OBJECT, 'la_content');
        if ($existing) continue;

        $post_id = wp_insert_post([
            'post_type'   => 'la_content',
            'post_title'  => $page['label'],
            'post_name'   => $key,
            'post_status' => 'publish',
        ]);

        if (!is_wp_error($post_id) && $post_id) {
            update_post_meta($post_id, '_la_fields', $page['fields']);
        }
    }
}
