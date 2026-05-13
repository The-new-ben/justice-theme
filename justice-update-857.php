<?php
/**
 * ONE-TIME article updater for post 857 (/criminal-defense-attorney/)
 * Deployed via git push -> uPress auto-pull
 * Access: https://jus-tice.co.il/?justice_update_857=GO
 * DELETE THIS FILE AFTER USE
 */

// Only run when triggered with the secret parameter
if (!isset($_GET['justice_update_857']) || $_GET['justice_update_857'] !== 'GO') {
    return; // Do nothing
}

// Prevent running twice
if (get_option('justice_857_updated_v2')) {
    wp_die('Already executed. Delete this file.');
}

// Build the article from the HTML files in this theme directory
$part1 = file_get_contents(get_template_directory() . '/criminal-article-part1.html');
$part2 = file_get_contents(get_template_directory() . '/criminal-article-part2.html');

if (empty($part1) || empty($part2)) {
    wp_die('ERROR: Article HTML files not found in theme directory.');
}

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
$result = wp_update_post(array(
    'ID'           => 857,
    'post_title'   => 'עורך דין פלילי בישראל | מדריך מלא: חקירה, מעצר, כתב אישום ורישום פלילי',
    'post_content' => $full_content,
    'post_status'  => 'publish',
), true);

if (is_wp_error($result)) {
    wp_die('ERROR: ' . $result->get_error_message());
}

// Mark as done
update_option('justice_857_updated_v2', current_time('mysql'));

// Output confirmation
header('Content-Type: text/html; charset=utf-8');
echo '<html dir="rtl"><body style="font-family:Arial;padding:40px;background:#f0f0f0">';
echo '<h1 style="color:green">&#10003; Post 857 Updated Successfully</h1>';
echo '<p><strong>New title:</strong> עורך דין פלילי בישראל | מדריך מלא: חקירה, מעצר, כתב אישום ורישום פלילי</p>';
echo '<p><strong>Content length:</strong> ' . mb_strlen($full_content, 'UTF-8') . ' characters</p>';
echo '<p><strong>Word count (approx):</strong> ' . str_word_count(strip_tags($full_content)) . '</p>';
echo '<p><strong>Slug:</strong> criminal-defense-attorney (UNCHANGED)</p>';
echo '<p><strong>Backup saved to:</strong> wp_options (justice_857_backup_*)</p>';
echo '<p><strong>Time:</strong> ' . current_time('mysql') . '</p>';
echo '<hr><p style="color:red"><strong>IMPORTANT:</strong> Delete justice-update-857.php, criminal-article-part1.html, criminal-article-part2.html from the theme, then push to git.</p>';
echo '<p><a href="/criminal-defense-attorney/">View the page</a></p>';
echo '</body></html>';
exit;
