<?php
/**
 * Post 857 updater using admin-ajax.php endpoint
 * URL: https://jus-tice.co.il/wp-admin/admin-ajax.php?action=justice_update_857
 */

add_action('wp_ajax_nopriv_justice_update_857', 'justice_run_update_857');
add_action('wp_ajax_justice_update_857', 'justice_run_update_857');

function justice_run_update_857() {
    if (get_option('justice_857_ajax_done')) {
        wp_send_json(array('status' => 'already_done', 'when' => get_option('justice_857_ajax_done')));
    }

    $dir = get_template_directory();
    $p1 = @file_get_contents($dir . '/criminal-article-part1.html');
    $p2 = @file_get_contents($dir . '/criminal-article-part2.html');

    if (empty($p1) || empty($p2)) {
        wp_send_json_error(array('msg' => 'HTML files not found', 'dir' => $dir, 'p1_exists' => file_exists($dir . '/criminal-article-part1.html'), 'p2_exists' => file_exists($dir . '/criminal-article-part2.html')));
    }

    $content = $p1 . "\n" . $p2;
    $title = 'עורך דין פלילי בישראל | מדריך מלא: חקירה, מעצר, כתב אישום ורישום פלילי';

    // Backup old
    $old = get_post(857);
    if ($old) {
        update_option('justice_857_old_title_bak', $old->post_title);
    }

    // Direct DB update
    global $wpdb;
    $rows = $wpdb->update(
        $wpdb->posts,
        array(
            'post_title' => $title,
            'post_content' => $content,
            'post_modified' => current_time('mysql'),
            'post_modified_gmt' => current_time('mysql', true),
        ),
        array('ID' => 857),
        array('%s','%s','%s','%s'),
        array('%d')
    );

    if ($rows === false) {
        wp_send_json_error(array('msg' => 'DB error', 'error' => $wpdb->last_error));
    }

    clean_post_cache(857);
    update_option('justice_857_ajax_done', current_time('mysql'));

    wp_send_json_success(array(
        'status' => 'updated',
        'post_id' => 857,
        'content_length' => strlen($content),
        'title' => $title,
        'rows_affected' => $rows,
    ));
}
