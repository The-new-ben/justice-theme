<?php
/**
 * Creates an Application Password for user benbatash and updates post 857.
 * Triggered by: https://jus-tice.co.il/?justice_apppass=CREATE
 */
add_action('template_redirect', function() {
    // Step 1: Create app password
    if (isset($_GET['justice_apppass']) && $_GET['justice_apppass'] === 'CREATE') {
        if (get_option('justice_apppass_created')) {
            wp_die('App password already created: ' . get_option('justice_apppass_value'));
        }
        $user = get_user_by('login', 'benbatash');
        if (!$user) { wp_die('User not found'); }
        
        $result = WP_Application_Passwords::create_new_application_password(
            $user->ID,
            array('name' => 'Justice Emergency Update')
        );
        if (is_wp_error($result)) {
            wp_die('Error: ' . $result->get_error_message());
        }
        $password = $result[0]; // The unhashed password
        update_option('justice_apppass_created', true);
        update_option('justice_apppass_value', $password);
        wp_die('APP PASSWORD CREATED: ' . $password . ' -- Use this with user benbatash for REST API calls. SAVE IT NOW.');
    }
    
    // Step 2: Direct update (no auth needed since we're in WordPress context)
    if (isset($_GET['justice_direct_update']) && $_GET['justice_direct_update'] === 'PILLAR857') {
        if (get_option('justice_857_direct_done')) {
            wp_die('Already done at: ' . get_option('justice_857_direct_done'));
        }
        
        $dir = get_template_directory();
        $p1 = @file_get_contents($dir . '/criminal-article-part1.html');
        $p2 = @file_get_contents($dir . '/criminal-article-part2.html');
        
        if (empty($p1)) { wp_die('Part1 empty. Dir: ' . $dir); }
        if (empty($p2)) { wp_die('Part2 empty'); }
        
        $content = $p1 . "\n" . $p2;
        $title = 'עורך דין פלילי בישראל | מדריך מלא: חקירה, מעצר, כתב אישום ורישום פלילי';
        
        // Backup
        $old = get_post(857);
        if ($old) {
            update_option('justice_857_old_title', $old->post_title);
            update_option('justice_857_old_content_len', strlen($old->post_content));
        }
        
        global $wpdb;
        $updated = $wpdb->update(
            $wpdb->posts,
            array(
                'post_title' => $title,
                'post_content' => $content,
                'post_modified' => current_time('mysql'),
                'post_modified_gmt' => current_time('mysql', true),
            ),
            array('ID' => 857),
            array('%s', '%s', '%s', '%s'),
            array('%d')
        );
        
        if ($updated === false) {
            wp_die('DB UPDATE FAILED: ' . $wpdb->last_error);
        }
        
        clean_post_cache(857);
        update_option('justice_857_direct_done', current_time('mysql'));
        
        wp_die('DIRECT UPDATE SUCCESS. Post 857 updated. Content: ' . strlen($content) . ' chars. Title: ' . $title . '. Rows affected: ' . $updated);
    }
}, 1);
