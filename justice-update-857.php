<?php
/**
 * ONE-TIME updater for post 857. Uses template_redirect to intercept before output.
 */
add_action('template_redirect', function() {
    if (!isset($_GET['justice_update_857']) || $_GET['justice_update_857'] !== 'GO') {
        return;
    }
    if (get_option('justice_857_updated_v3')) {
        wp_die('Already executed on ' . get_option('justice_857_updated_v3'));
    }

    $dir = get_template_directory();
    $p1 = @file_get_contents($dir . '/criminal-article-part1.html');
    $p2 = @file_get_contents($dir . '/criminal-article-part2.html');

    if (empty($p1)) { wp_die('Part1 not found at ' . $dir . '/criminal-article-part1.html'); }
    if (empty($p2)) { wp_die('Part2 not found at ' . $dir . '/criminal-article-part2.html'); }

    $content = $p1 . "\n" . $p2;

    $old = get_post(857);
    if (!$old) { wp_die('Post 857 not found'); }

    update_option('justice_857_bak_title', $old->post_title);
    update_option('justice_857_bak_len', strlen($old->post_content));

    $title = "\xd7\xa2\xd7\x95\xd7\xa8\xd7\x9a \xd7\x93\xd7\x99\xd7\x9f \xd7\xa4\xd7\x9c\xd7\x99\xd7\x9c\xd7\x99 \xd7\x91\xd7\x99\xd7\xa9\xd7\xa8\xd7\x90\xd7\x9c | \xd7\x9e\xd7\x93\xd7\xa8\xd7\x99\xd7\x9a \xd7\x9e\xd7\x9c\xd7\x90: \xd7\x97\xd7\xa7\xd7\x99\xd7\xa8\xd7\x94, \xd7\x9e\xd7\xa2\xd7\xa6\xd7\xa8, \xd7\x9b\xd7\xaa\xd7\x91 \xd7\x90\xd7\x99\xd7\xa9\xd7\x95\xd7\x9d \xd7\x95\xd7\xa8\xd7\x99\xd7\xa9\xd7\x95\xd7\x9d \xd7\xa4\xd7\x9c\xd7\x99\xd7\x9c\xd7\x99";

    $r = wp_update_post(array(
        'ID' => 857,
        'post_title' => $title,
        'post_content' => $content,
        'post_status' => 'publish',
    ), true);

    if (is_wp_error($r)) { wp_die('Error: ' . $r->get_error_message()); }

    update_option('justice_857_updated_v3', current_time('mysql'));

    wp_die('SUCCESS: Post 857 updated. Length: ' . mb_strlen($content) . ' chars. Slug unchanged: criminal-defense-attorney. DELETE THIS FILE NOW.', 'Updated', array('response' => 200));
}, 1);
