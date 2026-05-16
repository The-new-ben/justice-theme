<?php
/**
 * URL Migration API V8
 * Hebrew to English slug migration with dictionary-based translation
 * Actions: export_slugs, generate_slugs, apply_slugs, check_duplicates
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);
set_time_limit(300);
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if (!isset($_GET['token']) || $_GET['token'] !== $expected_token) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_root = dirname(dirname(dirname(dirname(__FILE__))));
$config_content = file_get_contents($wp_root . '/wp-config.php');
preg_match("/define\s*\(\s*['\"]DB_NAME['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m1);
preg_match("/define\s*\(\s*['\"]DB_USER['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m2);
preg_match("/define\s*\(\s*['\"]DB_PASSWORD['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m3);
preg_match("/define\s*\(\s*['\"]DB_HOST['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m4);
$table_prefix = 'wp_';
if (preg_match('/\$table_prefix\s*=\s*[\'\"]([^\'\"]+)[\'\"]/', $config_content, $mp)) {
    $table_prefix = $mp[1];
}
$conn = new mysqli($m4[1], $m2[1], $m3[1], $m1[1]);
if ($conn->connect_error) { echo json_encode(['error' => 'DB fail']); exit; }
$conn->set_charset('utf8mb4');

// ── DICTIONARY: Hebrew phrases → English slug fragments ──
$dict = [
  // ─ Multi-word (longest first) ─
  'עורך דין פלילי'=>'criminal-defense-attorney','עורך דין תעבורה'=>'traffic-lawyer',
  'עורך דין מקרקעין'=>'real-estate-lawyer','עורך דין גירושין'=>'divorce-lawyer',
  'עורך דין נזיקין'=>'personal-injury-lawyer','משרד עורכי דין'=>'law-firm',
  'עורכי דין'=>'lawyers','עורך דין'=>'lawyer',
  'מעצר עד תום ההליכים'=>'remand-detention','מחיקת רישום פלילי'=>'criminal-record-expungement',
  'מחיקת רישום משטרתי'=>'police-record-deletion','נהיגה תחת השפעת סמים'=>'driving-under-influence',
  'סירוב לבדיקת שכרות'=>'refusing-breathalyzer','נהיגה בשכרות'=>'drunk-driving',
  'מהירות מופרזת'=>'excessive-speeding','סחר בסמים'=>'drug-trafficking',
  'החזקת סמים'=>'drug-possession','עבירות סמים'=>'drug-offenses',
  'מעצר ימים'=>'temporary-detention','כתב אישום'=>'indictment',
  'הלבנת הון'=>'money-laundering','עבירות מין'=>'sex-offenses',
  'אלימות במשפחה'=>'domestic-violence','לשון הרע'=>'defamation',
  'תקנות שעת חירום'=>'emergency-regulations','שעת חירום'=>'emergency',
  'נגיף הקורונה החדש'=>'coronavirus','נגיף הקורונה'=>'coronavirus',
  'משבר הקורונה'=>'covid-crisis','וירוס קורונה'=>'coronavirus',
  'הסכם ממון'=>'prenuptial-agreement','נישואים אזרחיים'=>'civil-marriage',
  'גישור גירושין'=>'divorce-mediation','ביטול צוואה'=>'will-contestation',
  'התנגדות לצוואה'=>'will-contestation','הלכת המזונות'=>'alimony-ruling',
  'צו הורות'=>'parenthood-order','ייפוי כוח מתמשך'=>'continuing-power-of-attorney',
  'ייפוי כוח'=>'power-of-attorney','אימוץ ילד'=>'child-adoption',
  'חינוך הילדים'=>'child-education','רשלנות רפואית'=>'medical-malpractice',
  'תאונת דרכים'=>'car-accident','תביעת נזיקין'=>'tort-claim',
  'תביעות קטנות'=>'small-claims','קניית דירה'=>'buying-apartment',
  'מכירת דירה'=>'selling-apartment','התחדשות עירונית'=>'urban-renewal',
  'הסכם עבודה'=>'employment-agreement','דיני עבודה'=>'labor-law',
  'עובד זר'=>'foreign-worker','שכר טרחה'=>'legal-fees',
  'בית משפט'=>'court','בית הדין'=>'tribunal','בית דין'=>'tribunal',
  'בתי משפט'=>'courts','פסק דין'=>'ruling',
  'רישוי עסקים'=>'business-licensing','צו סגירה'=>'closure-order',
  'מערכת המשפט'=>'justice-system','תביעות רכושיות'=>'property-claims',
  'הסכם גירושין'=>'divorce-agreement','חוק הפיצויים'=>'compensation-law',
  'בריאות העם'=>'public-health','מקום לבידוד'=>'quarantine-location',
  'הגבלת פעילות'=>'activity-restrictions','שירות הביטחון הכללי'=>'shin-bet',
  'ביטוח אבטלה'=>'unemployment-insurance','חיסיון תיקים'=>'case-confidentiality',
  'כל מה שצריך לדעת'=>'complete-guide','כל מה שרציתם לדעת'=>'complete-guide',
  'מאגר מידע'=>'database','איך מגישים'=>'how-to-file',
  'איך למצוא'=>'how-to-find','איך לבחור'=>'how-to-choose',
  'איך לנהל'=>'how-to-manage','מה זה'=>'what-is',
  'מס שכר'=>'payroll-tax','מס הכנסה'=>'income-tax',
  'ניכוי מס במקור'=>'tax-withholding','שעות נוספות'=>'overtime',
  'הסעות עובדים'=>'employee-transportation','מערך הסייבר'=>'cyber-authority',
  'בנק ישראל'=>'bank-of-israel','כניסה לישראל'=>'entry-to-israel',
  // ─ Single words ─
  'פלילי'=>'criminal','גירושין'=>'divorce','מזונות'=>'alimony',
  'משמורת'=>'custody','צוואה'=>'will','ירושה'=>'inheritance',
  'מקרקעין'=>'real-estate','נדלן'=>'real-estate','דירה'=>'apartment',
  'מעצר'=>'arrest','חקירה'=>'investigation','הרשעה'=>'conviction',
  'זיכוי'=>'acquittal','עונש'=>'sentence','מאסר'=>'imprisonment',
  'קנס'=>'fine','גניבה'=>'theft','מרמה'=>'fraud','רצח'=>'murder',
  'תקיפה'=>'assault','שוחד'=>'bribery','סחיטה'=>'extortion',
  'סמים'=>'drugs','שכרות'=>'intoxication','נהיגה'=>'driving',
  'תעבורה'=>'traffic','מהירות'=>'speeding','רישיון'=>'license',
  'פסילה'=>'disqualification','רכב'=>'vehicle','תאונה'=>'accident',
  'משפחה'=>'family','נישואין'=>'marriage','נישואים'=>'marriage',
  'הורות'=>'parenthood','ילדים'=>'children','קטינים'=>'minors',
  'קטינות'=>'minors','אימוץ'=>'adoption','גישור'=>'mediation',
  'רכוש'=>'property','נזיקין'=>'torts','נזק'=>'damage',
  'פיצויים'=>'compensation','פיצוי'=>'compensation','רשלנות'=>'negligence',
  'רפואית'=>'medical','עבודה'=>'employment','עובד'=>'employee',
  'עובדים'=>'employees','מעביד'=>'employer','מעסיק'=>'employer',
  'מעסיקים'=>'employers','שכר'=>'salary','פיטורים'=>'termination',
  'פנסיה'=>'pension','חופשה'=>'leave','מחלה'=>'illness',
  'חוק'=>'law','תביעה'=>'claim','ערעור'=>'appeal',
  'בקשה'=>'petition','צו'=>'order','הסכם'=>'agreement',
  'תקנות'=>'regulations','זכויות'=>'rights','הודעה'=>'notice',
  'הנחיות'=>'guidelines','חירום'=>'emergency','חירות'=>'liberty',
  'קורונה'=>'covid','בידוד'=>'quarantine','סגר'=>'lockdown',
  'הגבלות'=>'restrictions','ביטול'=>'cancellation','הארכה'=>'extension',
  'תיקון'=>'amendment','חדש'=>'new','חדשה'=>'new',
  'מדריך'=>'guide','מומלץ'=>'recommended','מומחה'=>'expert',
  'מחיר'=>'price','חינם'=>'free','ייעוץ'=>'consultation',
  'נוטריון'=>'notary','תובענה'=>'lawsuit','פרסם'=>'published',
  'הקלטות'=>'recordings','שיקים'=>'checks','כיסוי'=>'coverage',
  'ביטוח'=>'insurance','עצמאי'=>'freelancer','עצמאיים'=>'freelancers',
  'פרילנסר'=>'freelancer','חברה'=>'company','עסק'=>'business',
  'מסמך'=>'document','טופס'=>'form','פרישה'=>'retirement',
  'תעופה'=>'aviation','נסיעות'=>'travel','סוכנות'=>'agency',
  'משטרה'=>'police','משטרת'=>'police','ישראל'=>'israel',
  'תוקף'=>'validity','אישור'=>'approval','כספי'=>'financial',
  'כספיים'=>'financial','דוחות'=>'reports','פעילות'=>'activity',
  'עיריית'=>'municipality','עירייה'=>'municipality',
  'חוזה'=>'contract','חוזים'=>'contracts','רישום'=>'registration',
  'מידע'=>'information','בוקינג'=>'booking','צרכן'=>'consumer',
  'הגנה'=>'protection','הגנת'=>'protection','כנסת'=>'knesset',
  'מליאת'=>'plenum','חיפוש'=>'search','ראיה'=>'evidence',
  'חוקי'=>'legal','בלתי'=>'illegal','סגירה'=>'closure',
  'פתיחה'=>'opening','זמני'=>'temporary','קבוע'=>'permanent',
  'עיצום'=>'penalty','טבריה'=>'tiberias','אוקראינה'=>'ukraine',
  'מבקרים'=>'visitors','סוהר'=>'prison','תרופה'=>'medication',
  'טלפונים'=>'phones','סקירה'=>'review','יומית'=>'daily',
  'ראש'=>'head','עיר'=>'city','פייסבוק'=>'facebook',
  'כניסת'=>'entry','אזרחית'=>'citizen','זרה'=>'foreign',
  'זר'=>'foreign','מומחה'=>'expert','מומחים'=>'experts',
  'הודעת'=>'notice','פרישת'=>'retirement',
  'תשלום'=>'payment','העסקת'=>'employing','הפרת'=>'violation',
  'הוראות'=>'provisions','מיוחדות'=>'special','מיוחד'=>'special',
  'כללי'=>'general','היתר'=>'permit','כניסה'=>'entry',
  'אזרחים'=>'citizens','שער'=>'gate','קידום'=>'promotion',
  'בנייה'=>'construction','דיור'=>'housing','מתחמים'=>'complexes',
  'מועדפים'=>'preferred','תכנון'=>'planning','בניין'=>'building',
];

// ── TRANSLATION FUNCTION ──
function hebrew_to_slug($title, $dict) {
    if (empty($title)) return '';
    // Remove case numbers, dates, section refs, special punctuation
    $t = preg_replace('/\b\d{4,}[-\/]\d{2}[-\/]?\d{0,4}\b/', '', $title);
    $t = preg_replace('/\b\d{2}[-\/]\d{2}[-\/]\d{2,4}\b/', '', $t);
    $t = str_replace(['"','"','״','׳','|','(',')','[',']','{','}','«','»','–','—','…','\''], ' ', $t);
    $t = preg_replace('/\bעש"א\b|\bת"ע\b|\bע"א\b|\bבע"ם\b/', '', $t);
    $t = trim($t);

    // Sort dict by key length DESC for greedy matching
    uksort($dict, function($a, $b) { return mb_strlen($b,'UTF-8') - mb_strlen($a,'UTF-8'); });

    // Replace known phrases/words
    foreach ($dict as $heb => $eng) {
        $t = str_replace($heb, " $eng ", $t);
    }

    // Try prefix-stripping for remaining Hebrew words
    $prefixes = ['ב','ל','מ','ה','ו','כ','ש','וב','וה','ול','של','לב'];
    $words = preg_split('/\s+/', $t);
    $result = [];
    foreach ($words as $w) {
        $w = trim($w);
        if (empty($w)) continue;
        if (preg_match('/[\x{0590}-\x{05FF}]/u', $w)) {
            // Still Hebrew - try stripping prefixes
            $found = false;
            usort($prefixes, function($a,$b){ return mb_strlen($b)-mb_strlen($a); });
            foreach ($prefixes as $p) {
                if (mb_strpos($w, $p, 0, 'UTF-8') === 0) {
                    $stripped = mb_substr($w, mb_strlen($p,'UTF-8'), null, 'UTF-8');
                    if (isset($dict[$stripped])) {
                        $result[] = $dict[$stripped];
                        $found = true;
                        break;
                    }
                }
            }
            // Skip untranslatable Hebrew
            if (!$found) continue;
        } else {
            $result[] = $w;
        }
    }

    $slug = strtolower(implode('-', $result));
    $slug = preg_replace('/[^a-z0-9-]/', '', $slug);
    $slug = preg_replace('/-{2,}/', '-', $slug);
    $slug = trim($slug, '-');

    // Remove duplicate consecutive words
    $parts = explode('-', $slug);
    $deduped = [$parts[0] ?? ''];
    for ($i = 1; $i < count($parts); $i++) {
        if ($parts[$i] !== $parts[$i-1]) $deduped[] = $parts[$i];
    }
    $slug = implode('-', array_filter($deduped));

    // Limit to 60 chars at word boundary
    if (strlen($slug) > 60) {
        $slug = substr($slug, 0, 60);
        $slug = preg_replace('/-[^-]*$/', '', $slug);
    }
    return $slug;
}

$action = $_GET['action'] ?? '';

// ════════════════════════════════════════
// ACTION: export_slugs (same as V7)
// ════════════════════════════════════════
if ($action === 'export_slugs') {
    $page = (int)($_GET['page'] ?? 0);
    $limit = 200;
    $offset = $page * $limit;
    $sql = "SELECT ID, post_name, post_title, post_type, post_status
            FROM {$table_prefix}posts
            WHERE post_status IN ('publish','draft','private')
            AND post_type IN ('post','page','articles','justice_lawyer')
            ORDER BY post_type, ID LIMIT $limit OFFSET $offset";
    $res = $conn->query($sql);
    $posts = []; $heb = 0; $eng = 0;
    while ($row = $res->fetch_assoc()) {
        $need = preg_match('/[\x{0590}-\x{05FF}]/u', urldecode($row['post_name']))
             || preg_match('/%d7%/i', $row['post_name']);
        $posts[] = ['id'=>(int)$row['ID'],'slug'=>$row['post_name'],'title'=>$row['post_title'],
                    'type'=>$row['post_type'],'status'=>$row['post_status'],'needs_translation'=>$need];
        $need ? $heb++ : $eng++;
    }
    $total = $conn->query("SELECT COUNT(*) as c FROM {$table_prefix}posts
        WHERE post_status IN ('publish','draft','private')
        AND post_type IN ('post','page','articles','justice_lawyer')")->fetch_assoc()['c'];
    echo json_encode(['page'=>$page,'per_page'=>$limit,'total_posts'=>(int)$total,
        'total_pages'=>ceil($total/$limit),'count'=>count($posts),
        'hebrew'=>$heb,'english'=>$eng,'posts'=>$posts], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    exit;
}

// ════════════════════════════════════════
// ACTION: generate_slugs — dry run, shows proposed changes
// ════════════════════════════════════════
if ($action === 'generate_slugs') {
    $page = (int)($_GET['page'] ?? 0);
    $limit = 100;
    $offset = $page * $limit;

    // Get all existing slugs for uniqueness check
    $existing = [];
    $r = $conn->query("SELECT post_name FROM {$table_prefix}posts WHERE post_name != ''");
    while ($row = $r->fetch_assoc()) $existing[$row['post_name']] = true;

    $sql = "SELECT ID, post_name, post_title, post_type, post_status
            FROM {$table_prefix}posts
            WHERE post_status IN ('publish','draft','private')
            AND post_type IN ('post','page','articles','justice_lawyer')
            ORDER BY post_type, ID LIMIT $limit OFFSET $offset";
    $res = $conn->query($sql);
    $proposals = [];
    $skipped = 0;

    while ($row = $res->fetch_assoc()) {
        $decoded = urldecode($row['post_name']);
        $has_hebrew = preg_match('/[\x{0590}-\x{05FF}]/u', $decoded);
        if (!$has_hebrew) { $skipped++; continue; }

        $proposed = hebrew_to_slug($row['post_title'], $dict);
        if (empty($proposed)) { $proposed = 'article-' . $row['ID']; }

        // Ensure uniqueness
        $base = $proposed;
        $counter = 2;
        while (isset($existing[$proposed]) && $existing[$proposed]) {
            $proposed = $base . '-' . $counter;
            $counter++;
        }
        $existing[$proposed] = true;

        $proposals[] = [
            'id' => (int)$row['ID'],
            'type' => $row['post_type'],
            'status' => $row['post_status'],
            'title' => $row['post_title'],
            'old_slug' => $row['post_name'],
            'old_decoded' => $decoded,
            'new_slug' => $proposed
        ];
    }

    $total = $conn->query("SELECT COUNT(*) as c FROM {$table_prefix}posts
        WHERE post_status IN ('publish','draft','private')
        AND post_type IN ('post','page','articles','justice_lawyer')")->fetch_assoc()['c'];

    echo json_encode([
        'page' => $page, 'per_page' => $limit,
        'total_posts' => (int)$total, 'total_pages' => ceil($total / $limit),
        'proposals_count' => count($proposals), 'skipped_already_english' => $skipped,
        'proposals' => $proposals
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ════════════════════════════════════════
// ACTION: apply_slugs — actually update DB
// ════════════════════════════════════════
if ($action === 'apply_slugs') {
    $page = (int)($_GET['page'] ?? 0);
    $limit = 50; // smaller batches for safety
    $offset = $page * $limit;

    $existing = [];
    $r = $conn->query("SELECT post_name FROM {$table_prefix}posts WHERE post_name != ''");
    while ($row = $r->fetch_assoc()) $existing[$row['post_name']] = true;

    $sql = "SELECT ID, post_name, post_title, post_type, post_status
            FROM {$table_prefix}posts
            WHERE post_status IN ('publish','draft','private')
            AND post_type IN ('post','page','articles','justice_lawyer')
            ORDER BY post_type, ID LIMIT $limit OFFSET $offset";
    $res = $conn->query($sql);
    $updated = []; $errors = []; $skipped = 0;

    while ($row = $res->fetch_assoc()) {
        $decoded = urldecode($row['post_name']);
        if (!preg_match('/[\x{0590}-\x{05FF}]/u', $decoded)) { $skipped++; continue; }

        $proposed = hebrew_to_slug($row['post_title'], $dict);
        if (empty($proposed)) $proposed = 'article-' . $row['ID'];

        $base = $proposed;
        $counter = 2;
        while (isset($existing[$proposed])) { $proposed = $base.'-'.$counter; $counter++; }
        $existing[$proposed] = true;

        // Store old slug for WordPress built-in redirect
        $old = $conn->real_escape_string($row['post_name']);
        $new = $conn->real_escape_string($proposed);
        $id = (int)$row['ID'];

        $conn->begin_transaction();
        try {
            // Update slug
            $conn->query("UPDATE {$table_prefix}posts SET post_name='$new' WHERE ID=$id");
            // Store old slug for WP redirect (wp_old_slug_redirect)
            $conn->query("INSERT INTO {$table_prefix}postmeta (post_id, meta_key, meta_value)
                          VALUES ($id, '_wp_old_slug', '$old')");
            $conn->commit();
            $updated[] = ['id'=>$id,'old'=>$row['post_name'],'new'=>$proposed,'title'=>$row['post_title']];
        } catch (Exception $e) {
            $conn->rollback();
            $errors[] = ['id'=>$id,'error'=>$e->getMessage()];
        }
    }

    echo json_encode([
        'page'=>$page,'updated_count'=>count($updated),
        'skipped'=>$skipped,'errors'=>$errors,'updated'=>$updated
    ], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    exit;
}

// ════════════════════════════════════════
// ACTION: check_duplicates
// ════════════════════════════════════════
if ($action === 'check_duplicates') {
    $sql = "SELECT post_name, GROUP_CONCAT(ID) as ids, COUNT(*) as cnt,
            GROUP_CONCAT(post_type) as types, GROUP_CONCAT(post_status) as statuses
            FROM {$table_prefix}posts
            WHERE post_name != '' AND post_status != 'auto-draft'
            GROUP BY post_name HAVING cnt > 1 ORDER BY cnt DESC LIMIT 100";
    $res = $conn->query($sql);
    $dupes = [];
    while ($row = $res->fetch_assoc()) $dupes[] = $row;
    echo json_encode(['duplicate_slugs_found'=>count($dupes),'duplicates'=>$dupes],
        JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['error'=>'Actions: export_slugs&page=N, generate_slugs&page=N, apply_slugs&page=N, check_duplicates']);
