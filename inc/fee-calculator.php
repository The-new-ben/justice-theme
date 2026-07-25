<?php
/**
 * Lawyer-fee calculator, driven by the published tariff regulations.
 *
 * Lives in a shortcode rather than in post content because wpautop rewrites
 * raw markup inside the editor body: it injected <br /> and a stray </p> into
 * the script block, Autoptimize then base64-encoded the broken result, and the
 * page threw "Unexpected token '<'" with an empty service list.
 *
 * Every figure comes from:
 *  - כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), תש"ס-2000, current to 05.01.2026
 *  - כללי לשכת עורכי הדין (תעריף מקסימלי ... תאונות דרכים), תשל"ז-1977
 * Nothing here is estimated.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_fee_calculator_shortcode(): string {
	return <<<'JTCALC'
<div class="jtfee" id="jtfee">
  <div class="jtfee__head">
    <h2 class="jtfee__title">מחשבון שכר טרחת עורך דין לפי התעריף המינימלי המומלץ</h2>
    <p class="jtfee__sub">בחרו שירות, הזינו סכום, והתוצאה מתעדכנת מיד. כל המספרים לקוחים מהתקנות עצמן.</p>
  </div>

  <div class="jtfee__form">
    <label class="jtfee__field">
      <span class="jtfee__label">סוג ההליך</span>
      <select id="jtfee-service" class="jtfee__control"></select>
    </label>

    <label class="jtfee__field" id="jtfee-amount-wrap">
      <span class="jtfee__label" id="jtfee-amount-label">סכום התביעה בשקלים</span>
      <input id="jtfee-amount" class="jtfee__control" type="text" inputmode="numeric"
             autocomplete="off" placeholder="לדוגמה 250,000">
    </label>

    <label class="jtfee__field" id="jtfee-stage-wrap" hidden>
      <span class="jtfee__label">שלב ההליך</span>
      <select id="jtfee-stage" class="jtfee__control"></select>
    </label>

    <label class="jtfee__field" id="jtfee-flat-wrap" hidden>
      <span class="jtfee__label">בחרו פעולה</span>
      <select id="jtfee-flat" class="jtfee__control"></select>
    </label>

    <label class="jtfee__check">
      <input type="checkbox" id="jtfee-vat" checked>
      <span>הצג גם כולל מע״מ (18%)</span>
    </label>
  </div>

  <output class="jtfee__out" id="jtfee-out" for="jtfee-service jtfee-amount" aria-live="polite">
    <div class="jtfee__result">
      <span class="jtfee__result-label">שכר טרחה לפי התעריף</span>
      <strong class="jtfee__result-value" id="jtfee-value">—</strong>
      <span class="jtfee__result-vat" id="jtfee-vat-line"></span>
    </div>
    <p class="jtfee__how" id="jtfee-how"></p>
    <p class="jtfee__sec" id="jtfee-sec"></p>
  </output>

  <p class="jtfee__disclaimer">
    התעריף המינימלי המומלץ הוא המלצה של לשכת עורכי הדין ואינו מחייב את הצדדים, למעט
    במקרים שבהם התקנות קובעות תעריף מקסימלי מחייב, כמו בתביעות לפי חוק פיצויים לנפגעי
    תאונות דרכים. המחשבון מציג את החישוב לפי לשון התקנות ואינו מהווה ייעוץ משפטי.
  </p>
</div>

<style>
.jtfee{--jf-navy:#0d2149;--jf-gold:#c9a227;--jf-line:#e6e6ea;border:1px solid var(--jf-line);border-radius:14px;overflow:hidden;margin:28px 0;background:#fff;direction:rtl}
.jtfee__head{background:var(--jf-navy);color:#fff;padding:18px 20px}
.jtfee__title{margin:0 0 6px;font-size:1.15rem;line-height:1.35;color:#fff}
.jtfee__sub{margin:0;font-size:.9rem;opacity:.9;line-height:1.6}
.jtfee__form{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px 20px}
.jtfee__field{display:flex;flex-direction:column;gap:6px;min-width:0}
.jtfee__label{font-size:.85rem;font-weight:600;color:#333}
.jtfee__control{width:100%;padding:11px 12px;border:1px solid #cfd2da;border-radius:9px;font-size:1rem;font-family:inherit;background:#fff;color:#111}
.jtfee__control:focus{outline:2px solid var(--jf-gold);outline-offset:1px;border-color:var(--jf-gold)}
.jtfee__check{grid-column:1/-1;display:flex;align-items:center;gap:8px;font-size:.88rem;color:#444}
.jtfee__out{display:block;margin:0 20px 18px;padding:16px 18px;background:#faf8f2;border-right:5px solid var(--jf-gold);border-radius:10px}
.jtfee__result{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px}
.jtfee__result-label{font-size:.85rem;color:#555}
.jtfee__result-value{font-size:1.9rem;font-weight:800;color:var(--jf-navy);line-height:1.1}
.jtfee__result-vat{font-size:.95rem;color:#555;font-weight:600}
.jtfee__how{margin:10px 0 0;font-size:.9rem;color:#333;line-height:1.7}
.jtfee__sec{margin:6px 0 0;font-size:.82rem;color:#666}
.jtfee__disclaimer{margin:0;padding:14px 20px 18px;font-size:.82rem;color:#666;line-height:1.7;border-top:1px solid var(--jf-line)}
@media(max-width:640px){.jtfee__form{grid-template-columns:1fr}.jtfee__result-value{font-size:1.6rem}}
.jt-tariff{width:100%;border-collapse:collapse;margin:14px 0;font-size:.92rem}
.jt-tariff th{background:#0d2149;color:#fff;text-align:right;padding:9px 11px}
.jt-tariff td{border-bottom:1px solid #e6e6ea;padding:8px 11px;vertical-align:top}
.jt-tariff__sub td{background:#f4f5f8;font-weight:700}
.jt-tariff-scroll{overflow-x:auto}
</style>

<script>
(function(){
  var B = [{"id": "money", "label": "תביעה כספית (כל הערכאות)", "sec": "פרק 1", "needs_amount": true, "tiers": [{"upto": 31068, "pct": 15, "min": 935}, {"upto": 126293, "pct": 10, "min": 4668}, {"upto": 1241087, "base_upto": 126293, "base_pct": 10, "rest_pct": 4}, {"upto": null, "agreed": true, "min": 58143}]}, {"id": "tort", "label": "תביעת נזיקין (שכר תלוי תוצאה)", "sec": "פרק 2", "needs_amount": true, "note": "מחושב מהסכום שנפסק, לאחר ניכוי גמלת ביטוח לאומי.", "tiers": [{"upto": 189925, "pct": 15}, {"upto": 474814, "pct": 12.5}, {"upto": null, "pct": 10}]}, {"id": "plt", "label": "תאונת דרכים (תעריף מקסימלי בחוק)", "sec": "תשל\"ז-1977", "needs_amount": true, "max_rule": true, "note": "זהו תעריף מקסימלי, לא מינימלי, והוא משולם על ידי חברת הביטוח.", "stages": [{"key": "pre", "label": "פשרה לפני הגשת תביעה", "pct": 8}, {"key": "post", "label": "פשרה אחרי הגשת תביעה", "pct": 11}, {"key": "judg", "label": "לאחר פסק דין", "pct": 13}]}, {"id": "evict", "label": "פינוי, סילוק יד או החזרת חזקה", "sec": "פרק 3(א)(1)", "needs_amount": true, "amount_label": "ערך הנכס", "tiers": [{"upto": null, "pct": 2, "min": 6307}]}, {"id": "partition", "label": "פירוק שיתוף במקרקעין", "sec": "פרק 3(א)(2)", "needs_amount": true, "amount_label": "שווי חלקכם בנכס", "tiers": [{"upto": null, "pct": 3, "min": 6307}]}, {"id": "probate", "label": "צו קיום צוואה או צו ירושה (ללא התנגדות)", "sec": "פרק 4(א)(4)", "needs_amount": true, "amount_label": "ערך העיזבון", "tiers": [{"upto": null, "pct": 1.5, "min": 4281}]}, {"id": "probate_opp", "label": "צו קיום צוואה או ירושה (בהתנגדות)", "sec": "פרק 4(א)(4)(ב)", "needs_amount": true, "amount_label": "ערך העיזבון", "uplift": 25, "tiers": [{"upto": null, "pct": 1.5, "min": 4281}]}, {"id": "tax", "label": "ערעור מס, ארנונה או היטל", "sec": "פרק 4(א)(7)", "needs_amount": true, "amount_label": "סכום המס השנוי במחלוקת", "tiers": [{"upto": null, "pct": 7.5, "min": 1773}]}, {"id": "flat", "label": "סכומים קבועים בתקנות", "sec": "פרקים 3 ו-4", "needs_amount": false, "flat": [{"label": "תביעה שנושאה אינו ניתן להערכה בכסף", "v": 6307}, {"label": "בקשה לצו זמני", "v": 2161}, {"label": "בקשת ביניים אחרת", "v": 741}, {"label": "אישום בחטא", "v": 1357}, {"label": "אישום בעוון או עבירה אחרת", "v": 1883}, {"label": "אישום בגרימת מוות", "v": 6307}, {"label": "טיעון לעונש בלבד", "v": 3145}, {"label": "שחרור בערבות", "v": 741}, {"label": "משפט פלילי בבית משפט מחוזי", "v": 3740}, {"label": "בקשה למינוי אפוטרופוס או אימוץ", "v": 4281}, {"label": "ישיבה נוספת (אזרחי, שלום)", "v": 741}, {"label": "ישיבה נוספת (מחוזי ומעלה)", "v": 754}, {"label": "ישיבה נוספת (פלילי, שלום)", "v": 512}]}];
  var svc=document.getElementById('jtfee-service'), amt=document.getElementById('jtfee-amount'),
      stageW=document.getElementById('jtfee-stage-wrap'), stage=document.getElementById('jtfee-stage'),
      flatW=document.getElementById('jtfee-flat-wrap'), flat=document.getElementById('jtfee-flat'),
      amtW=document.getElementById('jtfee-amount-wrap'), amtL=document.getElementById('jtfee-amount-label'),
      vat=document.getElementById('jtfee-vat'), val=document.getElementById('jtfee-value'),
      vline=document.getElementById('jtfee-vat-line'), how=document.getElementById('jtfee-how'),
      sec=document.getElementById('jtfee-sec');
  if(!svc) return;
  var ils=function(n){return new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(Math.round(n));};
  B.forEach(function(b,i){var o=document.createElement('option');o.value=i;o.textContent=b.label;svc.appendChild(o);});

  function sync(){
    var b=B[svc.value];
    amtW.hidden=!b.needs_amount;
    stageW.hidden=!b.stages;
    flatW.hidden=!b.flat;
    if(b.stages && !stage.options.length){b.stages.forEach(function(s,i){var o=document.createElement('option');o.value=i;o.textContent=s.label;stage.appendChild(o);});}
    if(b.flat){flat.innerHTML='';b.flat.forEach(function(f,i){var o=document.createElement('option');o.value=i;o.textContent=f.label;flat.appendChild(o);});}
    amtL.textContent=b.amount_label||'סכום התביעה בשקלים';
    calc();
  }

  function calc(){
    var b=B[svc.value], n=parseFloat((amt.value||'').replace(/[^\d.]/g,''))||0, fee=0, txt='';
    if(b.flat){
      var f=b.flat[flat.value||0]; fee=f.v; txt='סכום קבוע בתקנות עבור '+f.label+'.';
    } else if(b.stages){
      var s=b.stages[stage.value||0];
      if(!n){ val.textContent='—'; vline.textContent=''; how.textContent='הזינו את סכום הפיצוי כדי לחשב.'; sec.textContent=b.sec?'מקור: '+b.sec:''; return; }
      fee=n*s.pct/100; txt='עד '+s.pct+'% מ'+ils(n)+' ('+s.label+'). '+(b.note||'');
    } else {
      if(!n){ val.textContent='—'; vline.textContent=''; how.textContent='הזינו סכום כדי לחשב.'; sec.textContent=b.sec?'מקור: '+b.sec:''; return; }
      for(var i=0;i<b.tiers.length;i++){
        var t=b.tiers[i];
        if(t.upto===null || n<=t.upto){
          if(t.agreed){ fee=b.tiers[i].min; txt='מעל '+ils(1241087)+' השכר נקבע בהסכמה בין עורך הדין ללקוח, אך לא פחות מ'+ils(t.min)+'.'; break; }
          if(t.base_upto){ fee=t.base_upto*t.base_pct/100+(n-t.base_upto)*t.rest_pct/100;
            txt=t.base_pct+'% מ'+ils(t.base_upto)+' ועוד '+t.rest_pct+'% מהיתרה ('+ils(n-t.base_upto)+').'; break; }
          fee=n*t.pct/100;
          txt=t.pct+'% מ'+ils(n)+'.';
          if(t.min && fee<t.min){ fee=t.min; txt+=' התוצאה נמוכה מהמינימום בתקנות, ולכן נלקח המינימום '+ils(t.min)+'.'; }
          break;
        }
      }
      if(b.uplift){ fee=fee*(1+b.uplift/100); txt+=' בתוספת '+b.uplift+'% בשל התנגדות.'; }
      if(b.note) txt+=' '+b.note;
    }
    val.textContent=ils(fee);
    vline.textContent=vat.checked?('כולל מע״מ: '+ils(fee*1.18)):'';
    how.textContent=txt;
    sec.textContent=b.sec?('מקור בתקנות: '+b.sec+(b.max_rule?' — תעריף מקסימלי מחייב':' — תעריף מינימלי מומלץ')):'';
  }

  amt.addEventListener('input',function(){
    var raw=this.value.replace(/[^\d]/g,'');
    this.value=raw?Number(raw).toLocaleString('he-IL'):'';
    calc();
  });
  svc.addEventListener('change',sync);
  stage.addEventListener('change',calc);
  flat.addEventListener('change',calc);
  vat.addEventListener('change',calc);
  sync();
})();
</script>
JTCALC;
}
add_shortcode( 'jt_fee_calculator', 'justice_theme_fee_calculator_shortcode' );
