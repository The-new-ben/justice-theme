<?php
/**
 * Register Jus-Tice Content Tree Dashboard in wp-admin.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the custom menu page.
 */
function justice_theme_register_content_tree_dashboard() {
	add_menu_page(
		__( 'עץ תוכן Jus-Tice', 'justice-theme' ),
		__( 'עץ תוכן', 'justice-theme' ),
		'manage_options',
		'justice-content-tree',
		'justice_theme_render_content_tree_dashboard',
		'dashicons-networking',
		30
	);
}
add_action( 'admin_menu', 'justice_theme_register_content_tree_dashboard' );

/**
 * Render the Content Tree Dashboard.
 */
function justice_theme_render_content_tree_dashboard() {
	$csv_file = get_template_directory() . '/project-control/content-master/content-master-inventory.csv';

	if ( ! file_exists( $csv_file ) ) {
		$csv_file = dirname( get_template_directory() ) . '/project-control/content-master/content-master-inventory.csv';
	}

	if ( ! file_exists( $csv_file ) ) {
		echo '<div class="wrap" style="direction: rtl;"><h1>שגיאה</h1><p>קובץ אינוונטר המאסטר (content-master-inventory.csv) אינו נמצא בשרת.</p></div>';
		return;
	}

	$handle = fopen( $csv_file, 'r' );
	if ( ! $handle ) {
		echo '<div class="wrap" style="direction: rtl;"><h1>שגיאה</h1><p>לא ניתן לפתוח את קובץ אינוונטר המאסטר לקריאה.</p></div>';
		return;
	}

	$headers = fgetcsv( $handle );
	$rows    = array();

	while ( ( $data = fgetcsv( $handle ) ) !== false ) {
		// Verify row matching headers count
		if ( count( $headers ) === count( $data ) ) {
			$rows[] = array_combine( $headers, $data );
		}
	}
	fclose( $handle );

	?>
	<div class="wrap" style="direction: rtl; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
		<h1 style="font-size: 23px; font-weight: 400; margin: 0 0 15px 0;">🏆 עץ התוכן והסמכות — מניעת קניבליזציה</h1>
		<p style="font-size: 14px; margin-bottom: 20px; color: #555;">
			להלן רשימת העמודים המאושרים באתר, מילות המפתח הממוקדות שלהם וכוונת החיפוש. <strong>אין לפרסם עמוד חדש ללא בדיקה בעץ התוכן!</strong>
		</p>

		<input type="text" id="treeSearch" placeholder="חיפוש לפי כתובת עמוד, מילת מפתח או סטטוס..." style="width: 100%; max-width: 500px; padding: 10px; margin-bottom: 20px; font-size: 15px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 1px rgba(0,0,0,.075);">

		<table class="wp-list-table widefat fixed striped pages" style="width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
			<thead>
				<tr style="background-color: #f6f7f7; text-align: right; border-bottom: 1px solid #dcdcde;">
					<th style="padding: 10px; width: 30%; font-weight: 600;">כותרת העמוד (H1)</th>
					<th style="padding: 10px; width: 25%; font-weight: 600;">כתובת העמוד (URL)</th>
					<th style="padding: 10px; width: 20%; font-weight: 600;">מילת מפתח ראשית</th>
					<th style="padding: 10px; width: 13%; font-weight: 600;">כוונת חיפוש</th>
					<th style="padding: 10px; width: 12%; font-weight: 600;">פעולה מומלצת</th>
				</tr>
			</thead>
			<tbody id="treeTableBody">
				<?php foreach ( $rows as $row ) : ?>
					<?php
					$action = isset( $row['recommended_action'] ) ? trim( (string) $row['recommended_action'] ) : 'NEEDS_REVIEW';
					$bg     = 'MAKE_PILLAR' === $action ? '#d4edda' : ( 'SUPPORT_PILLAR' === $action ? '#cce5ff' : '#fff3cd' );
					$color  = 'MAKE_PILLAR' === $action ? '#155724' : ( 'SUPPORT_PILLAR' === $action ? '#004085' : '#856404' );
					?>
					<tr class="tree-row" style="border-bottom: 1px solid #f0f0f1;">
						<td style="padding: 10px; vertical-align: middle;"><strong><?php echo esc_html( isset( $row['title'] ) ? $row['title'] : 'Untitled' ); ?></strong></td>
						<td style="padding: 10px; vertical-align: middle;"><a href="<?php echo esc_url( isset( $row['current_url'] ) ? $row['current_url'] : '#' ); ?>" target="_blank" style="text-decoration: none; color: #2271b1;"><?php echo esc_html( isset( $row['current_slug'] ) ? $row['current_slug'] : '-' ); ?></a></td>
						<td style="padding: 10px; vertical-align: middle;"><code style="font-family: Consolas, Monaco, monospace; background: #f0f0f1; padding: 2px 5px; border-radius: 3px; font-size: 13px;"><?php echo esc_html( isset( $row['primary_keyword'] ) ? $row['primary_keyword'] : '-' ); ?></code></td>
						<td style="padding: 10px; vertical-align: middle; font-size: 13px;"><?php echo esc_html( isset( $row['search_intent'] ) ? $row['search_intent'] : '-' ); ?></td>
						<td style="padding: 10px; vertical-align: middle;">
							<span class="badge" style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; background-color: <?php echo esc_attr( $bg ); ?>; color: <?php echo esc_attr( $color ); ?>;">
								<?php echo esc_html( $action ); ?>
							</span>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>

		<script>
			document.getElementById('treeSearch').addEventListener('keyup', function() {
				var value = this.value.toLowerCase();
				var rows = document.querySelectorAll('#treeTableBody .tree-row');
				rows.forEach(function(row) {
					var text = row.textContent.toLowerCase();
					row.style.display = text.indexOf(value) > -1 ? '' : 'none';
				});
			});
		</script>
	</div>
	<?php
}
