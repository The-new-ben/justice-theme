<?php
$dir = new RecursiveDirectoryIterator(__DIR__ . "/justice-theme");
$ite = new RecursiveIteratorIterator($dir);
$files = new RegexIterator($ite, "/.*\.php$/", RegexIterator::GET_MATCH);

$translations = [
    "Legal articles" => "מאמרים משפטיים",
    "Practice areas" => "תחומי משפט",
    "Years active" => "שנות פעילות",
    "Legal topics" => "נושאים משפטיים",
    "Browse by practice area" => "חיפוש לפי תחום משפטי",
    "Start with the legal field closest to your situation and continue to focused legal guides." => "התחילו מהתחום המשפטי הקרוב למצבכם והמשיכו למדריכים ממוקדים.",
    "Latest guides" => "מדריכים משפטיים אחרונים",
    "Recent legal articles" => "מאמרים משפטיים אחרונים",
    "View all articles" => "צפייה בכל המאמרים",
    "Israeli legal information portal" => "פורטל מידע משפטי",
    "Find clear legal information and the right legal direction." => "מידע משפטי ברור, מדריכים מקצועיים וחיבור לעורכי דין מתאימים",
    "Browse legal guides by field, understand your options, and send an inquiry to be matched with relevant legal help." => "Jus-Tice מרכז מאמרים משפטיים, מדריכים ותחומי משפט כדי לעזור לכם להבין את הזכויות שלכם ולמצוא את הכיוון המשפטי הנכון.",
    "Search legal guides" => "חיפוש מדריכים משפטיים",
    "Search divorce, traffic law, real estate, inheritance..." => "חיפוש גירושין, דיני תעבורה, מקרקעין, ירושה...",
    "Search" => "חיפוש",
    "Popular legal areas" => "תחומי משפט נפוצים",
    "Need legal direction?" => "צריכים עזרה משפטית?",
    "Send a short inquiry and we will help route it to the relevant legal field." => "שלחו פנייה קצרה ונעזור להפנות אותה לתחום המשפטי הרלוונטי.",
    "Call %s" => "חייגו %s",
    "Send inquiry" => "שליחת פנייה",
    "Legal information, lawyer matching, and practical legal guidance." => "מידע משפטי, התאמת עורכי דין וייעוץ מעשי.",
    "Secondary navigation" => "ניווט משני",
    "Open navigation menu" => "פתיחת תפריט ניווט",
    "Primary navigation" => "ניווט ראשי",
    "Home" => "עמוד הבית",
    "Articles" => "מאמרים משפטיים",
    "A legal information portal built to help people understand legal topics and connect with relevant legal professionals." => "פורטל מידע משפטי שנבנה כדי לעזור להבין נושאים משפטיים וליצור קשר עם אנשי מקצוע מתאימים.",
    "Legal areas" => "תחומי משפט",
    "Information" => "מידע שימושי",
    "Contact" => "צור קשר",
    "WhatsApp" => "וואטסאפ",
    "All rights reserved." => "כל הזכויות שמורות.",
    "The information on this website is general information only and does not replace legal advice." => "המידע המופיע באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.",
    "Search legal articles" => "חיפוש מאמרים משפטיים",
    "Search legal topic..." => "חיפוש נושא משפטי...",
    "Read more" => "קראו עוד",
    "Read guide" => "קראו מדריך",
    "Full name" => "שם מלא",
    "Phone" => "טלפון",
    "Legal area" => "תחום משפטי",
    "Select legal area" => "בחרו תחום משפטי",
    "Family law" => "דיני משפחה",
    "Criminal law" => "משפט פלילי",
    "Traffic law" => "דיני תעבורה",
    "Real estate law" => "מקרקעין ונדל״ן",
    "Labor law" => "דיני עבודה",
    "Damages and injury" => "נזיקין",
    "Other" => "אחר",
    "Submit Details" => "שליחת פרטים",
    "Skip to content" => "דילוג לתוכן",
    "Primary Menu" => "תפריט ראשי",
    "Secondary Menu" => "תפריט משני",
    "Mobile Menu" => "תפריט נייד",
    "Footer Menu" => "תפריט תחתון",
    "Legal Areas Menu" => "תפריט תחומי משפט",
    "Footer Trust Menu" => "תפריט מידע שימושי",
    "Results for: %s" => "תוצאות חיפוש עבור: %s",
    "It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help." => "נראה שלא מצאנו את מה שחיפשת. אולי כדאי לנסות שוב עם מונח אחר.",
    "Page not found" => "העמוד לא נמצא",
    "We could not find the page you are looking for." => "לא מצאנו את העמוד שחיפשת.",
    "Back to homepage" => "חזרה לעמוד הבית",
    "Nothing here" => "אין כאן כלום",
    "Sorry, but nothing matched your search terms. Please try again with some different keywords." => "מצטערים, אך לא נמצאו תוצאות התואמות לחיפוש. אנא נסו שוב עם מילים אחרות.",
    "Related legal guides" => "מדריכים משפטיים קשורים"
];

$count = 0;
foreach($files as $file) {
    $path = $file[0];
    $content = file_get_contents($path);
    $original = $content;
    
    foreach($translations as $en => $he) {
        $escaped_en = preg_quote($en, "/");
        $content = preg_replace("/(['\"])$escaped_en(['\"])/", "$1$he$2", $content);
    }
    
    if ($original !== $content) {
        file_put_contents($path, $content);
        echo "Updated $path\n";
        $count++;
    }
}
echo "Total files updated: $count\n";
?>
