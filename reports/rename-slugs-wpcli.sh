# WP-CLI: Rename weak slugs to SEO-optimized slugs
# Run from server root: wp post list --post_type=post,page --fields=ID,post_name --format=csv
# Then for each slug match, run: wp post update <ID> --post_name=<new-slug>

# Topic: בגץ הבוגדת - Supreme Court ruling on adultery
OLD_SLUG=article-12007
NEW_SLUG=bgz-infidelity-adultery-supreme-court-ruling
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: אמנת האומות המאוחדות נגד שחיתות
OLD_SLUG=article-9128
NEW_SLUG=un-convention-against-corruption-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דילמת אסיר חף מפשע
OLD_SLUG=article-9126
NEW_SLUG=innocent-prisoner-dilemma-criminal-defense-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מנתח פלסטי פנים - רשלנות
OLD_SLUG=article-8808
NEW_SLUG=plastic-surgeon-face-malpractice-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מהו רופא תפקידו וחובותיו המקצועיות
OLD_SLUG=article-8318
NEW_SLUG=doctor-role-duties-professional-obligations-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סוגים שונים של רופאים
OLD_SLUG=article-8142
NEW_SLUG=types-of-doctors-medical-specializations-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: עורך דין צבאי - WRONG INTENT FIX
OLD_SLUG=lawyer-recommended-law-price
NEW_SLUG=military-lawyer-israel-court-martial-defense
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: police crime data transparency publications
OLD_SLUG=article-6882
NEW_SLUG=police-crime-data-transparency-report-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מצא עורך דין בקרבתך
OLD_SLUG=lawyer
NEW_SLUG=find-lawyer-near-me-israel-all-areas
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: ניהול מוניטין מקוון לעורכי דין
OLD_SLUG=lawyers
NEW_SLUG=lawyers-online-reputation-management-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: קניית דירה ישראל רשימת בדיקה משפטית
OLD_SLUG=house
NEW_SLUG=buying-apartment-israel-legal-checklist
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מיסוי ישראל מדריך חובות 2025
OLD_SLUG=tax
NEW_SLUG=tax-law-israel-guide-obligations-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סדר הדין האזרחי ישראל בתי משפט
OLD_SLUG=civil
NEW_SLUG=civil-procedure-law-israel-courts-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מערכת בתי המשפט ישראל היררכיה
OLD_SLUG=courts
NEW_SLUG=courts-system-israel-guide-hierarchy
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מהו בית משפט ישראל מדריך משפטי
OLD_SLUG=court
NEW_SLUG=what-is-a-court-israel-legal-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעות אזרחיות ישראל הליך מדריך
OLD_SLUG=lawsuits
NEW_SLUG=civil-lawsuits-israel-procedure-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: בתי משפט ירושלים הליכים משפטיים
OLD_SLUG=jerusalem
NEW_SLUG=jerusalem-courts-legal-proceedings-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: זכויות פרטיות קורונה עבודה ישראל
OLD_SLUG=privacy
NEW_SLUG=privacy-rights-coronavirus-employment-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דיני חברות ישראל רישום מדריך
OLD_SLUG=company
NEW_SLUG=company-law-israel-incorporation-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: פרקליטות המדינה הליך פלילי ישראל
OLD_SLUG=prosecution
NEW_SLUG=state-prosecution-israel-criminal-process
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חוק העונשין ישראל דיני עונשין מדריך
OLD_SLUG=penal
NEW_SLUG=penal-code-israel-criminal-law-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הרשעה פלילית ישראל אפשרויות הגנה
OLD_SLUG=conviction
NEW_SLUG=criminal-conviction-israel-defense-options
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: גזירת עונש פלילי ישראל מדריך עונשים
OLD_SLUG=punishment
NEW_SLUG=criminal-sentencing-israel-penalties-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תפקיד השופט ישראל מערכת בתי משפט
OLD_SLUG=judge
NEW_SLUG=judge-role-israel-court-system
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דיני ראיות ישראל פלילי אזרחי
OLD_SLUG=evidence
NEW_SLUG=evidence-law-israel-criminal-civil
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: כונסי נכסים ניהול רכוש בית משפט
OLD_SLUG=properties
NEW_SLUG=receivers-trustees-property-management-court
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: העברת משמורת ילדים אם אב ישראל
OLD_SLUG=custody
NEW_SLUG=child-custody-transfer-mother-father-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חישוב מזונות ילדים חיוב האב ישראל
OLD_SLUG=alimony
NEW_SLUG=child-alimony-calculation-father-obligation-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: זכויות נשים אלימות במשפחה ישראל
OLD_SLUG=right
NEW_SLUG=womens-rights-domestic-violence-israel-law
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חשבונות עיזבון סכסוך אחים ירושה
OLD_SLUG=accounts
NEW_SLUG=inheritance-estate-accounts-siblings-dispute
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: NSO פגסוס תוכנת ריגול משטרת ישראל
OLD_SLUG=nso
NEW_SLUG=nso-pegasus-spyware-israel-police-legal
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: קורונה זכויות עבודה ישראל מעסיק
OLD_SLUG=19-covid
NEW_SLUG=covid-19-employment-rights-israel-employer
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: טופס 161 הודעת מעביד עזיבת עובד
OLD_SLUG=161
NEW_SLUG=form-161-employee-departure-employer-notice-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: זכויות דיגיטליות פייסבוק בית משפט ישראל
OLD_SLUG=verdict-rights
NEW_SLUG=facebook-copyright-digital-rights-court-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: ערעור פלילי מס בית משפט עליון ישראל
OLD_SLUG=verdict-appeal
NEW_SLUG=criminal-tax-appeal-supreme-court-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סכסוך ירושה צוואה יורשים בית משפט
OLD_SLUG=verdict-will
NEW_SLUG=inheritance-will-dispute-heirs-court-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סדר דין פלילי זכויות חקירה ישראל
OLD_SLUG=procedures-law
NEW_SLUG=criminal-procedure-rights-investigation-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סמכות שיפוט הליכים משפטיים ישראל
OLD_SLUG=proceedings-law
NEW_SLUG=legal-proceedings-jurisdiction-israel-courts
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דיני נזיקין כללים חדשים ישראל פיצויים 2025
OLD_SLUG=torts-new
NEW_SLUG=tort-law-new-rules-israel-damages-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חוק בתי המשפט ניהול שיפוט ישראל
OLD_SLUG=courts-law
NEW_SLUG=courts-administration-law-israel-jurisdiction
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מעמד קצין משטרה זכויות חוקיות ישראל
OLD_SLUG=police-officer
NEW_SLUG=police-officer-legal-status-rights-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דיני בנקאות חשיפת חשבון ישראל
OLD_SLUG=law-account
NEW_SLUG=banking-law-account-disclosure-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הסכם מזונות גירושין ישראל ילדים
OLD_SLUG=alimony-agreement
NEW_SLUG=alimony-divorce-agreement-israel-child-support
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: אכיפת הסכם גירושין תביעה משפטית
OLD_SLUG=agreement-lawsuit
NEW_SLUG=post-divorce-agreement-enforcement-lawsuit
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הסכם הסדר גירושין אישור בית משפט
OLD_SLUG=consent-agreement
NEW_SLUG=consent-decree-court-divorce-settlement
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: בקשת אישור הסדר חוב נושים
OLD_SLUG=petition-approval
NEW_SLUG=petition-approval-debt-arrangement-creditors
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הנחיות גזירת עונש פלילי ישראל 2025
OLD_SLUG=criminal-sentencing
NEW_SLUG=criminal-sentencing-guidelines-israel-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: אפשרויות ערעור הרשעה פלילית ישראל
OLD_SLUG=criminal-conviction
NEW_SLUG=criminal-conviction-appeal-options-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: עבירה פלילית ורישוי עסקים ישראל
OLD_SLUG=offense-license
NEW_SLUG=criminal-offense-business-license-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעת הפחתת מזונות שינוי נסיבות
OLD_SLUG=lawsuit-alimony
NEW_SLUG=alimony-lawsuit-reduction-changed-circumstances
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעת חיוב חוזי ישראל אזרחי
OLD_SLUG=lawsuit-obligations
NEW_SLUG=contract-obligations-lawsuit-israel-civil
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעת נזיקין רשלנות פיצויים ישראל
OLD_SLUG=lawsuit-torts
NEW_SLUG=tort-lawsuit-negligence-damages-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סמכות שירות המדינה שיפוט משפטי
OLD_SLUG=law-jurisdiction
NEW_SLUG=civil-service-authority-legal-jurisdiction
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: ביטול כתב אישום פלילי ישראל
OLD_SLUG=indictment-cancellation
NEW_SLUG=criminal-indictment-cancellation-withdrawal-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הליכי גירושין כללים מיוחדים רבניים
OLD_SLUG=proceedings-divorce
NEW_SLUG=divorce-proceedings-special-rules-rabbinical
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תקנות שכירות ישראל משכיר שוכר
OLD_SLUG=regulations
NEW_SLUG=tenancy-regulation-israel-landlord-tenant
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעה תאגידית מעסיק עובד ישראל
OLD_SLUG=lawsuits-companies
NEW_SLUG=corporate-lawsuit-employer-employee-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חקירה פלילית הליך זכויות ישראל
OLD_SLUG=investigation-criminal
NEW_SLUG=criminal-investigation-procedure-rights-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מדריך עורכי דין שופטים מומחים ישראל
OLD_SLUG=lawyers-judge
NEW_SLUG=expert-lawyers-judges-directory-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: בקשה לגירושין בית דין רבני ישראל
OLD_SLUG=rabbinical-court
NEW_SLUG=rabbinical-court-divorce-request-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: הליך משפטי פלילי ישראל מדריך
OLD_SLUG=procedure
NEW_SLUG=criminal-legal-procedure-israel-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: חדשות דיני עונשין עדכונים ישראל 2025
OLD_SLUG=news-criminal
NEW_SLUG=criminal-law-news-updates-israel-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: גירושין ידועים בציבור פרידה ישראל
OLD_SLUG=divorce-partners
NEW_SLUG=common-law-divorce-cohabiting-partners-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: פסיקת פיצויים נזק גוף ישראל
OLD_SLUG=compensation-law
NEW_SLUG=personal-injury-compensation-verdict-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: תביעת פיצויים הפרת פרטיות ישראל
OLD_SLUG=compensation-privacy
NEW_SLUG=privacy-violation-compensation-lawsuit-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: סקירת המערכת המשפטית ישראל 2025
OLD_SLUG=law-israel
NEW_SLUG=overview-israel-legal-system-courts-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: מדריך 101 שכירת עורך דין ישראל
OLD_SLUG=lawyer-101
NEW_SLUG=lawyer-101-guide-hiring-attorney-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: כיצד למצוא עורך דין מוסמך ישראל
OLD_SLUG=lawyer-law
NEW_SLUG=how-to-find-qualified-lawyer-israel-guide
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: דיני מס ישראל מע״מ הכנסה 2025
OLD_SLUG=tax-law-destination
NEW_SLUG=tax-law-obligations-vat-income-israel-2025
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: בקשת תביעת פיצויים ישראל
OLD_SLUG=request-damages
NEW_SLUG=compensation-claim-request-lawsuit-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

# Topic: פיצויים ליקויי בנייה קבלן דירה ישראל
OLD_SLUG=compensation-apartment
NEW_SLUG=apartment-defects-contractor-compensation-israel
POST_ID=$(wp post list --post_status=any --post_type=post,page --name="$OLD_SLUG" --fields=ID --format=csv | tail -1)
if [ -n "$POST_ID" ] && [ "$POST_ID" != "ID" ]; then
  wp post update "$POST_ID" --post_name="$NEW_SLUG"
  echo "Renamed: $OLD_SLUG -> $NEW_SLUG (ID: $POST_ID)"
else
  echo "NOT FOUND: $OLD_SLUG"
fi

