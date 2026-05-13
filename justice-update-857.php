<?php
/**
 * ONE-TIME article updater for post 857 (/criminal-defense-attorney/)
 * Deployed via git push -> uPress auto-pull
 * Access: https://jus-tice.co.il/?justice_update_857=GO
 * DELETE THIS FILE AFTER USE
 */

add_action('init', function() {
    if (!isset($_GET['justice_update_857']) || $_GET['justice_update_857'] !== 'GO') {
        return;
    }

    // Prevent running twice
    if (get_option('justice_857_updated_v2')) {
        wp_die('Already executed. Delete this file.', 'Done', array('response' => 200));
    }

    // Build the article
    $part1_file = get_template_directory() . '/criminal-article-part1.html';
    $part2_file = get_template_directory() . '/criminal-article-part2.html';

    if (!file_exists($part1_file) || !file_exists($part2_file)) {
        wp_die('ERROR: Article HTML files not found. Part1: ' . ($part1_file) . ' Part2: ' . ($part2_file));
    }

    $part1 = file_get_contents($part1_file);
    $part2 = file_get_contents($part2_file);
    $full_content = $part1 . "\n" . $part2;

    // Backup current content
    $current = get_post(857);
    if (!$current) {
        wp_die('ERROR: Post 857 not found.');
    }

    update_option('justice_857_backup_title', $current->post_title);
    update_option('justice_857_backup_content', $current->post_content);
    update_option('justice_857_backup_date', current_time('mysql'));

    // Update the post
    $new_title = html_entity_decode('&#1506;&#1493;&#1512;&#1498; &#1491;&#1497;&#1503; &#1508;&#1500;&#1497;&#1500;&#1497; &#1489;&#1497;&#1513;&#1512;&#1488;&#1500; | &#1502;&#1491;&#1512;&#1497;&#1498; &#1502;&#1500;&#1488;: &#1495;&#1511;&#1497;&#1512;&#1492;, &#1502;&#1506;&#1510;&#1512;, &#1499;&#1514;&#1489; &#1488;&#1497;&#1513;&#1493;&#1501; &#1493;&#1512;&#1497;&#1513;&#1493;&#1501; &#1508;&#1500;&#1497;&#1500;&#1497;', ENT_HTML5, 'UTF-8');

    $result = wp_update_post(array(
        'ID'           => 857,
        'post_title'   => $new_title,
        'post_content' => $full_content,
        'post_status'  => 'publish',
    ), true);

    if (is_wp_error($result)) {
        wp_die('UPDATE ERROR: ' . $result->get_error_message());
    }

    // Mark as done
    update_option('justice_857_updated_v2', current_time('mysql'));

    // Output
    header('Content-Type: text/html; charset=utf-8');
    echo 'POST 857 Updated Successfully. Content length: ' . mb_strlen($full_content, 'UTF-8') . ' chars. Slug: criminal-defense-attorney (UNCHANGED). Delete updater files now.';
    exit;
}, 1);
