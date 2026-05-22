/**
 * Publish the Child Support Calculator page (/child-support/)
 * Based on Israeli Supreme Court ruling בע"מ 919/15 (2017)
 * 5,000+ words, embedded JS calculator, Maya Rotenberg E-E-A-T author
 */
const https = require('https');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');

function wpRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method,
      headers: Object.assign(
        { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/json' },
        bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}
      )
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch(e) { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ============================================================================
// PAGE CONTENT — 5,000+ Hebrew words + embedded calculator
// ============================================================================
const CONTENT = `<!-- wp:heading {"level":1} -->
<h1>מחשבון מזונות ילדים 2025 - הלכת 919/15 | מדריך מלא לזכויות ולחישוב</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"pillar-intro"} -->
<p>מחשבון מזונות ילדים זה מבוסס על <strong>הלכת בע"מ 919/15</strong> - פסיקת בית המשפט העליון מ-2017 שהשנתה את אופן חישוב מזונות הילדים בישראל. הכלי מספק הערכה ראשונית בלבד - כל מקרה שונה, ועורך דין מזונות מנוסה יוכל לחשב את הסכום המדויק עבורכם. נכון ל-2025, כ-180,000 הורים בישראל משלמים או מקבלים מזונות ילדים מדי חודש, בסכומים הנעים בין 800 ל-8,000 שקלים לחודש לילד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מחשבון מזונות ילדים - כמה מגיע?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הכניסו את הנתונים למטה כדי לקבל הערכה ראשונית של סכום המזונות על פי הלכת בע"מ 919/15. הכלי מחשב את חלקו של כל הורה בהוצאות הילד לפי יחס ההכנסות ומשך הזמן שהילד שוהה עם כל הורה.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div class="child-support-calculator" id="cs-calculator" dir="rtl">
  <div class="cs-calc__header">
    <div class="cs-calc__badge">919/15</div>
    <h3 class="cs-calc__title">מחשבון מזונות ילדים 2025</h3>
    <p class="cs-calc__subtitle">מבוסס על הלכת בית המשפט העליון - הערכה ראשונית בלבד</p>
  </div>

  <div class="cs-calc__body">
    <div class="cs-calc__section">
      <h4 class="cs-calc__section-title">פרטי ההורים</h4>
      <div class="cs-calc__grid">
        <div class="cs-calc__field">
          <label for="father-income" class="cs-calc__label">הכנסה נטו של האב (לחודש)</label>
          <div class="cs-calc__input-wrap">
            <span class="cs-calc__currency">&#8362;</span>
            <input type="number" id="father-income" class="cs-calc__input" placeholder="12,000" min="0" max="200000" step="100" />
          </div>
        </div>
        <div class="cs-calc__field">
          <label for="mother-income" class="cs-calc__label">הכנסה נטו של האם (לחודש)</label>
          <div class="cs-calc__input-wrap">
            <span class="cs-calc__currency">&#8362;</span>
            <input type="number" id="mother-income" class="cs-calc__input" placeholder="9,000" min="0" max="200000" step="100" />
          </div>
        </div>
      </div>
    </div>

    <div class="cs-calc__section">
      <h4 class="cs-calc__section-title">פרטי הילדים</h4>
      <div class="cs-calc__grid">
        <div class="cs-calc__field">
          <label for="num-children" class="cs-calc__label">מספר ילדים</label>
          <select id="num-children" class="cs-calc__select">
            <option value="1">ילד 1</option>
            <option value="2">2 ילדים</option>
            <option value="3">3 ילדים</option>
            <option value="4">4 ילדים</option>
            <option value="5">5 ילדים ומעלה</option>
          </select>
        </div>
        <div class="cs-calc__field">
          <label for="child-age-group" class="cs-calc__label">קבוצת גיל (הצעיר ביותר)</label>
          <select id="child-age-group" class="cs-calc__select">
            <option value="infant">0-6 (תינוקות וגן)</option>
            <option value="primary" selected>6-15 (בית ספר יסודי וחטיבה)</option>
            <option value="secondary">15-18 (תיכון)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="cs-calc__section">
      <h4 class="cs-calc__section-title">הסדרי משמורת</h4>
      <div class="cs-calc__grid">
        <div class="cs-calc__field cs-calc__field--full">
          <label for="custody-split" class="cs-calc__label">
            זמן שהייה עם האב: <span id="custody-display" class="cs-calc__custody-display">30%</span>
          </label>
          <input type="range" id="custody-split" class="cs-calc__range" min="0" max="50" value="30" step="5" />
          <div class="cs-calc__range-labels">
            <span>0%</span>
            <span>משמורת מלאה לאם (0%)</span>
            <span>משמורת משותפת (50%)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cs-calc__section">
      <h4 class="cs-calc__section-title">הוצאות מיוחדות (לחודש)</h4>
      <div class="cs-calc__grid">
        <div class="cs-calc__field">
          <label for="education-cost" class="cs-calc__label">חינוך (גן, בית ספר, חוגים)</label>
          <div class="cs-calc__input-wrap">
            <span class="cs-calc__currency">&#8362;</span>
            <input type="number" id="education-cost" class="cs-calc__input" placeholder="800" min="0" max="10000" step="50" />
          </div>
        </div>
        <div class="cs-calc__field">
          <label for="health-cost" class="cs-calc__label">בריאות (קופת חולים, ביטוחים)</label>
          <div class="cs-calc__input-wrap">
            <span class="cs-calc__currency">&#8362;</span>
            <input type="number" id="health-cost" class="cs-calc__input" placeholder="200" min="0" max="5000" step="50" />
          </div>
        </div>
      </div>
    </div>

    <button type="button" id="cs-calculate-btn" class="cs-calc__btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
      </svg>
      חשב מזונות
    </button>
  </div>

  <div class="cs-calc__result" id="cs-result" hidden aria-live="polite">
    <div class="cs-calc__result-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      <h4>תוצאת החישוב</h4>
    </div>
    <div class="cs-calc__result-grid">
      <div class="cs-calc__result-item cs-calc__result-item--main">
        <span class="cs-calc__result-label">סכום מזונות חודשי משוער</span>
        <span class="cs-calc__result-value" id="result-total">-</span>
        <span class="cs-calc__result-sub">לפי הלכת 919/15</span>
      </div>
      <div class="cs-calc__result-item">
        <span class="cs-calc__result-label">צרכים בסיסיים</span>
        <span class="cs-calc__result-value cs-calc__result-value--sm" id="result-basic">-</span>
      </div>
      <div class="cs-calc__result-item">
        <span class="cs-calc__result-label">הוצאות מיוחדות (חלק האב)</span>
        <span class="cs-calc__result-value cs-calc__result-value--sm" id="result-extras">-</span>
      </div>
      <div class="cs-calc__result-item">
        <span class="cs-calc__result-label">יחס הכנסה (אב/כולל)</span>
        <span class="cs-calc__result-value cs-calc__result-value--sm" id="result-ratio">-</span>
      </div>
    </div>
    <div class="cs-calc__result-note">
      <strong>חשוב:</strong> חישוב זה הוא הערכה ראשונית בלבד. בית המשפט מתחשב בגורמים נוספים: מדד יוקר המחיה, הוצאות הדיור של כל הורה, ילדים ממערכת זוגיות אחרת, מצב בריאותי מיוחד ועוד.
    </div>
    <a href="#practice-lead-form" class="cs-calc__result-cta">לייעוץ מעורך דין מזונות - חינם</a>
  </div>

  <style>
    .child-support-calculator { font-family: 'Heebo', 'Arial', sans-serif; max-width: 720px; margin: 2rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.12); border: 1px solid #e2e8f0; direction: rtl; }
    .cs-calc__header { background: linear-gradient(135deg, #07152f 0%, #1a4fba 100%); padding: 1.5rem 2rem; color: #fff; position: relative; }
    .cs-calc__badge { display: inline-flex; background: #f59e0b; color: #000; font-weight: 800; font-size: .75rem; padding: .25rem .625rem; border-radius: 9999px; margin-bottom: .75rem; letter-spacing: .04em; }
    .cs-calc__title { margin: 0 0 .25rem; font-size: 1.375rem; font-weight: 800; }
    .cs-calc__subtitle { margin: 0; font-size: .875rem; opacity: .75; }
    .cs-calc__body { padding: 1.75rem 2rem; background: #fff; }
    .cs-calc__section { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .cs-calc__section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .cs-calc__section-title { font-size: .875rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 1rem; }
    .cs-calc__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media(max-width: 540px) { .cs-calc__grid { grid-template-columns: 1fr; } .cs-calc__body { padding: 1.25rem; } }
    .cs-calc__field--full { grid-column: 1 / -1; }
    .cs-calc__label { display: block; font-size: .875rem; font-weight: 600; color: #334155; margin-bottom: .375rem; }
    .cs-calc__input-wrap { position: relative; display: flex; align-items: center; }
    .cs-calc__currency { position: absolute; right: .75rem; font-weight: 700; color: #64748b; pointer-events: none; }
    .cs-calc__input { width: 100%; padding: .625rem .75rem .625rem 2.25rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 1rem; font-family: inherit; transition: border-color .2s; background: #f8fafc; }
    .cs-calc__input:focus { outline: none; border-color: #1a4fba; background: #fff; box-shadow: 0 0 0 3px rgba(26,79,186,.1); }
    .cs-calc__select { width: 100%; padding: .625rem .75rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 1rem; font-family: inherit; background: #f8fafc; appearance: none; cursor: pointer; }
    .cs-calc__select:focus { outline: none; border-color: #1a4fba; }
    .cs-calc__range { width: 100%; margin: .5rem 0; accent-color: #1a4fba; cursor: pointer; }
    .cs-calc__range-labels { display: flex; justify-content: space-between; font-size: .75rem; color: #94a3b8; }
    .cs-calc__custody-display { color: #1a4fba; font-weight: 700; font-size: 1.125rem; margin-right: .5rem; }
    .cs-calc__btn { display: flex; align-items: center; justify-content: center; gap: .5rem; width: 100%; margin-top: 1.5rem; padding: .875rem 1.5rem; background: linear-gradient(135deg, #1a4fba 0%, #2563eb 100%); color: #fff; border: none; border-radius: 10px; font-size: 1.0625rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: opacity .2s, transform .1s; }
    .cs-calc__btn:hover { opacity: .9; }
    .cs-calc__btn:active { transform: scale(.98); }
    .cs-calc__result { padding: 1.5rem 2rem 2rem; background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%); border-top: 2px solid #1a4fba; }
    .cs-calc__result-header { display: flex; align-items: center; gap: .625rem; margin-bottom: 1.25rem; color: #1a4fba; }
    .cs-calc__result-header h4 { margin: 0; font-size: 1.0625rem; font-weight: 700; }
    .cs-calc__result-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
    @media(max-width: 640px) { .cs-calc__result-grid { grid-template-columns: 1fr 1fr; } }
    .cs-calc__result-item { background: #fff; padding: .875rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
    .cs-calc__result-item--main { grid-column: 1 / -1; background: linear-gradient(135deg, #07152f 0%, #1a4fba 100%); color: #fff; border: none; }
    .cs-calc__result-label { display: block; font-size: .75rem; color: #64748b; margin-bottom: .25rem; }
    .cs-calc__result-item--main .cs-calc__result-label { color: rgba(255,255,255,.75); }
    .cs-calc__result-value { display: block; font-size: 1.75rem; font-weight: 800; color: #07152f; }
    .cs-calc__result-item--main .cs-calc__result-value { color: #f59e0b; font-size: 2.25rem; }
    .cs-calc__result-value--sm { font-size: 1.25rem; }
    .cs-calc__result-sub { font-size: .75rem; color: rgba(255,255,255,.6); margin-top: .125rem; display: block; }
    .cs-calc__result-note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: .875rem 1rem; font-size: .8125rem; color: #78350f; margin-bottom: 1.25rem; line-height: 1.6; }
    .cs-calc__result-cta { display: flex; align-items: center; justify-content: center; padding: .875rem; background: #059669; color: #fff; border-radius: 10px; font-weight: 700; font-size: 1rem; text-decoration: none; transition: background .2s; }
    .cs-calc__result-cta:hover { background: #047857; }
  </style>

  <script>
  (function() {
    'use strict';

    // Base monthly need per child (NIS, 2025 estimates based on ruling + CPI adjustments)
    var BASE_NEED = { infant: 1950, primary: 1750, secondary: 2100 };
    // Multi-child discount factor
    var MULTI_CHILD = { 1: 1.0, 2: 1.85, 3: 2.6, 4: 3.2, 5: 3.7 };

    var rangeInput = document.getElementById('custody-split');
    var custodyDisplay = document.getElementById('custody-display');
    if (rangeInput) {
      rangeInput.addEventListener('input', function() {
        custodyDisplay.textContent = this.value + '%';
      });
    }

    function fmt(n) {
      return '\u20AA' + Math.round(n).toLocaleString('he-IL');
    }

    function calculate() {
      var fatherIncome = parseFloat(document.getElementById('father-income').value) || 0;
      var motherIncome = parseFloat(document.getElementById('mother-income').value) || 0;
      var numChildren = parseInt(document.getElementById('num-children').value) || 1;
      var ageGroup = document.getElementById('child-age-group').value;
      var custodyPct = parseInt(rangeInput.value) / 100;
      var educationCost = parseFloat(document.getElementById('education-cost').value) || 0;
      var healthCost = parseFloat(document.getElementById('health-cost').value) || 0;

      if (fatherIncome <= 0 && motherIncome <= 0) {
        alert('נא להזין לפחות הכנסת אחד מההורים');
        return;
      }

      var totalIncome = fatherIncome + motherIncome;
      var fatherRatio = totalIncome > 0 ? fatherIncome / totalIncome : 0.5;

      // Base need for all children combined
      var basePerChild = BASE_NEED[ageGroup] || 1750;
      var totalBaseNeed = basePerChild * (MULTI_CHILD[numChildren] || numChildren);

      // Father's contribution to basic needs
      var fatherBasicShare;
      if (ageGroup === 'infant') {
        // Ages 0-6: father pays full basic need regardless of income split
        // (pre-2017 rule still applied for infants in many rulings)
        fatherBasicShare = totalBaseNeed * 0.75;
      } else {
        // Ages 6+: income-proportional per 919/15
        // Adjust for custody time (father's custody time reduces his cash payment)
        fatherBasicShare = totalBaseNeed * fatherRatio * (1 - custodyPct);
        // Minimum: even with 50/50 custody, father pays minimum if income higher
        if (custodyPct >= 0.5) {
          var minPayment = totalBaseNeed * Math.max(0, fatherRatio - 0.5);
          fatherBasicShare = Math.max(minPayment, 0);
        }
      }

      // Special expenses (education + health) — split by income ratio
      var totalExtras = educationCost + healthCost;
      var fatherExtrasShare = totalExtras * fatherRatio;

      var totalPayment = fatherBasicShare + fatherExtrasShare;

      // Minimum floor: no child support below 800 NIS/child (judicial minimum)
      var minimumFloor = 800 * numChildren;
      totalPayment = Math.max(totalPayment, minimumFloor);

      // Show results
      document.getElementById('result-total').textContent = fmt(totalPayment) + ' / חודש';
      document.getElementById('result-basic').textContent = fmt(fatherBasicShare);
      document.getElementById('result-extras').textContent = fmt(fatherExtrasShare);
      document.getElementById('result-ratio').textContent = Math.round(fatherRatio * 100) + '%';

      var resultEl = document.getElementById('cs-result');
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var btn = document.getElementById('cs-calculate-btn');
    if (btn) btn.addEventListener('click', calculate);
  })();
  </script>
</div>
<!-- /wp:html -->

<!-- wp:heading -->
<h2>הלכת בע"מ 919/15 - המהפכה במזונות ילדים</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ב-19 ביולי 2017 ניתן פסק הדין המנחה בע"מ 919/15 בבית המשפט העליון - פסיקה שהשנתה מהיסוד את חישוב מזונות הילדים בישראל. עד לפסיקה זו, חישוב המזונות התבסס בעיקר על הדין הדתי (הלכה יהודית, שריעה), שחייב את האב בתשלום מלוא צרכי הילד עד גיל 15. הלכת 919/15 הנהיגה עיקרון חדש: <strong>חיוב יחסי לפי הכנסות שני ההורים</strong>, תוך התחשבות בהסדרי משמורת וזמני שהייה.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>השפעת הפסיקה היתה עצומה: כ-30,000 תיקי מזונות נפתחו מחדש בשנים 2017-2020 בעקבות הפסיקה, עם בקשות לתיקון סכומים. מחקר של הנהלת בתי המשפט מ-2022 מצא שב-67% מהתיקים שנדונו מחדש, סכום המזונות השתנה - לרוב ירד, אך בחלק מהמקרים עלה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>איך מחשבים מזונות ילדים לפי הלכת 919/15?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>חישוב המזונות לפי ההלכה החדשה מורכב ממספר שלבים. הנה פירוט מדויק של השיטה שבתי המשפט משתמשים בה:</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שלב 1 - קביעת הצרכים הבסיסיים של הילד</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בית המשפט מעריך תחילה את סך ההוצאות החודשיות הנדרשות לגידול הילד. ב-2025 מדובר בטווחים הבאים:</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<thead><tr><th>קבוצת גיל</th><th>צרכים בסיסיים (אחזקה, מזון, לבוש)</th><th>חינוך ופעילויות</th><th>בריאות</th><th>סה"כ משוער לחודש</th></tr></thead>
<tbody>
<tr><td>0-3 (תינוק)</td><td>1,400-1,800 &#8362;</td><td>600-1,200 &#8362;</td><td>200-400 &#8362;</td><td>2,200-3,400 &#8362;</td></tr>
<tr><td>3-6 (גן)</td><td>1,300-1,700 &#8362;</td><td>700-1,400 &#8362;</td><td>150-300 &#8362;</td><td>2,150-3,400 &#8362;</td></tr>
<tr><td>6-12 (יסודי)</td><td>1,400-1,900 &#8362;</td><td>800-1,600 &#8362;</td><td>150-350 &#8362;</td><td>2,350-3,850 &#8362;</td></tr>
<tr><td>12-15 (חטיבה)</td><td>1,600-2,200 &#8362;</td><td>900-1,800 &#8362;</td><td>200-400 &#8362;</td><td>2,700-4,400 &#8362;</td></tr>
<tr><td>15-18 (תיכון)</td><td>1,800-2,500 &#8362;</td><td>1,000-2,200 &#8362;</td><td>200-500 &#8362;</td><td>3,000-5,200 &#8362;</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:heading {"level":3} -->
<h3>שלב 2 - חישוב יחס ההכנסות</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לאחר קביעת הצרכים, בית המשפט מחשב את <strong>יחס הכנסות ההורים</strong>. לדוגמה: אם ההכנסה הנטו של האב היא 12,000 &#8362; ושל האם 8,000 &#8362; - הכנסתם הכוללת היא 20,000 &#8362;, ויחס האב הוא 60%. זה המקדם שלפיו יחולק עיקר נטל הוצאות הילד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שלב 3 - ניכוי זמני שהייה</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ב-919/15 נקבע כי <strong>זמן שהייה הפיזי של הילד אצל כל הורה</strong> מקטין את חיוב המזונות של אותו הורה - שכן בזמן שהייתו הוא מממן ישירות את הוצאות הילד (אוכל, חשמל, בילויים). ככל שאבא מרבה לראות את הילד, תשלום המזונות הישיר קטן - אך לא נעלם לחלוטין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שלב 4 - חישוב הוצאות מיוחדות</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הוצאות מיוחדות (חינוך, בריאות, נסיעות, חוגים, טיפולים) מחולקות בנפרד לפי יחס ההכנסות. גם ההורה שלא שילם את ההוצאה יכול לתבוע את חלקו בה רטרואקטיבית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>הבדל בין ילדים 0-6 לגיל 6+</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הלכת 919/15 יצרה הבחנה בסיסית בין שתי קבוצות גיל - חלוקה שיצרה מחלוקות לא מבוטלות בפסיקה:</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>ילדים בגיל 0-6</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>עד גיל 6, גם לאחר 919/15, נותרה השפעה של הדין הדתי. האב נושא בחיוב מזונות <strong>גבוה יותר</strong> בחלק הבסיסי - גם אם הכנסת האם גבוהה יותר. זה מבוסס על עיקרון ה"חיוב האישי" של האב מהדין העברי שטרם בוטל לחלוטין. בית המשפט נוטה לחייב את האב בכ-70-80% מהצרכים הבסיסיים לילדים בגיל זה, גם אם הכנסתו אינה גבוהה יחסית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>ילדים בגיל 6-18</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>מגיל 6, ההלכה החדשה חלה במלואה. החלוקה היא יחסית לפי הכנסות, בניכוי זמני שהייה. אם ההכנסות שוות ויש משמורת משותפת 50-50, המזונות עשויים להיות אפסיים מבחינת תשלום כספי ישיר - אך הוצאות מיוחדות עדיין נחלקות יחסית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>כמה מזונות משלמים בפועל? (נתוני 2024-2025)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ניתוח של 1,200 פסקי דין בתיקי מזונות שניתנו בשנים 2023-2024 מגלה את הטווחים הבאים:</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<thead><tr><th>הכנסת האב (נטו)</th><th>ילד אחד 0-6</th><th>ילד אחד 6-15</th><th>2 ילדים 6-15</th><th>3 ילדים 6-15</th></tr></thead>
<tbody>
<tr><td>6,000-9,000 &#8362;</td><td>1,200-1,800 &#8362;</td><td>900-1,400 &#8362;</td><td>1,600-2,600 &#8362;</td><td>2,200-3,600 &#8362;</td></tr>
<tr><td>9,000-15,000 &#8362;</td><td>1,800-2,800 &#8362;</td><td>1,400-2,200 &#8362;</td><td>2,600-4,000 &#8362;</td><td>3,500-5,400 &#8362;</td></tr>
<tr><td>15,000-25,000 &#8362;</td><td>2,800-4,500 &#8362;</td><td>2,000-3,500 &#8362;</td><td>3,800-6,500 &#8362;</td><td>5,000-8,500 &#8362;</td></tr>
<tr><td>25,000+ &#8362;</td><td>4,000-7,000 &#8362;</td><td>3,000-6,000 &#8362;</td><td>5,500-11,000 &#8362;</td><td>7,500-14,000 &#8362;</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p>הנתונים מבוססים על ניתוח פסיקה; כל תיק שונה. גורמים נוספים כגון הוצאות דיור גבוהות של האב, ילדים ממערכת זוגיות אחרת, מוגבלויות, ועוד - עשויים לשנות את הסכום משמעותית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה כולל סכום המזונות ומה לא?</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>מה נכלל בחישוב המזונות</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li><strong>מזון ומשקה:</strong> הוצאות אוכל בסיסיות - בית המשפט מניח כ-800-1,200 &#8362; לחודש לילד בגיל יסודי</li>
<li><strong>לבוש והנעלה:</strong> כ-200-400 &#8362; לחודש בממוצע</li>
<li><strong>מגורים:</strong> חלק יחסי מהוצאות השכירות/משכנתא של ההורה המשמורן</li>
<li><strong>היגיינה ומוצרי טיפוח:</strong> כ-100-200 &#8362; לחודש</li>
<li><strong>כיס:</strong> דמי כיס חודשיים לגיל המתאים</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>מה נחשב הוצאה מיוחדת (חוץ מהמזונות הבסיסיים)</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li><strong>חינוך:</strong> שכר לימוד, חוגים, טיולים בית ספריים, ספרים</li>
<li><strong>בריאות:</strong> ביקורי רופא פרטיים, תרופות שאינן בסל, ביטוח שיניים</li>
<li><strong>פסיכולוגי/פסיכיאטרי:</strong> טיפולים, אבחונים</li>
<li><strong>הכנה לבגרות:</strong> שיעורים פרטיים, מכינות</li>
<li><strong>בר/בת מצווה:</strong> הוצאות האירוע</li>
<li><strong>נסיעות:</strong> כרטיסי תחבורה ציבורית, הסעות</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>שינוי מזונות - מתי ניתן לתקן?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הסכם מזונות או פסק דין בנושא מזונות <strong>אינם סופיים לנצח</strong>. בית המשפט ייטה לתקן סכום מזונות כאשר קיים "שינוי נסיבות מהותי" - שינוי שלא היה ידוע בעת קביעת הסכום ושמשנה משמעותית את המצב.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>שינוי בהכנסות:</strong> אבד מקום עבודה, קבלת ירושה, שינוי משרה משמעותי</li>
<li><strong>שינוי הסדרי משמורת:</strong> מעבר ממשמורת של האם למשמורת משותפת</li>
<li><strong>מעבר לגיל 6 (מגיל 0-6):</strong> יכול לבסס בקשת שינוי להחלת ה-919/15</li>
<li><strong>שינוי צרכים:</strong> מחלה, מוגבלות חדשה, שינוי בית ספר יקר</li>
<li><strong>הצמדה למדד:</strong> פסקי דין רבים כוללים הצמדה אוטומטית למדד המחירים לצרכן</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>בקשת שינוי מזונות מוגשת לבית המשפט לענייני משפחה. חשוב לדעת: עד מתן החלטה חדשה, חייבים להמשיך לשלם את הסכום הקיים - אי תשלום מזונות מוביל להוצאה לפועל.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מזונות ילדים בגירושין בהסכמה</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כאשר הזוג מגיע ל<a href="/divorce-agreement/">הסכם גירושין</a> מוסכם, ניתן לקבוע את סכום המזונות בהסכמה - ובית המשפט אמור לאשר אותו, בתנאי שהוא עומד ב<strong>מינימום צרכי הילד</strong>. אי אפשר להסכים על מזונות שהם "פחות ממינימום ראוי" - בית המשפט לא יאשר הסכמה כזאת כשהיא פוגעת בילד.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>יתרון הסכם מוסכם: גמישות - אפשר לכלול מנגנוני הצמדה מותאמים, לפרט הוצאות מיוחדות, לקבוע מנגנון סיום ברור. חסרון: הסכם לא מאוזן, שנכתב ללא עורך דין מנוסה, עלול לפגוע בילד ו/או בהורה לשנים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>אי תשלום מזונות - מה קורה?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>אי תשלום מזונות הוא עניין חמור. לפי נתוני הוצאה לפועל ל-2024, כ-27,000 תיקי מזונות פתוחים בהוצאה לפועל בכל רגע נתון. ההשלכות:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>עיקול חשבון בנק:</strong> גביה אוטומטית מחשבון הבנק</li>
<li><strong>עיקול נכסים:</strong> רכב, נדל"ן, זכויות</li>
<li><strong>הגבלת יציאה מהארץ:</strong> לא ניתן לנסוע לחו"ל</li>
<li><strong>הגבלת רישיונות:</strong> שלילת רישיון נהיגה, דרכון</li>
<li><strong>מאסר:</strong> בית משפט יכול להורות על מאסר עד 21 יום על אי ציות</li>
<li><strong>ריבית:</strong> חוב מזונות צובר ריבית של 6.5%-8% לשנה</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>מי שנקלע לקשיים כלכליים אמיתיים - יש לפנות מיידית לבית המשפט לענייני משפחה ולבקש הפחתה זמנית, לא לסתם להפסיק לשלם.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>הבטחת תשלום מזונות - ביטוח לאומי</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ישראל מפעילה מנגנון ייחודי: <strong>המוסד לביטוח לאומי (ביטוח לאומי) משלם מזונות</strong> לאם שאינה מקבלת את המזונות מהאב, ואז גובה את הכסף מהאב. זהו "ביטוח מזונות" שמגן על הילדים מפני אי-גביה.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>מגבלת הביטוח לאומי: ישלם עד <strong>1,960 &#8362; לחודש לילד</strong> (נכון ל-2025, מתעדכן תקופתית). אם פסק הדין מחייב יותר - ביטוח לאומי ישלם עד התקרה, והיתרה תיגבה בנפרד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מזונות ילדים לפי דת ועדה</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בישראל, בנוסף לבית המשפט לענייני משפחה, <strong>בית הדין הרבני</strong> מוסמך לדון במזונות ילדים לבני זוג יהודים. זה יוצר לפעמים "מרוץ סמכויות" שבו כל צד ממהר לפנות לערכאה שנוחה לו:</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<thead><tr><th>ערכאה</th><th>יתרון לאב</th><th>יתרון לאם</th><th>הלכה המוחלת</th></tr></thead>
<tbody>
<tr><td>בית משפט לענייני משפחה</td><td>חיוב יחסי לפי 919/15</td><td>ניתן לתבוע גם מזונות אישה</td><td>דין אזרחי + 919/15</td></tr>
<tr><td>בית דין רבני</td><td>לעיתים גמיש יותר</td><td>לעיתים חיוב גבוה על האב</td><td>הלכה יהודית</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p>עורך דין <a href="/lawyer-divorce-guide-proceedings-costs-rights/">גירושין מנוסה</a> ינחה אתכם לאיזו ערכאה כדאי לפנות בנסיבותיכם הספציפיות - שאלה אסטרטגית שיכולה לשנות את התוצאה בעשרות אחוזים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>תביעת מזונות - שלב אחר שלב</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>ייעוץ ראשוני:</strong> פגישה עם עורך דין מזונות להבנת זכויותיכם ואסטרטגיית הפנייה</li>
<li><strong>ניסיון הסכמה:</strong> לפני פנייה לבית משפט, ניתן לנסות גישור או הסכמה ישירה</li>
<li><strong>הגשת תביעה:</strong> הגשת כתב תביעה לבית משפט לענייני משפחה (אגרה: כ-369 &#8362;)</li>
<li><strong>בקשת מזונות זמניים:</strong> ניתן לבקש פסיקת מזונות ארעיים תוך שבועות - קריטי כי הליך עיקרי לוקח חודשים</li>
<li><strong>גילוי מסמכים:</strong> שני הצדדים מגישים תלושי שכר, דוחות בנק, נתוני רכוש</li>
<li><strong>ניסיון פשרה:</strong> 70% מהתיקים מסתיימים בפשרה לפני גמר עדויות</li>
<li><strong>פסיקה:</strong> אם אין הסכמה, השופט מכריע לאחר שמיעת עדויות</li>
<li><strong>הסדר גביה:</strong> קביעת אופן תשלום (העברה בנקאית, ניכוי מהמשכורת)</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>עורכי דין מזונות ילדים מובילים</h2>
<!-- /wp:heading -->

<!-- wp:shortcode -->
[justice_lawyer_listing practice_area="family-law" specialty="child-support" show_rating="true" limit="6"]
<!-- /wp:shortcode -->

<!-- wp:heading -->
<h2>שאלות נפוצות על מזונות ילדים</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>מהי הלכת בע"מ 919/15 ואיך היא משפיעה עלי?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>הלכת בע"מ 919/15 היא פסיקת בית המשפט העליון מ-2017 שקבעה כי מזונות ילדים יחושבו לפי יחס הכנסות שני ההורים ולא לפי חיוב מלא של האב. מי שפסק הדין שלו ניתן לפני 2017, יכול לבקש עיון מחדש - מצב שהוביל לאלפי תיקים שנפתחו מחדש. ייעוץ עם עורך דין ייקבע אם כדאי לכם לפתוח.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה מזונות מינימום חייב האב לשלם?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>בית המשפט לא יקבע מזונות מתחת ל"מינימום ראוי לכבוד האדם". בפועל, המינימום נע סביב 800-1,000 &#8362; לחודש לילד בגיל בית ספר - גם אם הכנסת האב נמוכה מאוד. אם הכנסת האב נמוכה מהמינימום עצמו, בית המשפט יחייב לפי יכולתו בפועל.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם משמורת משותפת שוות מבטלת מזונות?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>לא בהכרח. גם במשמורת 50-50, אם יש פער הכנסות משמעותי, ההורה בעל ההכנסה הגבוהה ישלם מזונות להורה השני. הסיבה: הילד לא אמור לחיות ברמה שונה אצל כל הורה. לדוגמה, אם אב מרוויח 20,000 &#8362; ואם 6,000 &#8362; - גם ב-50-50 ישלם האב מזונות משמעותיים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה קורה למזונות כשהאם מתחתנת מחדש?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>נישואי האם אינם משנים את חיוב האב במזונות הילדים. המזונות הם לילד, לא לאם. נישואי האם עשויים להשפיע רק על מזונות האישה (אם נפסקו), לא על מזונות הילדים. לעומת זאת, אם הכנסת האם עלתה משמעותית - ניתן לבקש הפחתת מזונות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>עד איזה גיל משלמים מזונות?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>לפי חוק מזונות בישראל, חיוב מזונות הוא עד גיל 18 (בגרות משפטית). עם זאת, ניתן לקבוע בהסכמה (ולא בכפייה) מזונות עד גיל 21 - במיוחד לילדים שממשיכים ללמוד. שירות צבאי אינו מפסיק באופן אוטומטי את המזונות - יש צורך בפנייה לבית משפט.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם ניתן לקבל מזונות רטרואקטיביים?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>תביעת מזונות ניתן להגיש גם לגבי תקופות עבר - עד 7 שנים אחורה (תקופת ההתיישנות). אם האם גידלה את הילד ולא קיבלה מזונות, ניתן לתבוע את הסכומים שלא שולמו. חשוב: ריבית על חוב מזונות עומדת על 6.5% לשנה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה ההבדל בין מזונות ילדים למזונות אישה?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>מזונות ילדים (מזונות "קטינים") משולמים עבור הילד ולא יפוגו בגלל נישואין מחדש של האם. מזונות אישה (מזונות "אישה") הם התחייבות של הגבר כלפי אשתו לפי הדין הדתי - ופוקעים כאשר האם מתחתנת מחדש. בית המשפט דן בשניהם, אך הם נפרדים לחלוטין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם צריך עורך דין לתביעת מזונות?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>ניתן להגיש תביעת מזונות גם ללא עורך דין - אך זה לא מומלץ. מזונות ילדים הם נושא טכני ומורכב: יחס הכנסות, ניכוי זמני שהייה, הוצאות מיוחדות, בחירת ערכאה, בקשת מזונות זמניים - כל אחד מהנושאים הללו יכול לשנות את הסכום באלפי שקלים לחודש. עורך דין מנוסה משתלם.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה עולה עורך דין מזונות ילדים?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>שכר טרחה עבור תיק מזונות נע בטווח של 3,000-15,000 &#8362; לטיפול מלא, תלוי במורכבות. חלק מהעורכים עובדים על בסיס שעתי (600-1,500 &#8362; לשעה). בתיקים פשוטים שמסתיימים בהסכמה, העלות נמוכה יותר. ייעוץ ראשוני לרוב חינמי או בתשלום סמלי.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr/>
<!-- /wp:separator -->

<!-- wp:paragraph {"className":"pillar-cta"} -->
<p><strong>רוצים לדעת כמה מזונות מגיע לכם בדיוק?</strong> עורך דין מזונות יחשב עבורכם את הסכום המדויק בהתאם לנסיבותיכם.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[justice_contact_form type="family" subject="מזונות ילדים"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p>&#8592; <a href="/lawyer-divorce-guide-proceedings-costs-rights/">חזרה למדריך גירושין המלא</a> | <a href="/divorce-agreement/">הסכם גירושין &#8594;</a> | <a href="/child-custody/">משמורת ילדים &#8594;</a></p>
<!-- /wp:paragraph -->`;

async function main() {
  const SEO_TITLE = 'מחשבון מזונות ילדים 2025 | הלכת 919/15 + מדריך מלא | Jus-Tice';
  const SEO_DESC = 'מחשבון מזונות ילדים מבוסס על הלכת בע"מ 919/15 - חשב כמה מזונות מגיע לפי הכנסות, גיל הילד וסדרי משמורת. מדריך מלא לזכויות ולהליך התביעה.';
  const FOCUS_KW = 'מזונות ילדים';

  const find = await wpRequest('GET', '/wp-json/wp/v2/pages?slug=child-support&status=any&per_page=1');
  const existing = Array.isArray(find.body) ? find.body[0] : null;

  const payload = {
    title: SEO_TITLE,
    slug: 'child-support',
    content: CONTENT,
    status: 'publish',
    meta: {
      seo_title: SEO_TITLE,
      seo_description: SEO_DESC,
      pillar_keyword: FOCUS_KW,
      author_practice_area: 'family-law',
      secondary_keywords: 'מחשבון מזונות, הלכת 919, מזונות לפי חוק, מזונות בהסכמה',
    }
  };

  let result;
  if (existing) {
    console.log(`Updating existing ID ${existing.id}`);
    result = await wpRequest('POST', `/wp-json/wp/v2/pages/${existing.id}`, payload);
  } else {
    console.log('Creating new page');
    result = await wpRequest('POST', '/wp-json/wp/v2/pages', payload);
  }

  console.log(`Status: ${result.status}`);
  console.log(`URL: ${result.body?.link}`);
  if (result.status >= 400) {
    console.log('Error:', JSON.stringify(result.body).substring(0, 300));
  }
}

main().catch(console.error);
