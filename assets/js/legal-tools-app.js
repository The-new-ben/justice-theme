
/* ============================================================
   JUS-TICE AI Legal Tools - front-end engine (framework-free).
   Embeds anywhere (WordPress Custom HTML / iframe). Bilingual.
   AI generation is wired to a pluggable endpoint (see AI_CONFIG).
   ============================================================ */
"use strict";

/* ---------- tiny helpers ---------- */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const el = (t,a={},...c)=>{const n=document.createElement(t);for(const k in a){if(k==="class")n.className=a[k];else if(k==="html")n.innerHTML=a[k];else n.setAttribute(k,a[k]);}c.flat().forEach(x=>n.append(x.nodeType?x:document.createTextNode(x)));return n;};
const esc=s=>(s==null?"":String(s)).replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]));
let LANG = localStorage.getItem("justice_lang") || "he";
const t = o => (o&&typeof o==="object") ? (o[LANG]??o.he??o.en??"") : o;
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("on"),2200);}

/* ---------- UI chrome strings ---------- */
const I18N = {
  he:{ brandTag:"כלים משפטיים", navTools:"כלים", navHow:"איך זה עובד", navLawyers:"עורכי דין",
    heroEyebrow:"כלים להכנת מסמכים משפטיים",
    heroTitle:"מכינים טיוטה משפטית מסודרת לפני בדיקת עורך דין",
    heroSub:"בחרו נושא, מלאו שאלון קצר וקבלו מסמך ראשוני בעברית או באנגלית. מתאים לארגון העובדות, בדיקת זכויות והכנה לפנייה מקצועית.",
    statTools:"כלים משפטיים", statLive:"מוכנים לשימוש", statLang:"עברית ואנגלית",
    trustDraft:"טיוטה מסודרת", trustDraftSub:"מבנה ברור לפני בדיקה משפטית",
    trustReview:"לא תחליף לייעוץ", trustReviewSub:"מסמך שמיועד לבדיקה והשלמה",
    trustFlow:"שאלון לפי נושא", trustFlowSub:"רק הפרטים הנדרשים למסמך",
    mediaTitle:"מתחילים מהעובדות והמסמכים", mediaSub:"הטיוטה עוזרת להגיע מסודרים לשיחה או לבדיקה משפטית.",
    searchPh:"חפשו מסמך או מצב משפטי…", all:"הכול",
    footSec:"הטיוטה נוצרת בדפדפן וניתנת להעתקה, הדפסה או הורדה", footRights:"© 2026 JUS-TICE. מידע כללי בלבד, לא ייעוץ משפטי.",
    live:"מוכן", review:"בבדיקה", open:"פתיחת הכלי", empty:"לא נמצאו כלים. נסו מונח אחר.",
    back:"חזרה", next:"המשך", generate:"יצירת מסמך", regenerate:"עדכון מסמך", enhance:"שדרוג עם AI",
    copy:"העתקה", print:"הדפסה / PDF", download:"הורדה (Word)", lawyer:"פנייה לעורך דין", reset:"איפוס",
    previewEmpty:"מלאו את הפרטים - תצוגת המסמך תיבנה כאן בזמן אמת.",
    previewLbl:"תצוגת מסמך", required:"שדה חובה", step:"שלב",
    aiNote:'<b>שדרוג AI מוגן:</b> הטקסט נוצר מתבנית חכמה. כאשר נקודת השרת פעילה, הכפתור "שדרוג עם AI" משכתב ומחדד את המסמך תחת מגבלת שימוש יומית.',
    disc:"מסמך זה נוצר אוטומטית למטרות נוחות בלבד ואינו מהווה ייעוץ משפטי. מומלץ לבדיקת עורך דין מורשה לפני שימוש.",
    aiWorking:"ה-AI מנסח…", aiDone:"שודרג בהצלחה", aiOff:"חיבור ה-AI אינו זמין כרגע - מוצגת תבנית בסיס.", aiLimit:"מגבלת השימוש היומית ב-AI הופעלה - נסו שוב מאוחר יותר.",
    copied:"הועתק ללוח", needFields:"נא למלא את שדות החובה המסומנים." },
  en:{ brandTag:"Legal tools", navTools:"Tools", navHow:"How it works", navLawyers:"Lawyers",
    heroEyebrow:"Legal document preparation tools",
    heroTitle:"Prepare a structured legal draft before attorney review",
    heroSub:"Choose a topic, answer a short guided interview, and receive a first draft in Hebrew or English. Built for organizing facts, checking issues, and preparing for professional review.",
    statTools:"Legal tools", statLive:"Ready to use", statLang:"Hebrew and English",
    trustDraft:"Structured draft", trustDraftSub:"A clear framework before review",
    trustReview:"Not legal advice", trustReviewSub:"Prepared for review and completion",
    trustFlow:"Topic-based interview", trustFlowSub:"Only the details the document needs",
    mediaTitle:"Start with facts and documents", mediaSub:"The draft helps you arrive prepared for a legal review.",
    searchPh:"Search a document or situation…", all:"All",
    footSec:"Drafts are generated in the browser and can be copied, printed, or downloaded", footRights:"© 2026 JUS-TICE. General information only, not legal advice.",
    live:"Ready", review:"In review", open:"Open tool", empty:"No tools found. Try another term.",
    back:"Back", next:"Next", generate:"Generate document", regenerate:"Update document", enhance:"Enhance with AI",
    copy:"Copy", print:"Print / PDF", download:"Download (Word)", lawyer:"Send to a lawyer", reset:"Reset",
    previewEmpty:"Fill in the details - your document preview builds here live.",
    previewLbl:"Document preview", required:"Required", step:"Step",
    aiNote:'<b>Protected AI enhancement:</b> This draft is built from a smart template. When the server endpoint is active, “Enhance with AI” rewrites and sharpens the document under daily usage limits.',
    disc:"This document is auto-generated for convenience only and is not legal advice. Have a licensed attorney review it before use.",
    aiWorking:"AI is drafting…", aiDone:"Enhanced", aiOff:"AI is not available right now - showing the base template.", aiLimit:"The daily AI usage limit has been reached - try again later.",
    copied:"Copied to clipboard", needFields:"Please complete the highlighted required fields." }
};
const ui = k => I18N[LANG][k] ?? k;

/* ---------- AI integration config (connect later) ----------
   Set AI_CONFIG.endpoint to your WordPress/serverless route that
   proxies OpenAI (keeps the API key server-side). Contract:
   POST {tool, lang, fields, draft} -> {text}                     */
const AI_CONFIG = { endpoint:(window.JusticeAIApp&&window.JusticeAIApp.generateEndpoint)||"", enabled:!!(window.JusticeAIApp&&window.JusticeAIApp.generateEndpoint) };
async function aiEnhance(payload){
  if(!AI_CONFIG.enabled || !AI_CONFIG.endpoint) return {error:"off"};
  try{
    const r = await fetch(AI_CONFIG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const d = await r.json().catch(()=>({}));
    if(!r.ok || d.error) return {error:d.error || "failed", detail:d};
    return {text:d.text || null, usage:d.usage || null};
  }catch(e){ return {error:"network"}; }
}

/* ---------- icon set (stroke, currentColor) ---------- */
const S='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">';
const ICONS={
  scales:S+'<path d="M12 3v18M5 21h14M6 6h12M6 6l-3 6a3 3 0 0 0 6 0zM18 6l3 6a3 3 0 0 1-6 0z"/></svg>',
  car:S+'<path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v4H5zM7 17v2M17 17v2"/><circle cx="7.5" cy="15" r=".6"/><circle cx="16.5" cy="15" r=".6"/></svg>',
  alert:S+'<path d="M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  gavel:S+'<path d="M14 3l7 7M11 6l7 7M5.5 12.5l6 6M3 21l5-5M9.5 8.5l6 6"/></svg>',
  home:S+'<path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-6h4v6"/></svg>',
  brief:S+'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  shield:S+'<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="m9 12 2 2 4-4"/></svg>',
  file:S+'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M8 13h8M8 17h6"/></svg>',
  scroll:S+'<path d="M6 4h11a2 2 0 0 1 2 2v11M6 4a2 2 0 0 0-2 2v2h4M6 4a2 2 0 0 1 2 2v11a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2"/><path d="M9 9h6M9 13h5"/></svg>',
  cart:S+'<circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M2 3h3l2.4 12.3a1.5 1.5 0 0 0 1.5 1.2h8a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
  key:S+'<circle cx="8" cy="8" r="4"/><path d="M11 11l9 9M16 16l2-2M19 19l2-2"/></svg>',
  users:S+'<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.4M16.5 20a6 6 0 0 0-1.5-4"/></svg>',
  heart:S+'<path d="M12 20s-7-4.5-9.3-9C1 7.5 3 4.5 6 4.5c2 0 3 1.2 6 4 3-2.8 4-4 6-4 3 0 5 3 3.3 6.5C19 15.5 12 20 12 20z"/></svg>',
  build:S+'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>',
  hammer:S+'<path d="M14 6l4 4M3 21l9-9M12.5 7.5l4 4 3-3-4-4zM16.5 11.5L21 16"/></svg>',
  plane:S+'<path d="M10.5 13.5 3 12l1-2 6 1 4-5a2 2 0 0 1 3 3l-5 4 1 6-2 1-1.5-7.5z"/></svg>',
  refresh:S+'<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4"/></svg>',
  hand:S+'<path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0-1V5.2a1.5 1.5 0 0 1 3 0V11m0-.8a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7s-6-3-6-6v-1.5a1.5 1.5 0 0 1 3 0V13"/></svg>',
  globe:S+'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>',
  coins:S+'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3M3 12v5c0 1.7 2.7 3 6 3"/><circle cx="16" cy="15" r="5"/></svg>',
  doc:S+'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  badge:S+'<circle cx="12" cy="9" r="6"/><path d="M9 14l-1.5 7L12 19l4.5 2L15 14"/></svg>',
  x:S+'<path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow:S+'<path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  spark:S+'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 15l.9 2.4L21 18l-2.1.6L18 21l-.9-2.4L15 18l2.1-.6z"/></svg>',
  pen:S+'<path d="M14 4l6 6M3 21l3-1 12-12-2-2L4 18z"/></svg>'
};
const ic = n => ICONS[n]||ICONS.file;

/* ---------- categories (life-cycle) ---------- */
const CATS=[
  {id:"consumer",label:{he:"צרכנות ויומיום",en:"Everyday & Consumer"}},
  {id:"money",   label:{he:"כספים וחובות",en:"Money & Debt"}},
  {id:"work",    label:{he:"עבודה ותעסוקה",en:"Work & Employment"}},
  {id:"housing", label:{he:"דיור ונדל״ן",en:"Housing & Real Estate"}},
  {id:"family",  label:{he:"משפחה ואישי",en:"Family & Personal"}},
  {id:"vehicle", label:{he:"רכב ורכוש",en:"Vehicles & Property"}},
  {id:"business",label:{he:"עסקים וקניין רוחני",en:"Business & IP"}},
  {id:"court",   label:{he:"בית משפט והליכים",en:"Court & Proceedings"}},
];

/* ---------- template helpers ---------- */
const BL="__________";
const g=(d,k)=>(d[k]!=null&&String(d[k]).trim()!=="")?String(d[k]).trim():BL;
function fdate(v){if(!v)return BL;try{const x=new Date(v);if(isNaN(x))return v;return x.toLocaleDateString(LANG==="he"?"he-IL":"en-GB",{year:"numeric",month:"long",day:"numeric"});}catch(e){return v;}}
function today(){return new Date().toLocaleDateString(LANG==="he"?"he-IL":"en-GB",{year:"numeric",month:"long",day:"numeric"});}
function money(v,c){if(v==null||v==="")return BL;const n=Number(v);const s=isNaN(n)?v:n.toLocaleString(LANG==="he"?"he-IL":"en-US");return (c||"₪")+" "+s;}

/* shorthand field builders */
const F=(name,type,he,en,opt={})=>Object.assign({name,type,label:{he,en}},opt);
const SEL=(name,he,en,heOpts,enOpts,opt={})=>Object.assign({name,type:"select",label:{he,en},options:heOpts.map((h,i)=>({label:{he:h,en:enOpts[i]}}))},opt);

/* ============================================================
   TOOL CATALOG - 50 live tools with bilingual generator templates.
   ============================================================ */
const TOOLS=[
/* ---- CONSUMER ---- */
{id:"ticket-appeal",cat:"consumer",icon:"car",accent:"b",live:true,
 title:{he:"ערעור על דוח תנועה / חניה",en:"Traffic / Parking Ticket Appeal"},
 blurb:{he:"בונה בקשה מנומקת לביטול דוח תנועה או חניה.",en:"Builds a reasoned request to cancel a traffic or parking ticket."},
 fields:[
   F("fullName","text","שם מלא","Full name",{req:true,half:true}),
   F("idNumber","text","ת.ז.","ID number",{half:true}),
   F("address","text","כתובת","Address"),
   F("authority","text","הרשות / גוף אוכף","Issuing authority",{req:true,ph:{he:"לדוגמה: עיריית תל אביב - אגף הפיקוח",en:"e.g., Tel Aviv Municipality - Enforcement"}}),
   F("reportNumber","text","מספר דוח","Report no.",{req:true,half:true}),
   F("reportDate","date","תאריך הדוח","Report date",{half:true}),
   F("vehicleNumber","text","מספר רכב","Vehicle no.",{half:true}),
   F("violation","text","סוג העבירה","Violation",{half:true,ph:{he:"חניה באדום-לבן",en:"Parking in red-white zone"}}),
   SEL("grounds","עילת הערעור המרכזית","Main ground for appeal",
     ["העבירה לא בוצעה","שילוט חסר או לא תקין","מצב חירום/רפואי","טעות בזיהוי הרכב","נסיבות מקלות","חלף המועד החוקי לרישום"],
     ["No violation occurred","Missing/defective signage","Emergency / medical","Vehicle misidentified","Mitigating circumstances","Statutory deadline passed"],{req:true}),
   F("reasonDetails","textarea","פירוט הנימוקים","Details of your reasons",{req:true,ph:{he:"תארו מה קרה, צרפו אסמכתאות (תמונות, אישורים)…",en:"Describe what happened; attach evidence (photos, receipts)…"}}),
 ],
 gen(d){return LANG==="he"?
`לכבוד
${g(d,"authority")}
מחלקת הערעורים / קצין מוסמך

הנדון: בקשה לביטול הודעת קנס / דוח מספר ${g(d,"reportNumber")}

1.  הח״מ, ${g(d,"fullName")}, ת.ז. ${g(d,"idNumber")}, מ${g(d,"address")}, פונה בבקשה לביטול הדוח שבנדון שנרשם לרכב מספר ${g(d,"vehicleNumber")}.
2.  הדוח נרשם ביום ${fdate(d.reportDate)} בגין "${g(d,"violation")}".
3.  עילת הבקשה: ${g(d,"grounds")}.
4.  פירוט: ${g(d,"reasonDetails")}
5.  לאור האמור, ומשלא מתקיימים יסודות העבירה כפי שנרשמה, אבקש לבטל את הדוח, או לחלופין לזמן אותי לטיעון בכתב/בעל-פה בטרם תתקבל החלטה.
6.  אבקש לקבל את החלטתכם בכתב לכתובת שלעיל. שמורה לי הזכות לפנות לבית המשפט לעניינים מקומיים בהתאם לכל דין.

בכבוד רב,
${g(d,"fullName")}  ·  ת.ז. ${g(d,"idNumber")}
${today()}`
:
`To:
${g(d,"authority")}
Appeals Department / Authorized Officer

Re: Request to cancel fine / ticket no. ${g(d,"reportNumber")}

1.  The undersigned, ${g(d,"fullName")}, ID ${g(d,"idNumber")}, of ${g(d,"address")}, requests cancellation of the above ticket issued to vehicle no. ${g(d,"vehicleNumber")}.
2.  The ticket was issued on ${fdate(d.reportDate)} for "${g(d,"violation")}".
3.  Ground for appeal: ${g(d,"grounds")}.
4.  Details: ${g(d,"reasonDetails")}
5.  Accordingly, as the elements of the alleged offence are not met, I request that the ticket be cancelled, or alternatively that I be invited to submit written/oral argument before any decision.
6.  Please send your decision in writing to the address above. I reserve the right to apply to the competent court under any applicable law.

Respectfully,
${g(d,"fullName")}  ·  ID ${g(d,"idNumber")}
${today()}`;}},

{id:"consumer-cancellation",cat:"consumer",icon:"cart",accent:"b",live:true,
 title:{he:"ביטול עסקה ודרישת החזר",en:"Consumer Cancellation & Refund"},
 blurb:{he:"הודעת ביטול והחזר כספי לפי חוק הגנת הצרכן.",en:"Cancellation & refund notice under consumer-protection law."},
 fields:[
   F("consumerName","text","שם הצרכן","Consumer name",{req:true,half:true}),
   F("consumerAddress","text","כתובת / דוא״ל","Address / email",{half:true}),
   F("businessName","text","שם העסק","Business name",{req:true}),
   F("productService","text","המוצר / השירות","Product / service",{req:true,half:true}),
   F("purchaseDate","date","תאריך העסקה","Purchase date",{half:true}),
   F("amount","number","סכום ששולם (₪)","Amount paid (₪)",{half:true}),
   SEL("reason","עילת הביטול","Reason for cancellation",
     ["ביטול עסקת מכר מרחוק (14 יום)","מוצר פגום / אי-התאמה","הטעיה / מצג שווא","אי-אספקה במועד"],
     ["Distance-sale cancellation (14 days)","Defective / non-conforming","Misrepresentation","Non-delivery on time"],{half:true,req:true}),
   F("details","textarea","פירוט","Details",{ph:{he:"מה קרה ומה הדרישה…",en:"What happened and what you want…"}}),
 ],
 gen(d){return LANG==="he"?
`אל: ${g(d,"businessName")}
מאת: ${g(d,"consumerName")} · ${g(d,"consumerAddress")}
תאריך: ${today()}

הנדון: הודעת ביטול עסקה ודרישה להחזר כספי

1.  ביום ${fdate(d.purchaseDate)} רכשתי מכם "${g(d,"productService")}" בתמורה ל-${money(d.amount)}.
2.  הריני מודיע/ה בזאת על ביטול העסקה מהטעם: ${g(d,"reason")}.
3.  ${g(d,"details")}
4.  בהתאם לחוק הגנת הצרכן, התשמ״א-1981, אבקש להשיב לי את מלוא התמורה ששולמה תוך 14 ימים, בניכוי דמי ביטול כדין ככל שחלים.
5.  היה ולא יושב הסכום במועד, אשקול נקיטת הליכים, לרבות פנייה לבית המשפט לתביעות קטנות ולממונה על הגנת הצרכן.

בכבוד רב,
${g(d,"consumerName")}`
:
`To: ${g(d,"businessName")}
From: ${g(d,"consumerName")} · ${g(d,"consumerAddress")}
Date: ${today()}

Re: Notice of cancellation and demand for refund

1.  On ${fdate(d.purchaseDate)} I purchased "${g(d,"productService")}" from you for ${money(d.amount)}.
2.  I hereby cancel the transaction on the ground of: ${g(d,"reason")}.
3.  ${g(d,"details")}
4.  Under the Consumer Protection Law 5741-1981, please refund the full amount paid within 14 days, less lawful cancellation fees if applicable.
5.  Should the amount not be refunded in time, I will consider proceedings, including the Small Claims Court and the Consumer Protection Commissioner.

Respectfully,
${g(d,"consumerName")}`;}},

{id:"warranty-complaint",cat:"consumer",icon:"alert",accent:"r",live:true,
 title:{he:"תלונה על מוצר פגום / אחריות",en:"Defective Product / Warranty Complaint"},
 blurb:{he:"מכתב דרישה לתיקון, החלפה או החזר.",en:"Demand to repair, replace or refund."},
 fields:[
   F("consumerName","text","שם הצרכן","Consumer name",{req:true,half:true}),
   F("consumerContact","text","טלפון / דוא״ל","Phone / email",{half:true}),
   F("businessName","text","שם העסק","Business name",{req:true}),
   F("product","text","המוצר","Product",{req:true,half:true}),
   F("purchaseDate","date","תאריך הרכישה","Purchase date",{half:true}),
   F("defect","textarea","תיאור הפגם","Describe the defect",{req:true}),
   SEL("remedy","הסעד הנדרש","Remedy",["תיקון המוצר","החלפה במוצר תקין","החזר כספי מלא"],["Repair","Replacement","Full refund"],{req:true,half:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"businessName")}
מאת: ${g(d,"consumerName")} · ${g(d,"consumerContact")}

הנדון: תלונה ודרישה בגין מוצר פגום / אי-התאמה

1. ביום ${fdate(d.purchaseDate)} רכשתי מכם את "${g(d,"product")}".
2. התגלה הפגם הבא: ${g(d,"defect")}.
3. בהתאם לחוק הגנת הצרכן, התשמ״א-1981, ולתקופת האחריות, אני דורש/ת: ${g(d,"remedy")}, תוך 14 ימים ממועד מכתב זה.
4. לא תתוקן הבעיה במועד, אפנה לממונה על הגנת הצרכן ולבית המשפט לתביעות קטנות, על כל ההוצאות הכרוכות בכך.

בכבוד רב,
${g(d,"consumerName")}`
:
`${today()}

To: ${g(d,"businessName")}
From: ${g(d,"consumerName")} · ${g(d,"consumerContact")}

Re: Complaint and demand regarding a defective or non-conforming product

1. On ${fdate(d.purchaseDate)} I purchased "${g(d,"product")}" from you.
2. The following defect appeared: ${g(d,"defect")}.
3. Under the Consumer Protection Law 5741-1981 and the warranty, I require: ${g(d,"remedy")}, within 14 days of this letter.
4. Failing timely cure, I will turn to the Consumer Protection Commissioner and the Small Claims Court, at your cost.

Respectfully,
${g(d,"consumerName")}`;}},
{id:"chargeback",cat:"consumer",icon:"coins",accent:"r",live:true,
 title:{he:"ערעור חיוב כרטיס אשראי",en:"Credit-Card Chargeback Dispute"},
 blurb:{he:"בקשת ביטול חיוב לחברת האשראי.",en:"Dispute an unauthorized or wrong charge."},
 fields:[
   F("cardholderName","text","שם בעל הכרטיס","Cardholder name",{req:true,half:true}),
   F("last4","text","4 ספרות אחרונות","Card last 4",{half:true}),
   F("issuer","text","חברת האשראי / הבנק","Card issuer / bank",{req:true}),
   F("merchant","text","שם בית העסק","Merchant",{req:true,half:true}),
   F("chargeDate","date","תאריך החיוב","Charge date",{half:true}),
   F("amount","number","סכום החיוב (₪)","Amount (₪)",{req:true,half:true}),
   SEL("reason","עילת הביטול","Reason",["לא ביצעתי את העסקה","חיוב כפול","סכום שגוי","המוצר או השירות לא סופק","העסקה בוטלה"],["I did not make this charge","Duplicate charge","Wrong amount","Goods or services not delivered","Transaction cancelled"],{req:true,half:true}),
   F("details","textarea","פירוט","Details"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"issuer")}
מאת: ${g(d,"cardholderName")}, כרטיס המסתיים ב-${g(d,"last4")}

הנדון: בקשה לביטול חיוב / הכחשת עסקה

1. ביום ${fdate(d.chargeDate)} חויב כרטיסי בסך ${money(d.amount)} על ידי "${g(d,"merchant")}".
2. עילת הבקשה: ${g(d,"reason")}.
3. פירוט: ${g(d,"details")}
4. אני דורש/ת לבטל את החיוב ולהשיב את הסכום, ולפתוח בהליך בירור מול בית העסק (chargeback) בהתאם לכללי חברות האשראי ולחוק.
5. אבקש את תשובתכם בכתב. שמורות לי כל הזכויות לפי כל דין.

בכבוד רב,
${g(d,"cardholderName")}`
:
`${today()}

To: ${g(d,"issuer")}
From: ${g(d,"cardholderName")}, card ending ${g(d,"last4")}

Re: Request to reverse a charge / dispute a transaction

1. On ${fdate(d.chargeDate)} my card was charged ${money(d.amount)} by "${g(d,"merchant")}".
2. Reason: ${g(d,"reason")}.
3. Details: ${g(d,"details")}
4. I request that you reverse the charge, refund the amount, and open a chargeback inquiry with the merchant under the card-network rules and applicable law.
5. Please reply in writing. All rights reserved.

Respectfully,
${g(d,"cardholderName")}`;}},
{id:"subscription-cancel",cat:"consumer",icon:"refresh",accent:"b",live:true,
 title:{he:"ביטול מנוי מתחדש",en:"Subscription Cancellation"},
 blurb:{he:"הודעת ביטול למנוי/הוראת קבע.",en:"Cancel a recurring subscription / standing order."},
 fields:[
   F("customerName","text","שם הלקוח","Customer name",{req:true,half:true}),
   F("businessName","text","שם העסק","Business name",{req:true,half:true}),
   F("serviceName","text","שם השירות / מנוי","Service / subscription",{req:true}),
   F("customerId","text","מספר לקוח / הזמנה","Customer / order no.",{half:true}),
   F("cancelDate","date","מועד ביטול מבוקש","Requested cancellation date",{half:true}),
   F("paymentMethod","text","אמצעי תשלום לחיוב","Payment method charged",{half:true}),
   F("details","textarea","הערות נוספות","Additional details"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"businessName")}
מאת: ${g(d,"customerName")}

הנדון: הודעת ביטול מנוי מתחדש והפסקת חיובים

1. אני מודיע/ה בזאת על ביטול המנוי לשירות "${g(d,"serviceName")}"${d.customerId?`, מספר לקוח/הזמנה ${g(d,"customerId")}`:""}.
2. אבקש להפסיק את השירות ואת כל החיובים החל מיום ${fdate(d.cancelDate)}.
3. אין לחייב עוד את אמצעי התשלום ${g(d,"paymentMethod")} בגין שירות זה.
4. ככל שנגבה סכום לאחר מועד הביטול, אבקש להשיבו ללא דיחוי.
5. אבקש אישור ביטול בכתב, לרבות מועד סיום השירות וסגירת הוראת החיוב.
${d.details?`\nהערות: ${g(d,"details")}\n`:""}
בכבוד רב,
${g(d,"customerName")}`
:
`${today()}

To: ${g(d,"businessName")}
From: ${g(d,"customerName")}

Re: Cancellation of recurring subscription and charges

1. I hereby cancel my subscription to "${g(d,"serviceName")}"${d.customerId?`, customer/order number ${g(d,"customerId")}`:""}.
2. Please terminate the service and all recurring charges as of ${fdate(d.cancelDate)}.
3. Do not further charge the payment method ${g(d,"paymentMethod")} for this service.
4. If any amount is charged after cancellation, please refund it without delay.
5. Please confirm cancellation in writing, including the service end date and closure of the billing instruction.
${d.details?`\nNotes: ${g(d,"details")}\n`:""}
Respectfully,
${g(d,"customerName")}`;}},
{id:"insurance-claim",cat:"consumer",icon:"shield",accent:"b",live:true,
 title:{he:"דרישה מחברת ביטוח",en:"Insurance Claim Demand"},
 blurb:{he:"מכתב דרישה לתשלום תגמולי ביטוח.",en:"Demand payment of insurance benefits."},
 fields:[
   F("insuredName","text","שם המבוטח","Insured name",{req:true,half:true}),
   F("insurerName","text","שם חברת הביטוח","Insurer",{req:true,half:true}),
   F("policyNumber","text","מספר פוליסה","Policy number",{half:true}),
   F("claimNumber","text","מספר תביעה","Claim number",{half:true}),
   F("eventDate","date","תאריך האירוע","Event date",{req:true,half:true}),
   F("amount","number","סכום דרישה (₪)","Claim amount (₪)",{half:true}),
   F("eventDetails","textarea","תיאור האירוע והנזק","Event and loss details",{req:true}),
   F("documents","textarea","מסמכים מצורפים","Attached documents"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"insurerName")}
מאת: ${g(d,"insuredName")}

הנדון: דרישה לתשלום תגמולי ביטוח

פרטי פוליסה: ${g(d,"policyNumber")}
מספר תביעה: ${g(d,"claimNumber")}

1. ביום ${fdate(d.eventDate)} אירע מקרה הביטוח המתואר להלן: ${g(d,"eventDetails")}
2. בהתאם לפוליסה ולדין, אני דורש/ת את תשלום תגמולי הביטוח${d.amount?` בסך ${money(d.amount)}`:""}.
3. המסמכים התומכים בדרישה: ${g(d,"documents")}
4. ככל שחסרים מסמכים, אבקש לקבל דרישה מסודרת ומפורטת בכתב.
5. אבקש להשלים את בירור התביעה ולשלם את הסכום שאינו שנוי במחלוקת ללא דיחוי. כל זכויותיי שמורות.

בכבוד רב,
${g(d,"insuredName")}`
:
`${today()}

To: ${g(d,"insurerName")}
From: ${g(d,"insuredName")}

Re: Demand for insurance benefits

Policy: ${g(d,"policyNumber")}
Claim no.: ${g(d,"claimNumber")}

1. On ${fdate(d.eventDate)} the insured event occurred as follows: ${g(d,"eventDetails")}
2. Under the policy and applicable law, I demand payment of insurance benefits${d.amount?` in the amount of ${money(d.amount)}`:""}.
3. Supporting documents: ${g(d,"documents")}
4. If any document is missing, please provide a clear written request.
5. Please complete the claim review and pay any undisputed amount without delay. All rights reserved.

Respectfully,
${g(d,"insuredName")}`;}},
{id:"flight-comp",cat:"consumer",icon:"plane",accent:"b",live:true,
 title:{he:"פיצוי על טיסה שבוטלה/התעכבה",en:"Flight Delay / Cancellation Compensation"},
 blurb:{he:"תביעת פיצוי לפי חוק שירותי תעופה.",en:"Claim under aviation-services law."},
 fields:[
   F("passengerName","text","שם הנוסע","Passenger name",{req:true,half:true}),
   F("airline","text","חברת תעופה","Airline",{req:true,half:true}),
   F("flightNumber","text","מספר טיסה","Flight no.",{req:true,half:true}),
   F("flightDate","date","תאריך הטיסה","Flight date",{req:true,half:true}),
   F("route","text","מסלול הטיסה","Route",{req:true,ph:{he:"לדוגמה: תל אביב - רומא",en:"e.g., Tel Aviv - Rome"}}),
   SEL("issue","סוג האירוע","Issue",["ביטול טיסה","איחור מעל 8 שעות","סירוב להטיס","הקדמת טיסה משמעותית"],["Flight cancellation","Delay over 8 hours","Denied boarding","Significant schedule advance"],{req:true}),
   F("details","textarea","פירוט וזמני הודעה","Details and notice timing",{req:true}),
   F("expenses","number","הוצאות נוספות (₪)","Additional expenses (₪)",{half:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"airline")}
מאת: ${g(d,"passengerName")}

הנדון: דרישת פיצוי בגין ${g(d,"issue")} - טיסה ${g(d,"flightNumber")}

1. רכשתי כרטיס לטיסה ${g(d,"flightNumber")} במסלול ${g(d,"route")} שמועד ביצועה היה ${fdate(d.flightDate)}.
2. בפועל אירע: ${g(d,"issue")}.
3. פירוט האירוע וזמני ההודעה: ${g(d,"details")}
4. בהתאם לחוק שירותי תעופה (פיצוי וסיוע בשל ביטול טיסה או שינוי בתנאיה), אני דורש/ת פיצוי, החזר הוצאות וסיוע כפי שמגיעים לי לפי דין.
${d.expenses?`5. בנוסף נגרמו לי הוצאות בסך ${money(d.expenses)}, ואבקש להשיבן כנגד אסמכתאות.\n`:"5. ככל שנדרשות אסמכתאות נוספות, אבקש לקבל דרישה מסודרת בכתב.\n"}
אבקש את תשובתכם ותשלום הסכומים המגיעים לי בתוך 14 ימים.

בכבוד רב,
${g(d,"passengerName")}`
:
`${today()}

To: ${g(d,"airline")}
From: ${g(d,"passengerName")}

Re: Compensation demand for ${g(d,"issue")} - flight ${g(d,"flightNumber")}

1. I purchased a ticket for flight ${g(d,"flightNumber")} on the route ${g(d,"route")}, scheduled for ${fdate(d.flightDate)}.
2. The following occurred: ${g(d,"issue")}.
3. Details and notice timing: ${g(d,"details")}
4. Under Israel's Aviation Services Law, I demand the compensation, reimbursement and assistance to which I am entitled.
${d.expenses?`5. I also incurred expenses of ${money(d.expenses)}, which I ask you to reimburse against supporting documents.\n`:"5. If further documents are required, please send a clear written request.\n"}
Please respond and pay the amounts due within 14 days.

Respectfully,
${g(d,"passengerName")}`;}},
{id:"regulator-complaint",cat:"consumer",icon:"badge",accent:"n",live:true,
 title:{he:"תלונה לרגולטור / ממונה",en:"Complaint to Regulator / Ombudsman"},
 blurb:{he:"תלונה מסודרת לגוף פיקוח.",en:"Structured complaint to a supervisory body."},
 fields:[
   F("complainantName","text","שם המתלונן","Complainant",{req:true,half:true}),
   F("regulatorName","text","שם הגוף המפקח","Regulator / ombudsman",{req:true,half:true}),
   F("businessName","text","הגוף שעליו מתלוננים","Entity complained of",{req:true}),
   F("topic","text","נושא התלונה","Complaint topic",{req:true}),
   F("priorContactDate","date","פנייה קודמת לגוף","Prior contact date",{half:true}),
   F("facts","textarea","תיאור העובדות","Facts",{req:true}),
   F("requestedRemedy","textarea","מה מבוקש","Requested remedy",{req:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

לכבוד
${g(d,"regulatorName")}

הנדון: תלונה נגד ${g(d,"businessName")} - ${g(d,"topic")}

אני, ${g(d,"complainantName")}, מגיש/ה בזאת תלונה מסודרת נגד ${g(d,"businessName")}.

1. העובדות: ${g(d,"facts")}
2. פנייה קודמת לגוף נעשתה ביום ${fdate(d.priorContactDate)}, אך הנושא לא טופל לשביעות רצוני.
3. הסעד המבוקש: ${g(d,"requestedRemedy")}
4. אבקש את בדיקתכם, מתן הנחיות לגוף המפוקח, ועדכון בכתב לגבי תוצאות הטיפול.

בכבוד רב,
${g(d,"complainantName")}`
:
`${today()}

To:
${g(d,"regulatorName")}

Re: Complaint against ${g(d,"businessName")} - ${g(d,"topic")}

I, ${g(d,"complainantName")}, submit this formal complaint against ${g(d,"businessName")}.

1. Facts: ${g(d,"facts")}
2. I previously contacted the entity on ${fdate(d.priorContactDate)}, but the matter was not resolved satisfactorily.
3. Requested remedy: ${g(d,"requestedRemedy")}
4. Please review the matter, instruct the supervised entity as needed, and update me in writing on the outcome.

Respectfully,
${g(d,"complainantName")}`;}},

/* ---- MONEY ---- */
{id:"demand-letter",cat:"money",icon:"alert",accent:"r",live:true,
 title:{he:"מכתב התראה לפני תביעה",en:"Demand Letter (Pre-Litigation)"},
 blurb:{he:"דרישת תשלום/ביצוע רשמית עם מועד אחרון.",en:"Formal demand for payment/action with a deadline."},
 fields:[
   F("senderName","text","שם השולח","Your name",{req:true,half:true}),
   F("senderAddress","text","כתובת השולח","Your address",{half:true}),
   F("recipientName","text","שם הנמען","Recipient name",{req:true,half:true}),
   F("recipientAddress","text","כתובת הנמען","Recipient address",{half:true}),
   F("subject","text","נושא הדרישה","Subject of demand",{req:true,ph:{he:"חוב בגין…",en:"Debt for…"}}),
   F("amount","number","סכום הנדרש (₪)","Amount owed (₪)",{half:true}),
   F("deadlineDays","number","מספר ימים לתשלום","Days to comply",{half:true,ph:{he:"14",en:"14"}}),
   F("facts","textarea","פירוט העובדות","The facts",{req:true,ph:{he:"מה קרה, מתי, ומדוע קמה החובה…",en:"What happened, when, and why the obligation arose…"}}),
 ],
 gen(d){const days=g(d,"deadlineDays")===BL?"14":g(d,"deadlineDays");return LANG==="he"?
`${g(d,"senderName")}
${g(d,"senderAddress")}
${today()}

אל: ${g(d,"recipientName")}
${g(d,"recipientAddress")}

הנדון: מכתב התראה - ${g(d,"subject")}
${(d.amount?`סכום הדרישה: ${money(d.amount)}`:"")}

1.  הריני פונה אליך/ך בדרישה אחרונה בטרם נקיטת הליכים משפטיים, כמפורט להלן.
2.  העובדות: ${g(d,"facts")}
3.  על כן, הנך נדרש/ת לשלם/לבצע את האמור לעיל${d.amount?` בסך ${money(d.amount)}`:""} תוך ${days} ימים ממועד מכתב זה.
4.  לא תיענה הדרישה במועד - אאלץ לפעול בכל דרך חוקית, לרבות הגשת תביעה, ללא התראה נוספת, על כל הוצאות והנזקים הכרוכים בכך.
5.  אין באמור כדי לגרוע מכל זכות או סעד העומדים לי לפי כל דין, וכולם שמורים.

בכבוד רב,
${g(d,"senderName")}`
:
`${g(d,"senderName")}
${g(d,"senderAddress")}
${today()}

To: ${g(d,"recipientName")}
${g(d,"recipientAddress")}

Re: Demand Letter - ${g(d,"subject")}
${(d.amount?`Amount demanded: ${money(d.amount)}`:"")}

1.  This is a final demand before legal proceedings, as set out below.
2.  Facts: ${g(d,"facts")}
3.  You are therefore required to pay/perform the above${d.amount?` in the sum of ${money(d.amount)}`:""} within ${days} days of this letter.
4.  Failing timely compliance, I will pursue every lawful remedy, including filing suit, without further notice, at your cost.
5.  Nothing herein waives any right or remedy available to me under law; all are expressly reserved.

Respectfully,
${g(d,"senderName")}`;}},

{id:"small-claims",cat:"money",icon:"gavel",accent:"b",live:true,
 title:{he:"כתב תביעה - תביעות קטנות",en:"Statement of Claim - Small Claims"},
 blurb:{he:"כתב תביעה מובנה לבית המשפט לתביעות קטנות.",en:"Structured statement of claim for small-claims court."},
 fields:[
   F("court","text","בית המשפט","Court",{ph:{he:"בית המשפט לתביעות קטנות ב…",en:"Small Claims Court in…"}}),
   F("plaintiffName","text","שם התובע","Plaintiff name",{req:true,half:true}),
   F("plaintiffId","text","ת.ז. התובע","Plaintiff ID",{half:true}),
   F("plaintiffAddress","text","כתובת התובע","Plaintiff address"),
   F("defendantName","text","שם הנתבע","Defendant name",{req:true,half:true}),
   F("defendantAddress","text","כתובת הנתבע","Defendant address",{half:true}),
   F("amount","number","סכום התביעה (₪)","Claim amount (₪)",{req:true}),
   F("facts","textarea","עובדות המקרה","Facts of the case",{req:true}),
   F("reliefSought","textarea","הסעד המבוקש","Relief sought",{ph:{he:"לחייב את הנתבע לשלם…",en:"Order the defendant to pay…"}}),
 ],
 gen(d){return LANG==="he"?
`ב${g(d,"court")}

התובע/ת:   ${g(d,"plaintiffName")}, ת.ז. ${g(d,"plaintiffId")}
            ${g(d,"plaintiffAddress")}
                                   - נ ג ד -
הנתבע/ת:   ${g(d,"defendantName")}
            ${g(d,"defendantAddress")}

סכום התביעה: ${money(d.amount)}

כ ת ב   ת ב י ע ה

א. הצדדים
   1. התובע/ת הוא/היא ${g(d,"plaintiffName")}.
   2. הנתבע/ת הוא/היא ${g(d,"defendantName")}.

ב. העובדות
   3. ${g(d,"facts")}

ג. הסעד המבוקש
   4. ${g(d,"reliefSought")}
   5. אי לכך מתבקש בית המשפט הנכבד לחייב את הנתבע/ת בתשלום סך ${money(d.amount)} בתוספת הפרשי הצמדה, ריבית והוצאות משפט.

                                            ___________________
                                            ${g(d,"plaintiffName")}, התובע/ת
                                            ${today()}`
:
`In the ${g(d,"court")}

Plaintiff:  ${g(d,"plaintiffName")}, ID ${g(d,"plaintiffId")}
            ${g(d,"plaintiffAddress")}
                                   - v. -
Defendant:  ${g(d,"defendantName")}
            ${g(d,"defendantAddress")}

Claim amount: ${money(d.amount)}

STATEMENT OF CLAIM

A. The Parties
   1. The Plaintiff is ${g(d,"plaintiffName")}.
   2. The Defendant is ${g(d,"defendantName")}.

B. The Facts
   3. ${g(d,"facts")}

C. Relief Sought
   4. ${g(d,"reliefSought")}
   5. The honourable Court is therefore requested to order the Defendant to pay ${money(d.amount)}, plus linkage, interest and costs.

                                            ___________________
                                            ${g(d,"plaintiffName")}, Plaintiff
                                            ${today()}`;}},

{id:"promissory-note",cat:"money",icon:"doc",accent:"g",live:true,
 title:{he:"שטר חוב / הודאת חוב",en:"Promissory Note / IOU"},
 blurb:{he:"התחייבות תשלום עם מועד פירעון.",en:"Payment undertaking with a due date."},
 fields:[
   F("lender","text","שם הנושה (המלווה)","Lender name",{req:true,half:true}),
   F("borrower","text","שם החייב (הלווה)","Borrower name",{req:true,half:true}),
   F("borrowerId","text","ת.ז. החייב","Borrower ID",{half:true}),
   F("amount","number","סכום החוב (₪)","Amount (₪)",{req:true,half:true}),
   F("dueDate","date","מועד הפירעון","Due date",{req:true,half:true}),
   F("interest","text","ריבית (רשות)","Interest (optional)",{half:true}),
 ],
 gen(d){return LANG==="he"?
`שטר חוב / הודאת חוב

אני הח״מ, ${g(d,"borrower")}, ת.ז. ${g(d,"borrowerId")} ("החייב"), מאשר/ת בזאת כי אני חב/ה ל${g(d,"lender")} ("הנושה") סך של ${money(d.amount)}.

1. הסכום יוחזר במלואו עד ליום ${fdate(d.dueDate)}.
2. ${d.interest?`על הסכום תתווסף ריבית בשיעור ${g(d,"interest")} עד למועד הפירעון.`:"הסכום אינו נושא ריבית, אלא אם הוסכם אחרת בכתב."}
3. לא ייפרע הסכום במועד, יהיה הנושה רשאי לפעול לגבייתו בכל דרך חוקית, לרבות בהוצאה לפועל, על חשבון החייב.
4. מסמך זה מהווה הודאת חוב והתחייבות לתשלום.

נחתם ביום ${today()}.

___________________            ___________________
${g(d,"borrower")} (החייב)            ${g(d,"lender")} (הנושה)`
:
`Promissory Note

I, the undersigned, ${g(d,"borrower")}, ID ${g(d,"borrowerId")} (the "Debtor"), acknowledge that I owe ${g(d,"lender")} (the "Creditor") the sum of ${money(d.amount)}.

1. The sum shall be repaid in full by ${fdate(d.dueDate)}.
2. ${d.interest?`Interest of ${g(d,"interest")} shall accrue until repayment.`:"The sum bears no interest unless otherwise agreed in writing."}
3. If not repaid on time, the Creditor may collect it by any lawful means, including execution proceedings, at the Debtor's expense.
4. This document is an acknowledgment of debt and an undertaking to pay.

Signed on ${today()}.

___________________            ___________________
${g(d,"borrower")} (Debtor)            ${g(d,"lender")} (Creditor)`;}},
{id:"loan-agreement",cat:"money",icon:"coins",accent:"g",live:true,
 title:{he:"הסכם הלוואה פרטית",en:"Private Loan Agreement"},
 blurb:{he:"תנאי הלוואה, ריבית והחזר.",en:"Loan terms, interest and repayment."},
 fields:[
   F("lenderName","text","שם המלווה","Lender",{req:true,half:true}),
   F("borrowerName","text","שם הלווה","Borrower",{req:true,half:true}),
   F("amount","number","סכום ההלוואה (₪)","Loan amount (₪)",{req:true,half:true}),
   F("date","date","מועד העמדת ההלוואה","Loan date",{half:true}),
   F("repayment","textarea","תנאי החזר","Repayment terms",{req:true,ph:{he:"לדוגמה: 12 תשלומים חודשיים שווים",en:"e.g., 12 equal monthly payments"}}),
   F("interest","text","ריבית (אם קיימת)","Interest (if any)",{half:true}),
   F("security","text","בטוחות / ערבויות","Security / guarantees",{half:true}),
 ],
 gen(d){return LANG==="he"?
`הסכם הלוואה פרטית
נערך ונחתם ביום ${today()}

בין: ${g(d,"lenderName")} ("המלווה")
לבין: ${g(d,"borrowerName")} ("הלווה")

1. סכום ההלוואה: המלווה מעמיד ללווה הלוואה בסך ${money(d.amount)}, ביום ${fdate(d.date)}.
2. תנאי החזר: ${g(d,"repayment")}
3. ריבית: ${g(d,"interest")}.
4. בטוחות: ${g(d,"security")}.
5. הקדמת תשלום: הלווה רשאי לפרוע את ההלוואה מוקדם, אלא אם הוסכם אחרת בכתב.
6. פיגור: אי תשלום במועד יהווה הפרה יסודית ויזכה את המלווה בכל סעד על פי דין.
7. דין: על הסכם זה יחול הדין הישראלי.

ולראיה באו הצדדים על החתום:

___________________            ___________________
המלווה                          הלווה`
:
`Private Loan Agreement
Made on ${today()}

Between: ${g(d,"lenderName")} (the "Lender")
And:     ${g(d,"borrowerName")} (the "Borrower")

1. Loan amount: the Lender provides the Borrower a loan of ${money(d.amount)} on ${fdate(d.date)}.
2. Repayment terms: ${g(d,"repayment")}
3. Interest: ${g(d,"interest")}.
4. Security: ${g(d,"security")}.
5. Early repayment: the Borrower may repay early unless otherwise agreed in writing.
6. Default: failure to pay on time is a material breach and entitles the Lender to every lawful remedy.
7. Governing law: Israeli law applies.

In witness whereof the parties have signed:

___________________            ___________________
Lender                          Borrower`;}},
{id:"payment-plan",cat:"money",icon:"refresh",accent:"b",live:true,
 title:{he:"הסכם פריסת תשלומים",en:"Payment / Installment Plan"},
 blurb:{he:"הסדר תשלומים לחוב קיים.",en:"Installment arrangement for a debt."},
 fields:[
   F("creditorName","text","שם הנושה","Creditor",{req:true,half:true}),
   F("debtorName","text","שם החייב","Debtor",{req:true,half:true}),
   F("debtAmount","number","סכום החוב (₪)","Debt amount (₪)",{req:true,half:true}),
   F("installments","number","מספר תשלומים","Number of installments",{req:true,half:true}),
   F("firstPaymentDate","date","תשלום ראשון","First payment date",{req:true,half:true}),
   F("monthlyAmount","number","סכום כל תשלום (₪)","Installment amount (₪)",{req:true,half:true}),
   F("notes","textarea","תנאים נוספים","Additional terms"),
 ],
 gen(d){return LANG==="he"?
`הסכם פריסת תשלומים
נערך ביום ${today()}

בין: ${g(d,"creditorName")} ("הנושה")
לבין: ${g(d,"debtorName")} ("החייב")

1. החייב מאשר כי קיים חוב לנושה בסך ${money(d.debtAmount)}.
2. הצדדים מסכימים כי החוב ייפרע ב-${g(d,"installments")} תשלומים בסך ${money(d.monthlyAmount)} כל אחד.
3. התשלום הראשון ישולם ביום ${fdate(d.firstPaymentDate)}, וכל תשלום נוסף במועד המקביל בחודשים שלאחר מכן, אלא אם הוסכם אחרת בכתב.
4. איחור של יותר מ-7 ימים בתשלום כלשהו ייחשב הפרה ויזכה את הנושה לדרוש את יתרת החוב באופן מיידי.
5. תנאים נוספים: ${g(d,"notes")}
6. אין בהסדר זה ויתור על טענה או זכות אלא אם צוין במפורש.

___________________            ___________________
הנושה                           החייב`
:
`Payment / Installment Plan
Made on ${today()}

Between: ${g(d,"creditorName")} (the "Creditor")
And:     ${g(d,"debtorName")} (the "Debtor")

1. The Debtor confirms a debt to the Creditor in the amount of ${money(d.debtAmount)}.
2. The parties agree that the debt shall be paid in ${g(d,"installments")} installments of ${money(d.monthlyAmount)} each.
3. The first payment shall be made on ${fdate(d.firstPaymentDate)}, and each later payment on the corresponding monthly date, unless otherwise agreed in writing.
4. A delay of more than 7 days in any installment is a breach and entitles the Creditor to demand the full balance immediately.
5. Additional terms: ${g(d,"notes")}
6. This arrangement does not waive any right or claim unless expressly stated.

___________________            ___________________
Creditor                        Debtor`;}},
{id:"debt-settlement",cat:"money",icon:"file",accent:"g",live:true,
 title:{he:"מכתב הסדר חוב",en:"Debt Settlement Letter"},
 blurb:{he:"הצעת פשרה לסילוק חוב.",en:"Settlement offer to clear a debt."},
 fields:[
   F("debtorName","text","שם החייב","Debtor",{req:true,half:true}),
   F("creditorName","text","שם הנושה","Creditor",{req:true,half:true}),
   F("originalDebt","number","סכום חוב מקורי (₪)","Original debt (₪)",{req:true,half:true}),
   F("settlementAmount","number","סכום מוצע (₪)","Settlement offer (₪)",{req:true,half:true}),
   F("paymentDate","date","מועד תשלום מוצע","Proposed payment date",{req:true,half:true}),
   F("reason","textarea","נימוק להצעה","Reason for offer"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"creditorName")}
מאת: ${g(d,"debtorName")}

הנדון: הצעה להסדר חוב

1. מבלי להודות בכל טענה, ולצורך פשרה בלבד, אני מציע/ה להסדיר את החוב הנטען בסך ${money(d.originalDebt)} באמצעות תשלום סופי ומלא בסך ${money(d.settlementAmount)}.
2. התשלום המוצע יבוצע עד ליום ${fdate(d.paymentDate)}.
3. נימוקי ההצעה: ${g(d,"reason")}
4. בכפוף לקבלת הסכום המוסכם, אבקש כי תאשרו בכתב שאין לכם כל דרישה נוספת בקשר לחוב זה, וכי כל הליך גבייה או דיווח שלילי יופסק או יעודכן בהתאם.
5. הצעה זו פתוחה למשך 7 ימים ואינה מהווה הודאה בחוב או ויתור על זכויות.

בכבוד רב,
${g(d,"debtorName")}`
:
`${today()}

To: ${g(d,"creditorName")}
From: ${g(d,"debtorName")}

Re: Debt settlement proposal

1. Without admitting any claim and for settlement purposes only, I propose to settle the alleged debt of ${money(d.originalDebt)} by a final payment of ${money(d.settlementAmount)}.
2. The proposed payment will be made by ${fdate(d.paymentDate)}.
3. Reason for the offer: ${g(d,"reason")}
4. Upon receipt of the agreed amount, please confirm in writing that you have no further claim regarding this debt, and that any collection action or negative report will be stopped or updated.
5. This offer is open for 7 days and is not an admission of debt or waiver of rights.

Respectfully,
${g(d,"debtorName")}`;}},
{id:"receipt-invoice",cat:"money",icon:"doc",accent:"n",live:true,
 title:{he:"קבלה / חשבונית",en:"Receipt / Invoice"},
 blurb:{he:"מסמך תשלום פשוט ומסודר.",en:"Simple, tidy payment document."},
 fields:[
   F("issuerName","text","שם מנפיק המסמך","Issuer",{req:true,half:true}),
   F("payerName","text","שם המשלם","Payer",{req:true,half:true}),
   F("documentNumber","text","מספר מסמך","Document no.",{half:true}),
   F("date","date","תאריך","Date",{half:true}),
   F("description","textarea","תיאור שירות/מוצר","Description",{req:true}),
   F("amount","number","סכום (₪)","Amount (₪)",{req:true,half:true}),
   SEL("paymentMethod","אמצעי תשלום","Payment method",["מזומן","העברה בנקאית","כרטיס אשראי","צ׳ק","אחר"],["Cash","Bank transfer","Credit card","Check","Other"],{half:true}),
 ],
 gen(d){return LANG==="he"?
`קבלה / חשבונית
מספר: ${g(d,"documentNumber")}
תאריך: ${g(d,"date")===BL?today():fdate(d.date)}

מאת: ${g(d,"issuerName")}
לכבוד: ${g(d,"payerName")}

תיאור: ${g(d,"description")}
סכום: ${money(d.amount)}
אמצעי תשלום: ${g(d,"paymentMethod")}

הערה: מסמך זה הוא טיוטה תפעולית בלבד. יש להפיק מסמך מס כדין במערכת הנהלת החשבונות המורשית, ככל שנדרש.

חתימה: ___________________`
:
`Receipt / Invoice
No.: ${g(d,"documentNumber")}
Date: ${g(d,"date")===BL?today():fdate(d.date)}

From: ${g(d,"issuerName")}
To:   ${g(d,"payerName")}

Description: ${g(d,"description")}
Amount: ${money(d.amount)}
Payment method: ${g(d,"paymentMethod")}

Note: this is an operational draft only. Issue any tax document required by law through the authorized accounting system.

Signature: ___________________`;}},

/* ---- WORK ---- */
{id:"resignation-letter",cat:"work",icon:"brief",accent:"b",live:true,
 title:{he:"מכתב התפטרות",en:"Resignation Letter"},
 blurb:{he:"מכתב התפטרות מקצועי עם הודעה מוקדמת.",en:"Professional resignation with notice."},
 fields:[
   F("employeeName","text","שמך","Your name",{req:true,half:true}),
   F("position","text","תפקיד","Position",{half:true}),
   F("employerName","text","שם המעסיק / חברה","Employer / company",{req:true}),
   F("managerName","text","שם הממונה","Manager name",{half:true}),
   F("lastDay","date","יום עבודה אחרון","Last working day",{half:true,req:true}),
   F("note","textarea","הערה אישית (רשות)","Personal note (optional)"),
 ],
 gen(d){return LANG==="he"?
`${today()}

לכבוד
${g(d,"managerName")}
${g(d,"employerName")}

הנדון: הודעה על התפטרות

שלום רב,

הריני להודיע על סיום העסקתי בתפקיד ${g(d,"position")}, כאשר יום עבודתי האחרון יהיה ${fdate(d.lastDay)}, בכפוף לתקופת ההודעה המוקדמת על פי דין והסכם העבודה.

אני מתחייב/ת להעביר את התפקיד בצורה מסודרת ולסייע בחפיפה עד למועד הסיום.
${d.note?("\n"+g(d,"note")+"\n"):""}
אני מודה על ההזדמנות ועל שיתוף הפעולה.

בברכה,
${g(d,"employeeName")}`
:
`${today()}

To:
${g(d,"managerName")}
${g(d,"employerName")}

Re: Notice of Resignation

Dear ${g(d,"managerName")},

I hereby give notice of my resignation from the position of ${g(d,"position")}. My last working day will be ${fdate(d.lastDay)}, subject to the statutory and contractual notice period.

I undertake to hand over my role in an orderly manner and to assist with the transition until my departure.
${d.note?("\n"+g(d,"note")+"\n"):""}
Thank you for the opportunity and the cooperation.

Sincerely,
${g(d,"employeeName")}`;}},

{id:"termination-letter",cat:"work",icon:"brief",accent:"r",live:true,
 title:{he:"מכתב סיום העסקה (לאחר שימוע)",en:"Termination Letter (Post-Hearing)"},
 blurb:{he:"הודעת פיטורין לאחר הליך שימוע כדין.",en:"Dismissal notice following a lawful hearing."},
 fields:[
   F("employerName","text","שם המעסיק","Employer name",{req:true,half:true}),
   F("employeeName","text","שם העובד","Employee name",{req:true,half:true}),
   F("position","text","תפקיד","Position",{half:true}),
   F("hearingDate","date","תאריך השימוע","Hearing date",{half:true}),
   F("terminationDate","date","מועד סיום העסקה","Termination date",{req:true,half:true}),
   F("reason","textarea","נימוקי הסיום","Reasons for termination",{req:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

לכבוד
${g(d,"employeeName")}

הנדון: הודעה על סיום העסקה

שלום רב,

בהמשך לשימוע שנערך לך ביום ${fdate(d.hearingDate)}, ולאחר שנשקלו טענותיך בלב פתוח ובנפש חפצה, הרינו להודיעך על סיום העסקתך בתפקיד ${g(d,"position")} ב-${g(d,"employerName")}, החל מיום ${fdate(d.terminationDate)}.

נימוקי ההחלטה: ${g(d,"reason")}

זכויותיך - לרבות פיצויי פיטורין, פדיון חופשה והודעה מוקדמת - ישולמו במלואן כדין. מכתב ריכוז זכויות יימסר בנפרד.

אנו מודים לך על תרומתך ומאחלים לך הצלחה בהמשך.

בכבוד רב,
${g(d,"employerName")}`
:
`${today()}

To:
${g(d,"employeeName")}

Re: Notice of Termination of Employment

Dear ${g(d,"employeeName")},

Further to the hearing held on ${fdate(d.hearingDate)}, and having considered your representations with an open mind, we hereby give notice of the termination of your employment as ${g(d,"position")} at ${g(d,"employerName")}, effective ${fdate(d.terminationDate)}.

Reasons for the decision: ${g(d,"reason")}

Your entitlements - including severance pay, accrued leave and notice - will be paid in full as required by law. A statement of entitlements will be provided separately.

We thank you for your contribution and wish you success.

Respectfully,
${g(d,"employerName")}`;}},

{id:"employment-contract",cat:"work",icon:"file",accent:"b",live:true,
 title:{he:"חוזה עבודה",en:"Employment Contract"},
 blurb:{he:"תנאי העסקה, שכר, היקף וסיום.",en:"Terms, salary, scope and termination."},
 fields:[
   F("employerName","text","שם המעסיק","Employer name",{req:true,half:true}),
   F("employeeName","text","שם העובד","Employee name",{req:true,half:true}),
   F("position","text","תפקיד","Position",{req:true,half:true}),
   F("startDate","date","תאריך תחילת עבודה","Start date",{req:true,half:true}),
   F("salary","number","שכר חודשי ברוטו (₪)","Monthly gross salary (₪)",{req:true,half:true}),
   SEL("scope","היקף משרה","Scope",["משרה מלאה","משרה חלקית","שעתי"],["Full-time","Part-time","Hourly"],{half:true}),
   F("duties","textarea","תיאור התפקיד","Duties"),
 ],
 gen(d){return LANG==="he"?
`חוזה עבודה
נערך ונחתם ביום ${today()}

בין: ${g(d,"employerName")} ("המעסיק")
לבין: ${g(d,"employeeName")} ("העובד")

1. תפקיד: העובד יועסק בתפקיד ${g(d,"position")} (${g(d,"scope")}), החל מיום ${fdate(d.startDate)}.
2. תיאור התפקיד: ${g(d,"duties")}
3. שכר: שכר חודשי ברוטו בסך ${money(d.salary)}, שישולם עד ה-9 לחודש העוקב, בכפוף לניכויים על פי דין.
4. תנאים סוציאליים: המעסיק יפריש לפנסיה, פיצויים וכל זכות אחרת על פי דין וצווי ההרחבה.
5. סודיות: העובד ישמור על סודיות מידע המעסיק בתקופת ההעסקה ולאחריה.
6. סיום: כל צד רשאי לסיים את ההעסקה בהודעה מוקדמת על פי חוק; יערך שימוע כדין טרם פיטורין.
7. דין: על חוזה זה יחול הדין הישראלי.

ולראיה באו הצדדים על החתום:

___________________            ___________________
המעסיק                          העובד`
:
`Employment Contract
Made on ${today()}

Between: ${g(d,"employerName")} ("Employer")
And:     ${g(d,"employeeName")} ("Employee")

1. Position: the Employee is engaged as ${g(d,"position")} (${g(d,"scope")}), from ${fdate(d.startDate)}.
2. Duties: ${g(d,"duties")}
3. Salary: a monthly gross salary of ${money(d.salary)}, payable by the 9th of the following month, subject to lawful deductions.
4. Benefits: the Employer shall contribute to pension, severance and any other right required by law and extension orders.
5. Confidentiality: the Employee shall keep the Employer's information confidential during and after employment.
6. Termination: either party may terminate on statutory notice; a lawful hearing precedes any dismissal.
7. Governing law: Israeli law applies.

In witness whereof the parties have signed:

___________________            ___________________
Employer                        Employee`;}},
{id:"hearing-request",cat:"work",icon:"users",accent:"n",live:true,
 title:{he:"זימון / תגובה לשימוע",en:"Hearing Notice / Response"},
 blurb:{he:"מסמכי הליך שימוע לפני פיטורין.",en:"Pre-dismissal hearing documents."},
 fields:[
   SEL("mode","סוג מסמך","Document type",["זימון לשימוע מטעם מעסיק","תגובת עובד לשימוע"],["Employer hearing invitation","Employee hearing response"],{req:true}),
   F("employerName","text","שם המעסיק","Employer",{req:true,half:true}),
   F("employeeName","text","שם העובד","Employee",{req:true,half:true}),
   F("position","text","תפקיד","Position",{half:true}),
   F("hearingDate","date","מועד השימוע","Hearing date",{half:true}),
   F("location","text","מיקום / אופן קיום","Location / method",{half:true}),
   F("reasons","textarea","נימוקים / טענות","Reasons / arguments",{req:true}),
 ],
 gen(d){const employerMode=String(g(d,"mode")).includes("מעסיק")||String(g(d,"mode")).includes("Employer");return LANG==="he"?
(employerMode?
`${today()}

לכבוד ${g(d,"employeeName")}

הנדון: זימון לשימוע לפני קבלת החלטה בעניין המשך העסקתך

1. הנך מוזמן/ת לשימוע שייערך ביום ${fdate(d.hearingDate)}, ב-${g(d,"location")}, בעניין המשך העסקתך בתפקיד ${g(d,"position")} אצל ${g(d,"employerName")}.
2. הנימוקים הנשקלים: ${g(d,"reasons")}
3. טרם התקבלה החלטה סופית. מטרת השימוע היא לאפשר לך להשמיע את טענותיך בלב פתוח ובנפש חפצה.
4. הנך רשאי/ת להגיע עם מלווה או נציג, ולהעביר טענות ומסמכים בכתב לפני השימוע.

בכבוד רב,
${g(d,"employerName")}`
:
`${today()}

לכבוד ${g(d,"employerName")}

הנדון: תגובה לקראת שימוע

אני, ${g(d,"employeeName")}, המועסק/ת בתפקיד ${g(d,"position")}, מבקש/ת להעלות את טענותיי לקראת השימוע שנקבע ליום ${fdate(d.hearingDate)}.

1. עמדתי ביחס לטענות: ${g(d,"reasons")}
2. אבקש כי טענותיי יישקלו בלב פתוח ובנפש חפצה לפני קבלת החלטה כלשהי.
3. ככל שקיימים מסמכים או נתונים נוספים שעליהם מסתמך המעסיק, אבקש לקבלם לפני השימוע כדי שאוכל להתייחס אליהם באופן מלא.
4. שמורות לי כל זכויותיי על פי דין.

בכבוד רב,
${g(d,"employeeName")}`)
:
(employerMode?
`${today()}

To: ${g(d,"employeeName")}

Re: Invitation to a pre-dismissal hearing

1. You are invited to a hearing on ${fdate(d.hearingDate)}, at ${g(d,"location")}, regarding your continued employment as ${g(d,"position")} with ${g(d,"employerName")}.
2. Matters under consideration: ${g(d,"reasons")}
3. No final decision has been made. The purpose of the hearing is to allow you to present your position openly and fairly.
4. You may attend with a companion or representative and submit written arguments and documents before the hearing.

Respectfully,
${g(d,"employerName")}`
:
`${today()}

To: ${g(d,"employerName")}

Re: Response ahead of hearing

I, ${g(d,"employeeName")}, employed as ${g(d,"position")}, submit my position ahead of the hearing scheduled for ${fdate(d.hearingDate)}.

1. My response to the allegations: ${g(d,"reasons")}
2. Please consider my position openly and fairly before making any decision.
3. If there are additional documents or data on which the employer relies, please provide them before the hearing so I can respond fully.
4. All my rights are reserved.

Respectfully,
${g(d,"employeeName")}`);}},
{id:"unpaid-wages",cat:"work",icon:"coins",accent:"r",live:true,
 title:{he:"דרישת שכר מולן (הלנת שכר)",en:"Unpaid Wages Demand"},
 blurb:{he:"דרישת תשלום שכר ופיצויי הלנה.",en:"Demand wages and delay compensation."},
 fields:[
   F("employeeName","text","שם העובד","Your name",{req:true,half:true}),
   F("employerName","text","שם המעסיק","Employer name",{req:true,half:true}),
   F("period","text","תקופת השכר","Pay period",{req:true,half:true,ph:{he:"לדוגמה: חודש מאי 2026",en:"e.g., May 2026"}}),
   F("amount","number","סכום השכר המולן (₪)","Unpaid amount (₪)",{req:true,half:true}),
   F("dueDate","date","מועד התשלום שנקבע","Original due date",{half:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"employerName")}
מאת: ${g(d,"employeeName")}

הנדון: דרישה לתשלום שכר עבודה מולן

1. הריני לדרוש את תשלום שכר העבודה המגיע לי בגין ${g(d,"period")}, בסך ${money(d.amount)}, אשר היה אמור להשתלם עד ליום ${fdate(d.dueDate)} וטרם שולם.
2. עיכוב בתשלום השכר מהווה הלנת שכר כמשמעה בחוק הגנת השכר, התשי״ח-1958, ומזכה אותי בפיצויי הלנת שכר.
3. אני דורש/ת לשלם את מלוא השכר בתוספת פיצויי הלנה כדין, לא יאוחר מ-7 ימים ממועד מכתב זה.
4. לא תיענה הדרישה, אפעל למיצוי זכויותיי בבית הדין האזורי לעבודה, על כל ההוצאות הכרוכות בכך. כל זכויותיי שמורות.

בכבוד רב,
${g(d,"employeeName")}`
:
`${today()}

To: ${g(d,"employerName")}
From: ${g(d,"employeeName")}

Re: Demand for payment of unpaid wages

1. I demand the wages due to me for ${g(d,"period")}, in the sum of ${money(d.amount)}, which were due by ${fdate(d.dueDate)} and remain unpaid.
2. Delaying wages constitutes unlawful withholding under the Wage Protection Law 5718-1958 and entitles me to delay compensation.
3. I require payment of the full wage plus lawful delay compensation within 7 days of this letter.
4. Failing that, I will pursue my rights in the Regional Labour Court, at your cost. All rights reserved.

Respectfully,
${g(d,"employeeName")}`;}},
{id:"severance-demand",cat:"work",icon:"coins",accent:"r",live:true,
 title:{he:"דרישת פיצויי פיטורין",en:"Severance Pay Demand"},
 blurb:{he:"חישוב ודרישת פיצויים והפרשות.",en:"Compute and demand severance."},
 fields:[
   F("employeeName","text","שם העובד","Employee",{req:true,half:true}),
   F("employerName","text","שם המעסיק","Employer",{req:true,half:true}),
   F("startDate","date","תחילת עבודה","Start date",{req:true,half:true}),
   F("endDate","date","סיום עבודה","End date",{req:true,half:true}),
   F("lastSalary","number","שכר אחרון / קובע (₪)","Last/base salary (₪)",{half:true}),
   F("claimedAmount","number","סכום דרישה (₪)","Claimed amount (₪)",{half:true}),
   F("details","textarea","פירוט זכויות חסרות","Missing entitlements",{req:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"employerName")}
מאת: ${g(d,"employeeName")}

הנדון: דרישה לתשלום פיצויי פיטורין וזכויות סיום עבודה

1. הועסקתי אצלכם מיום ${fdate(d.startDate)} ועד ליום ${fdate(d.endDate)}.
2. שכרי הקובע/האחרון עמד על ${money(d.lastSalary)}.
3. עם סיום העבודה טרם שולמו לי מלוא הזכויות, כמפורט: ${g(d,"details")}
4. אבקש לשלם את פיצויי הפיטורין, ההפרשות, פדיון החופשה וכל זכות נוספת המגיעה לי כדין${d.claimedAmount?` בסך מוערך של ${money(d.claimedAmount)}`:""}.
5. אבקש לקבל בתוך 7 ימים גמר חשבון, תלוש סיום, טופסי שחרור לקופות ואישור העסקה.
6. אי הסדרת התשלום תחייב אותי לשקול פנייה לבית הדין לעבודה. כל זכויותיי שמורות.

בכבוד רב,
${g(d,"employeeName")}`
:
`${today()}

To: ${g(d,"employerName")}
From: ${g(d,"employeeName")}

Re: Demand for severance pay and end-of-employment entitlements

1. I was employed by you from ${fdate(d.startDate)} until ${fdate(d.endDate)}.
2. My last/base salary was ${money(d.lastSalary)}.
3. Upon termination, not all entitlements were paid, as follows: ${g(d,"details")}
4. Please pay severance, contributions, accrued leave and every further entitlement due by law${d.claimedAmount?` in the estimated amount of ${money(d.claimedAmount)}`:""}.
5. Within 7 days, please provide final payroll, release forms for funds, and employment confirmation.
6. If payment is not arranged, I will consider applying to the Labor Court. All rights reserved.

Respectfully,
${g(d,"employeeName")}`;}},
{id:"employment-confirmation",cat:"work",icon:"badge",accent:"g",live:true,
 title:{he:"אישור העסקה",en:"Employment Confirmation"},
 blurb:{he:"אישור תקופת ותנאי העסקה.",en:"Confirm tenure and terms."},
 fields:[
   F("employerName","text","שם המעסיק","Employer",{req:true,half:true}),
   F("employeeName","text","שם העובד","Employee",{req:true,half:true}),
   F("idNumber","text","ת.ז. העובד","Employee ID",{half:true}),
   F("position","text","תפקיד","Position",{req:true,half:true}),
   F("startDate","date","תחילת עבודה","Start date",{req:true,half:true}),
   F("endDate","date","סיום עבודה (אם הסתיים)","End date (if ended)",{half:true}),
   F("scope","text","היקף משרה","Scope",{half:true}),
 ],
 gen(d){return LANG==="he"?
`אישור העסקה
תאריך: ${today()}

לכל מאן דבעי,

הרינו לאשר כי ${g(d,"employeeName")}, ת.ז. ${g(d,"idNumber")}, מועסק/ת אצל ${g(d,"employerName")} בתפקיד ${g(d,"position")}.

מועד תחילת העסקה: ${fdate(d.startDate)}.
${d.endDate?`מועד סיום העסקה: ${fdate(d.endDate)}.\n`:""}
היקף משרה: ${g(d,"scope")}.

אישור זה ניתן לבקשת העובד/ת וללא התחייבות נוספת מצד המעסיק.

בכבוד רב,
${g(d,"employerName")}

חתימה וחותמת: ___________________`
:
`Employment Confirmation
Date: ${today()}

To whom it may concern,

We confirm that ${g(d,"employeeName")}, ID ${g(d,"idNumber")}, is employed by ${g(d,"employerName")} as ${g(d,"position")}.

Start date: ${fdate(d.startDate)}.
${d.endDate?`End date: ${fdate(d.endDate)}.\n`:""}
Scope: ${g(d,"scope")}.

This confirmation is issued at the employee's request and creates no additional undertaking by the employer.

Respectfully,
${g(d,"employerName")}

Signature and stamp: ___________________`;}},
{id:"noncompete",cat:"work",icon:"shield",accent:"n",live:true,
 title:{he:"סודיות ואי-תחרות (עובד)",en:"Confidentiality & Non-Compete"},
 blurb:{he:"התחייבות עובד לסודיות.",en:"Employee confidentiality undertaking."},
 fields:[
   F("employeeName","text","שם העובד","Employee",{req:true,half:true}),
   F("employerName","text","שם המעסיק","Employer",{req:true,half:true}),
   F("role","text","תפקיד","Role",{half:true}),
   F("confidentialInfo","textarea","סוגי מידע סודי","Confidential information",{req:true}),
   F("restriction","textarea","הגבלת עיסוק מוסכמת","Agreed restriction",{ph:{he:"יש לנסח בזהירות ובהתאם לדין",en:"Draft carefully and consistently with law"}}),
   F("termMonths","number","תקופה בחודשים","Term in months",{half:true}),
 ],
 gen(d){const months=g(d,"termMonths")===BL?"12":g(d,"termMonths");return LANG==="he"?
`התחייבות לשמירת סודיות והגבלת עיסוק
נערכה ביום ${today()}

אני, ${g(d,"employeeName")}, המועסק/ת או מועמד/ת להעסקה אצל ${g(d,"employerName")} בתפקיד ${g(d,"role")}, מתחייב/ת כדלקמן:

1. מידע סודי: אשמור בסודיות כל מידע עסקי, מקצועי, טכנולוגי, מסחרי או אישי שייחשף לי, לרבות: ${g(d,"confidentialInfo")}.
2. שימוש מוגבל: אשתמש במידע הסודי אך ורק לצורך עבודתי אצל המעסיק ולא אעבירו לצד שלישי ללא אישור מראש ובכתב.
3. החזרת חומרים: עם סיום ההעסקה אשיב כל מסמך, קובץ, ציוד או מידע השייך למעסיק.
4. הגבלת עיסוק: ${g(d,"restriction")}
5. תקופה: התחייבויות הסודיות יחולו גם לאחר סיום ההעסקה. מגבלת העיסוק, ככל שהיא תקפה לפי דין, תחול לתקופה של ${months} חודשים.
6. ידוע לי כי אכיפת הגבלת עיסוק בישראל נבחנת בזהירות ובהתאם לנסיבות, לרבות סוד מסחרי, תמורה מיוחדת ותום לב.

חתימה: ___________________
${g(d,"employeeName")}`
:
`Confidentiality and Restrictive Covenant Undertaking
Made on ${today()}

I, ${g(d,"employeeName")}, employed or considered for employment by ${g(d,"employerName")} as ${g(d,"role")}, undertake as follows:

1. Confidential information: I will keep confidential all business, professional, technological, commercial or personal information disclosed to me, including: ${g(d,"confidentialInfo")}.
2. Limited use: I will use confidential information solely for my work for the employer and will not disclose it to any third party without prior written consent.
3. Return of materials: upon termination I will return every document, file, device or item belonging to the employer.
4. Restriction: ${g(d,"restriction")}
5. Term: confidentiality continues after employment ends. Any restriction, if enforceable under law, applies for ${months} months.
6. I understand that non-compete enforcement in Israel is assessed carefully according to the circumstances, including trade secrets, special consideration and good faith.

Signature: ___________________
${g(d,"employeeName")}`;}},

/* ---- HOUSING ---- */
{id:"residential-lease",cat:"housing",icon:"home",accent:"g",live:true,
 title:{he:"חוזה שכירות למגורים",en:"Residential Lease Agreement"},
 blurb:{he:"חוזה שכירות מאוזן עם הסעיפים המהותיים.",en:"Balanced lease with the key clauses."},
 fields:[
   F("landlordName","text","שם המשכיר","Landlord name",{req:true,half:true}),
   F("landlordId","text","ת.ז. המשכיר","Landlord ID",{half:true}),
   F("tenantName","text","שם השוכר","Tenant name",{req:true,half:true}),
   F("tenantId","text","ת.ז. השוכר","Tenant ID",{half:true}),
   F("propertyAddress","text","כתובת הנכס","Property address",{req:true}),
   F("monthlyRent","number","שכר דירה חודשי (₪)","Monthly rent (₪)",{req:true,half:true}),
   F("paymentDay","number","יום התשלום בחודש","Payment day",{half:true,ph:{he:"1",en:"1"}}),
   F("startDate","date","תחילת השכירות","Start date",{req:true,half:true}),
   F("months","number","תקופה (חודשים)","Term (months)",{half:true,ph:{he:"12",en:"12"}}),
   F("deposit","text","בטוחות (ערבות/פיקדון)","Security (guarantee/deposit)"),
 ],
 gen(d){const m=g(d,"months")===BL?"12":g(d,"months");return LANG==="he"?
`חוזה שכירות למגורים
שנערך ונחתם ביום ${today()}

בין:  ${g(d,"landlordName")}, ת.ז. ${g(d,"landlordId")} ("המשכיר")
לבין: ${g(d,"tenantName")}, ת.ז. ${g(d,"tenantId")} ("השוכר")

הואיל והמשכיר הוא בעל הזכויות בנכס ברחוב ${g(d,"propertyAddress")} ("המושכר"), והשוכר מעוניין לשכרו למגורים - הוסכם כדלקמן:

1. המושכר ותקופה
   1.1 המשכיר משכיר לשוכר את המושכר למגורים בלבד.
   1.2 תקופת השכירות הינה ${m} חודשים החל מיום ${fdate(d.startDate)}.

2. דמי השכירות
   2.1 דמי השכירות החודשיים הם ${money(d.monthlyRent)}, שישולמו מראש עד ל-${g(d,"paymentDay")} בכל חודש.

3. בטוחות
   3.1 להבטחת התחייבויותיו ימציא השוכר: ${g(d,"deposit")}.

4. אחזקה ושימוש
   4.1 השוכר ישמור על המושכר וישא בתשלומים השוטפים (חשמל, מים, ארנונה, ועד בית).
   4.2 לא יבוצעו שינויים במושכר ללא הסכמת המשכיר מראש ובכתב.

5. כללי
   5.1 הפרה יסודית מזכה את הצד הנפגע בכל סעד שבדין.
   5.2 על חוזה זה יחול הדין הישראלי; סמכות השיפוט לבתי המשפט המוסמכים.

ולראיה באו הצדדים על החתום:

___________________            ___________________
המשכיר                          השוכר`
:
`Residential Lease Agreement
Made on ${today()}

Between: ${g(d,"landlordName")}, ID ${g(d,"landlordId")} ("Landlord")
And:     ${g(d,"tenantName")}, ID ${g(d,"tenantId")} ("Tenant")

Whereas the Landlord holds the rights in the property at ${g(d,"propertyAddress")} (the "Premises"), and the Tenant wishes to rent it for residence - it is agreed as follows:

1. Premises & Term
   1.1 The Landlord lets the Premises to the Tenant for residence only.
   1.2 The term is ${m} months commencing ${fdate(d.startDate)}.

2. Rent
   2.1 Monthly rent is ${money(d.monthlyRent)}, payable in advance by the ${g(d,"paymentDay")} of each month.

3. Security
   3.1 To secure its obligations the Tenant shall provide: ${g(d,"deposit")}.

4. Use & Maintenance
   4.1 The Tenant shall keep the Premises and pay all running charges (electricity, water, municipal tax, building dues).
   4.2 No alterations shall be made without the Landlord's prior written consent.

5. General
   5.1 A fundamental breach entitles the injured party to every remedy at law.
   5.2 This agreement is governed by Israeli law; jurisdiction lies with the competent courts.

In witness whereof the parties have signed:

___________________            ___________________
Landlord                        Tenant`;}},

{id:"room-sublease",cat:"housing",icon:"home",accent:"g",live:true,
 title:{he:"שכירות חדר / שכירות משנה",en:"Room Rental / Sublease"},
 blurb:{he:"הסכם לשותפים או דייר משנה.",en:"Agreement for roommates or subtenant."},
 fields:[
   F("mainTenant","text","השוכר הראשי","Main tenant",{req:true,half:true}),
   F("subTenant","text","שוכר המשנה / שותף","Subtenant / roommate",{req:true,half:true}),
   F("propertyAddress","text","כתובת הנכס","Property address",{req:true}),
   F("roomDescription","text","החדר / השטח המושכר","Room / space",{req:true}),
   F("rent","number","דמי שכירות חודשיים (₪)","Monthly rent (₪)",{req:true,half:true}),
   F("startDate","date","תחילת שכירות","Start date",{req:true,half:true}),
   F("endDate","date","סיום שכירות","End date",{half:true}),
   F("deposit","text","פיקדון / בטוחה","Deposit / security",{half:true}),
 ],
 gen(d){return LANG==="he"?
`הסכם שכירות חדר / שכירות משנה
נערך ביום ${today()}

בין: ${g(d,"mainTenant")} ("השוכר הראשי")
לבין: ${g(d,"subTenant")} ("שוכר המשנה")

1. הנכס: ${g(d,"propertyAddress")}. החדר/השטח המושכר: ${g(d,"roomDescription")}.
2. תקופה: מיום ${fdate(d.startDate)} ועד ${fdate(d.endDate)}.
3. דמי שכירות: ${money(d.rent)} לחודש, שישולמו מראש בכל חודש.
4. בטוחה: ${g(d,"deposit")}.
5. שימוש: שוכר המשנה ישתמש בחדר למגורים בלבד, ישמור על הנכס ועל הרכוש המשותף, ויישא בחלקו בהוצאות כפי שיוסכם בין הצדדים.
6. הסכמת בעל הנכס: הסכם זה כפוף לכך שאין איסור בחוזה השכירות הראשי ולקבלת הסכמה נדרשת מבעל הנכס, ככל שנדרשת.
7. סיום: כל צד ייתן הודעה מוקדמת של 30 ימים, אלא אם הוסכם אחרת בכתב.

___________________            ___________________
השוכר הראשי                     שוכר המשנה`
:
`Room Rental / Sublease Agreement
Made on ${today()}

Between: ${g(d,"mainTenant")} (the "Main Tenant")
And:     ${g(d,"subTenant")} (the "Subtenant")

1. Property: ${g(d,"propertyAddress")}. Room/space: ${g(d,"roomDescription")}.
2. Term: from ${fdate(d.startDate)} until ${fdate(d.endDate)}.
3. Rent: ${money(d.rent)} per month, payable in advance each month.
4. Security: ${g(d,"deposit")}.
5. Use: the Subtenant shall use the room for residence only, keep the property and shared areas in good condition, and pay their share of expenses as agreed.
6. Landlord consent: this agreement is subject to the main lease not prohibiting it and to any required landlord consent.
7. Termination: either party shall give 30 days' notice unless otherwise agreed in writing.

___________________            ___________________
Main Tenant                     Subtenant`;}},
{id:"lease-termination",cat:"housing",icon:"key",accent:"b",live:true,
 title:{he:"הודעת עזיבה / סיום שכירות",en:"Notice to Vacate"},
 blurb:{he:"הודעה מסודרת על סיום השכירות.",en:"Orderly end-of-tenancy notice."},
 fields:[
   SEL("senderType","מי שולח","Sender",["שוכר","משכיר"],["Tenant","Landlord"],{req:true,half:true}),
   F("senderName","text","שם השולח","Sender name",{req:true,half:true}),
   F("recipientName","text","שם הנמען","Recipient name",{req:true,half:true}),
   F("propertyAddress","text","כתובת הנכס","Property address",{req:true}),
   F("vacateDate","date","מועד פינוי / סיום","Vacate / end date",{req:true,half:true}),
   F("noticeBasis","text","בסיס ההודעה","Basis for notice",{half:true,ph:{he:"לפי החוזה / בהסכמה / בתום התקופה",en:"Lease term / agreement / end of term"}}),
   F("notes","textarea","הערות","Notes"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"recipientName")}
מאת: ${g(d,"senderName")}

הנדון: הודעה על סיום שכירות ופינוי הנכס ברחוב ${g(d,"propertyAddress")}

1. הריני להודיע כי תקופת השכירות בנכס שבנדון תסתיים ביום ${fdate(d.vacateDate)}.
2. בסיס ההודעה: ${g(d,"noticeBasis")}.
3. במועד הסיום יתואם מועד למסירת חזקה, החזרת מפתחות, קריאת מונים ובדיקת מצב הנכס.
4. אבקש להסדיר עד מועד הסיום את כל התשלומים, החשבונות והבטוחות הרלוונטיות.
${d.notes?`\nהערות: ${g(d,"notes")}\n`:""}
בכבוד רב,
${g(d,"senderName")}`
:
`${today()}

To: ${g(d,"recipientName")}
From: ${g(d,"senderName")}

Re: Notice of lease termination and vacating ${g(d,"propertyAddress")}

1. I hereby give notice that the tenancy at the above property will end on ${fdate(d.vacateDate)}.
2. Basis for notice: ${g(d,"noticeBasis")}.
3. At the end date, the parties should coordinate handover, return of keys, meter readings and property inspection.
4. Please arrange all relevant payments, utility accounts and securities by the end date.
${d.notes?`\nNotes: ${g(d,"notes")}\n`:""}
Respectfully,
${g(d,"senderName")}`;}},
{id:"eviction-notice",cat:"housing",icon:"alert",accent:"r",live:true,
 title:{he:"התראת הפרה / פינוי",en:"Breach / Eviction Notice"},
 blurb:{he:"התראת משכיר בגין הפרה.",en:"Landlord notice for breach."},
 fields:[
   F("landlordName","text","שם המשכיר","Landlord name",{req:true,half:true}),
   F("tenantName","text","שם השוכר","Tenant name",{req:true,half:true}),
   F("propertyAddress","text","כתובת הנכס","Property address",{req:true}),
   F("breach","textarea","פירוט ההפרה","The breach",{req:true,ph:{he:"לדוגמה: פיגור בתשלום דמי שכירות לחודשיים",en:"e.g., two months of unpaid rent"}}),
   F("cureDays","number","ימים לתיקון ההפרה","Days to cure",{half:true,ph:{he:"7",en:"7"}}),
 ],
 gen(d){const days=g(d,"cureDays")===BL?"7":g(d,"cureDays");return LANG==="he"?
`${today()}

אל: ${g(d,"tenantName")}
מאת: ${g(d,"landlordName")} (המשכיר)

הנדון: התראה בגין הפרת חוזה שכירות - הנכס ברחוב ${g(d,"propertyAddress")}

1. הנך שוכר/ת ממני את הנכס שבנדון.
2. הפרת את החוזה כדלקמן: ${g(d,"breach")}.
3. הנך נדרש/ת לתקן את ההפרה תוך ${days} ימים ממועד מכתב זה.
4. לא תתוקן ההפרה במועד, אהיה רשאי לבטל את החוזה ולדרוש את פינוי הנכס, וכן לתבוע כל סעד לפי דין, לרבות דמי שכירות, פיצויים והוצאות.
5. אין באמור כדי לגרוע מזכויותיי, וכולן שמורות.

בכבוד רב,
${g(d,"landlordName")}`
:
`${today()}

To: ${g(d,"tenantName")}
From: ${g(d,"landlordName")} (Landlord)

Re: Notice of breach of lease - property at ${g(d,"propertyAddress")}

1. You rent the above property from me.
2. You have breached the lease as follows: ${g(d,"breach")}.
3. You are required to cure the breach within ${days} days of this letter.
4. Failing timely cure, I may terminate the lease and demand that you vacate, and claim every remedy at law, including rent, damages and costs.
5. Nothing herein waives my rights; all are reserved.

Respectfully,
${g(d,"landlordName")}`;}},
{id:"deposit-return",cat:"housing",icon:"coins",accent:"b",live:true,
 title:{he:"דרישת החזר פיקדון / ערבות",en:"Security Deposit Return"},
 blurb:{he:"דרישת השבת בטוחות בתום שכירות.",en:"Demand return of the deposit."},
 fields:[
   F("tenantName","text","שם השוכר","Tenant name",{req:true,half:true}),
   F("landlordName","text","שם המשכיר","Landlord name",{req:true,half:true}),
   F("propertyAddress","text","כתובת הנכס","Property address",{req:true}),
   F("depositAmount","number","סכום הפיקדון/הערבות (₪)","Deposit amount (₪)",{req:true,half:true}),
   F("endDate","date","מועד סיום השכירות","Tenancy end date",{req:true,half:true}),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"landlordName")}
מאת: ${g(d,"tenantName")}

הנדון: דרישה להשבת פיקדון / ערבות בתום תקופת השכירות

1. שכרתי ממך את הנכס ברחוב ${g(d,"propertyAddress")}, ותקופת השכירות הסתיימה ביום ${fdate(d.endDate)}.
2. להבטחת התחייבויותיי הופקדו בידיך בטוחות בסך ${money(d.depositAmount)}.
3. מילאתי את כל חיוביי, פיניתי את הנכס והשבתי אותו במצב תקין, בכפוף לבלאי סביר.
4. אני דורש/ת להשיב לי את מלוא הפיקדון/הערבות בסך ${money(d.depositAmount)} תוך 14 ימים ממועד מכתב זה.
5. ככל שקיימת טענה לניכוי, אבקש לקבלה בכתב בצירוף אסמכתאות. לא יושב הסכום במועד, אשקול פנייה לבית המשפט לתביעות קטנות.

בכבוד רב,
${g(d,"tenantName")}`
:
`${today()}

To: ${g(d,"landlordName")}
From: ${g(d,"tenantName")}

Re: Demand to return the security deposit at end of tenancy

1. I rented from you the property at ${g(d,"propertyAddress")}, and the tenancy ended on ${fdate(d.endDate)}.
2. To secure my obligations, a deposit of ${money(d.depositAmount)} was placed with you.
3. I met all my obligations, vacated the property and returned it in good condition, subject to reasonable wear.
4. I demand the return of the full deposit of ${money(d.depositAmount)} within 14 days of this letter.
5. If you claim any deduction, please provide it in writing with evidence. If not returned in time, I will consider the Small Claims Court.

Respectfully,
${g(d,"tenantName")}`;}},
{id:"construction-defects",cat:"housing",icon:"hammer",accent:"r",live:true,
 title:{he:"דרישה לתיקון ליקויי בנייה",en:"Construction Defects Demand"},
 blurb:{he:"דרישה מקבלן לתיקון ליקויים.",en:"Demand contractor fix defects."},
 fields:[
   F("buyerName","text","שם הרוכש / הדייר","Buyer / resident",{req:true,half:true}),
   F("contractorName","text","שם הקבלן / היזם","Contractor / developer",{req:true,half:true}),
   F("propertyAddress","text","כתובת הדירה / הנכס","Property address",{req:true}),
   F("handoverDate","date","מועד מסירה","Handover date",{half:true}),
   F("defects","textarea","פירוט הליקויים","Defects",{req:true}),
   F("expertReport","text","חוות דעת / דוח מצורף","Expert report",{half:true}),
   F("deadlineDays","number","ימים לתיקון","Days to cure",{half:true,ph:{he:"14",en:"14"}}),
 ],
 gen(d){const days=g(d,"deadlineDays")===BL?"14":g(d,"deadlineDays");return LANG==="he"?
`${today()}

אל: ${g(d,"contractorName")}
מאת: ${g(d,"buyerName")}

הנדון: דרישה לתיקון ליקויי בנייה בנכס ${g(d,"propertyAddress")}

1. הנכס נמסר לי ביום ${fdate(d.handoverDate)}.
2. לאחר המסירה התגלו הליקויים הבאים: ${g(d,"defects")}
3. אסמכתא/חוות דעת: ${g(d,"expertReport")}.
4. בהתאם להתחייבויותיכם ולדין, לרבות הוראות חוק המכר (דירות) ככל שהן חלות, אבקש לתאם תיקון מלא של הליקויים בתוך ${days} ימים.
5. ככל שלא יבוצע תיקון ראוי במועד, אשמור לעצמי את הזכות לפעול לקבלת כל סעד, לרבות תיקון על חשבונכם, פיצוי והוצאות.

בכבוד רב,
${g(d,"buyerName")}`
:
`${today()}

To: ${g(d,"contractorName")}
From: ${g(d,"buyerName")}

Re: Demand to repair construction defects at ${g(d,"propertyAddress")}

1. The property was handed over to me on ${fdate(d.handoverDate)}.
2. The following defects were discovered after handover: ${g(d,"defects")}
3. Supporting report/reference: ${g(d,"expertReport")}.
4. Under your obligations and applicable law, including the Sale (Apartments) Law where applicable, please coordinate full repair within ${days} days.
5. If proper repair is not completed in time, I reserve every remedy, including repair at your expense, compensation and costs.

Respectfully,
${g(d,"buyerName")}`;}},
{id:"commercial-lease",cat:"housing",icon:"build",accent:"n",live:true,
 title:{he:"חוזה שכירות מסחרי",en:"Commercial Lease"},
 blurb:{he:"שכירות לעסק/משרד/חנות.",en:"Lease for business premises."},
 fields:[
   F("landlordName","text","שם המשכיר","Landlord",{req:true,half:true}),
   F("tenantName","text","שם השוכר / עסק","Tenant / business",{req:true,half:true}),
   F("propertyAddress","text","כתובת המושכר","Premises address",{req:true}),
   F("purpose","text","מטרת השכירות","Permitted use",{req:true}),
   F("rent","number","דמי שכירות חודשיים (₪)","Monthly rent (₪)",{req:true,half:true}),
   F("startDate","date","תחילת שכירות","Start date",{req:true,half:true}),
   F("endDate","date","סיום שכירות","End date",{req:true,half:true}),
   F("deposit","text","בטוחות","Security",{half:true}),
 ],
 gen(d){return LANG==="he"?
`חוזה שכירות מסחרי
נערך ביום ${today()}

בין: ${g(d,"landlordName")} ("המשכיר")
לבין: ${g(d,"tenantName")} ("השוכר")

1. המושכר: ${g(d,"propertyAddress")}.
2. מטרת השכירות: ${g(d,"purpose")}. השוכר לא ישנה את מטרת השימוש ללא הסכמה מראש ובכתב.
3. תקופה: מיום ${fdate(d.startDate)} ועד ${fdate(d.endDate)}.
4. דמי שכירות: ${money(d.rent)} לחודש, בתוספת מע״מ ככל שחל, שישולמו מראש.
5. הוצאות: השוכר יישא בארנונה, חשמל, מים, דמי ניהול וכל הוצאה שוטפת הנובעת מהשימוש במושכר.
6. בטוחות: ${g(d,"deposit")}.
7. רישיונות: השוכר אחראי לקבל כל רישיון, היתר או אישור הדרוש להפעלת העסק.
8. הפרה יסודית תזכה את הצד הנפגע בכל סעד לפי דין.

___________________            ___________________
המשכיר                          השוכר`
:
`Commercial Lease Agreement
Made on ${today()}

Between: ${g(d,"landlordName")} (the "Landlord")
And:     ${g(d,"tenantName")} (the "Tenant")

1. Premises: ${g(d,"propertyAddress")}.
2. Permitted use: ${g(d,"purpose")}. The Tenant shall not change use without prior written consent.
3. Term: from ${fdate(d.startDate)} until ${fdate(d.endDate)}.
4. Rent: ${money(d.rent)} per month, plus VAT if applicable, payable in advance.
5. Expenses: the Tenant shall pay municipal tax, electricity, water, management fees and all running expenses arising from use.
6. Security: ${g(d,"deposit")}.
7. Licenses: the Tenant is responsible for obtaining any license, permit or approval required for the business.
8. A material breach entitles the injured party to every remedy at law.

___________________            ___________________
Landlord                        Tenant`;}},
{id:"broker-agreement",cat:"housing",icon:"hand",accent:"n",live:true,
 title:{he:"הסכם תיווך",en:"Brokerage Agreement"},
 blurb:{he:"הזמנת שירותי תיווך ודמי תיווך.",en:"Broker engagement & fees."},
 fields:[
   F("clientName","text","שם הלקוח","Client",{req:true,half:true}),
   F("brokerName","text","שם המתווך","Broker",{req:true,half:true}),
   F("licenseNumber","text","מספר רישיון מתווך","Broker license no.",{half:true}),
   SEL("dealType","סוג עסקה","Transaction",["רכישה","מכירה","שכירות","השכרה"],["Purchase","Sale","Rent","Lease out"],{req:true,half:true}),
   F("property","text","נכס / אזור","Property / area",{req:true}),
   F("fee","text","דמי תיווך","Brokerage fee",{req:true,ph:{he:"לדוגמה: חודש שכירות + מע״מ",en:"e.g., one month rent + VAT"}}),
   F("exclusivity","text","בלעדיות (אם יש)","Exclusivity (if any)",{half:true}),
 ],
 gen(d){return LANG==="he"?
`הזמנת שירותי תיווך במקרקעין
נערכה ביום ${today()}

הלקוח: ${g(d,"clientName")}
המתווך: ${g(d,"brokerName")}, רישיון מס׳ ${g(d,"licenseNumber")}

1. הלקוח מזמין מהמתווך שירותי תיווך לצורך ${g(d,"dealType")} בנכס/אזור: ${g(d,"property")}.
2. דמי התיווך: ${g(d,"fee")}, וישולמו עם התקיימות התנאים המזכים בדמי תיווך לפי דין.
3. בלעדיות: ${g(d,"exclusivity")}.
4. המתווך מצהיר כי הוא בעל רישיון תיווך תקף ככל שנדרש.
5. הלקוח מאשר כי קיבל פרטים מהותיים הידועים למתווך לגבי הנכס, וכי חובתו לבדוק כל היבט משפטי, תכנוני ופיזי לפני התקשרות.

___________________            ___________________
הלקוח                           המתווך`
:
`Real Estate Brokerage Engagement
Made on ${today()}

Client: ${g(d,"clientName")}
Broker: ${g(d,"brokerName")}, license no. ${g(d,"licenseNumber")}

1. The Client engages the Broker for brokerage services for a ${g(d,"dealType")} transaction regarding: ${g(d,"property")}.
2. Brokerage fee: ${g(d,"fee")}, payable when the legal conditions for brokerage fees are met.
3. Exclusivity: ${g(d,"exclusivity")}.
4. The Broker declares that they hold a valid brokerage license where required.
5. The Client confirms receipt of material information known to the Broker and remains responsible for legal, planning and physical due diligence before contracting.

___________________            ___________________
Client                          Broker`;}},

/* ---- FAMILY ---- */
{id:"power-of-attorney",cat:"family",icon:"scroll",accent:"b",live:true,
 title:{he:"ייפוי כוח כללי",en:"General Power of Attorney"},
 blurb:{he:"הסמכת מיופה כוח לפעול בשמך.",en:"Authorize an agent to act for you."},
 fields:[
   F("principalName","text","שם הממנה","Principal name",{req:true,half:true}),
   F("principalId","text","ת.ז. הממנה","Principal ID",{half:true}),
   F("agentName","text","שם מיופה הכוח","Agent name",{req:true,half:true}),
   F("agentId","text","ת.ז. מיופה הכוח","Agent ID",{half:true}),
   F("scope","textarea","היקף ההסמכה","Scope of authority",{req:true,ph:{he:"לדוגמה: ייצוג מול רשויות, פעולות בנקאיות…",en:"e.g., dealing with authorities, banking…"}}),
   F("validUntil","date","בתוקף עד (רשות)","Valid until (optional)"),
 ],
 gen(d){return LANG==="he"?
`ייפוי כוח

אני הח״מ, ${g(d,"principalName")}, ת.ז. ${g(d,"principalId")} ("הממנה"), ממנה בזאת את:
${g(d,"agentName")}, ת.ז. ${g(d,"agentId")} ("מיופה הכוח"),
להיות בא-כוחי ולפעול בשמי ובמקומי בעניינים הבאים:

${g(d,"scope")}

מיופה הכוח מוסמך לחתום על כל מסמך ולבצע כל פעולה הדרושה לשם מימוש ההרשאה דלעיל, וכל פעולותיו יחייבו אותי לכל דבר ועניין.
${d.validUntil?`\nתוקף ייפוי כוח זה עד ליום ${fdate(d.validUntil)}.`:""}

ולראיה באתי על החתום:
${today()}

___________________
${g(d,"principalName")}

אימות: הריני מאשר/ת כי ביום ____ הופיע/ה בפניי הממנה וחתם/ה מרצונו/ה החופשי.
___________________  (עו״ד / נוטריון)`
:
`Power of Attorney

I, the undersigned, ${g(d,"principalName")}, ID ${g(d,"principalId")} (the "Principal"), hereby appoint:
${g(d,"agentName")}, ID ${g(d,"agentId")} (the "Agent"),
to act as my attorney-in-fact in the following matters:

${g(d,"scope")}

The Agent is authorized to sign any document and take any action necessary to give effect to the above authority, and all such acts shall bind me for all purposes.
${d.validUntil?`\nThis power of attorney is valid until ${fdate(d.validUntil)}.`:""}

In witness whereof I have signed:
${today()}

___________________
${g(d,"principalName")}

Attestation: I confirm that on ____ the Principal appeared before me and signed of free will.
___________________  (Attorney / Notary)`;}},

{id:"simple-will",cat:"family",icon:"scroll",accent:"g",live:true,
 title:{he:"צוואה (פשוטה)",en:"Simple Will"},
 blurb:{he:"צוואה ברורה עם יורשים ומנהל עיזבון.",en:"Clear will with heirs and executor."},
 fields:[
   F("testatorName","text","שם המצווה","Testator name",{req:true,half:true}),
   F("testatorId","text","ת.ז. המצווה","Testator ID",{half:true}),
   F("address","text","כתובת","Address"),
   F("beneficiaries","textarea","היורשים והחלוקה","Heirs & distribution",{req:true,ph:{he:"לדוגמה: 50% לבן/בת הזוג, 25% לכל ילד…",en:"e.g., 50% to spouse, 25% to each child…"}}),
   F("executorName","text","מנהל/ת העיזבון","Executor name",{half:true}),
   F("executorId","text","ת.ז. מנהל העיזבון","Executor ID",{half:true}),
   F("specialWishes","textarea","הוראות מיוחדות (רשות)","Special wishes (optional)"),
 ],
 gen(d){return LANG==="he"?
`צ ו ו א ה

אני הח״מ, ${g(d,"testatorName")}, ת.ז. ${g(d,"testatorId")}, מ${g(d,"address")}, בהיותי בדעה צלולה ומיושבת ומרצוני החופשי, ללא כל כפייה, מצווה בזאת מה ייעשה ברכושי לאחר מותי, ומבטל/ת בזה כל צוואה קודמת.

1. חלוקת העיזבון:
${g(d,"beneficiaries")}

2. מינוי מנהל עיזבון:
   הריני ממנה את ${g(d,"executorName")}, ת.ז. ${g(d,"executorId")}, כמנהל/ת העיזבון לביצוע הוראות צוואתי.

${d.specialWishes?`3. הוראות מיוחדות:\n   ${g(d,"specialWishes")}\n`:""}
ולראיה באתי על החתום בנוכחות שני עדים:
${today()}

___________________
${g(d,"testatorName")} (המצווה)

הצהרת עדים: המצווה הצהיר/ה בפנינו כי זו צוואתו/ה וחתם/ה עליה בנוכחותנו, ואנו חתמנו כעדים בנוכחותו/ה ובנוכחות זה את זה:
עד 1 ___________________     עד 2 ___________________`
:
`L A S T   W I L L   A N D   T E S T A M E N T

I, the undersigned, ${g(d,"testatorName")}, ID ${g(d,"testatorId")}, of ${g(d,"address")}, being of sound mind and acting of my own free will without duress, hereby declare how my estate shall be dealt with after my death, and revoke all prior wills.

1. Distribution of the estate:
${g(d,"beneficiaries")}

2. Appointment of executor:
   I appoint ${g(d,"executorName")}, ID ${g(d,"executorId")}, as executor to carry out the provisions of this will.

${d.specialWishes?`3. Special instructions:\n   ${g(d,"specialWishes")}\n`:""}
In witness whereof I sign in the presence of two witnesses:
${today()}

___________________
${g(d,"testatorName")} (Testator)

Witness declaration: The testator declared before us that this is their will and signed it in our presence, and we signed as witnesses in their presence and that of each other:
Witness 1 ___________________   Witness 2 ___________________`;}},

{id:"prenup",cat:"family",icon:"heart",accent:"n",live:true,
 title:{he:"הסכם ממון",en:"Prenuptial / Financial Agreement"},
 blurb:{he:"הסדרת רכוש בין בני זוג.",en:"Property arrangement between partners."},
 fields:[
   F("partyA","text","בן/בת זוג א׳","Partner A",{req:true,half:true}),
   F("partyAId","text","ת.ז. א׳","ID A",{half:true}),
   F("partyB","text","בן/בת זוג ב׳","Partner B",{req:true,half:true}),
   F("partyBId","text","ת.ז. ב׳","ID B",{half:true}),
   SEL("regime","משטר הרכוש","Property regime",["הפרדה מלאה של רכוש","שיתוף בנכסים שנצברו במהלך הקשר","הסדר מעורב"],["Full separation of property","Sharing of assets accrued during the relationship","Mixed arrangement"],{req:true}),
   F("notes","textarea","הוראות מיוחדות","Special provisions",{ph:{he:"לדוגמה: דירה שהובאה לקשר תישאר בבעלות נפרדת",en:"e.g., a home brought in stays separately owned"}}),
 ],
 gen(d){return LANG==="he"?
`הסכם ממון
נערך ונחתם ביום ${today()}

בין: ${g(d,"partyA")}, ת.ז. ${g(d,"partyAId")}
לבין: ${g(d,"partyB")}, ת.ז. ${g(d,"partyBId")}

הואיל והצדדים מבקשים להסדיר את ענייניהם הרכושיים, הוסכם כדלקמן:

1. משטר הרכוש: ${g(d,"regime")}.
2. כל נכס וכל חוב יסווגו בהתאם למשטר שנקבע לעיל.
3. הוראות מיוחדות: ${g(d,"notes")}
4. הסכם זה כפוף לאישור בית המשפט לענייני משפחה או נוטריון כדין, וייכנס לתוקף עם אישורו.
5. על ההסכם יחול הדין הישראלי.

ולראיה באו הצדדים על החתום:

___________________            ___________________
${g(d,"partyA")}                ${g(d,"partyB")}

אישור: ההסכם אושר בפניי לאחר שהוסברה לצדדים משמעותו והם חתמו מרצונם החופשי.
___________________  (שופט/ת לענייני משפחה או נוטריון)`
:
`Financial (Prenuptial) Agreement
Made on ${today()}

Between: ${g(d,"partyA")}, ID ${g(d,"partyAId")}
And:     ${g(d,"partyB")}, ID ${g(d,"partyBId")}

Whereas the parties wish to arrange their financial affairs, it is agreed:

1. Property regime: ${g(d,"regime")}.
2. Every asset and debt shall be classified per the regime above.
3. Special provisions: ${g(d,"notes")}
4. This agreement is subject to approval by the Family Court or a notary as required, and takes effect on approval.
5. Israeli law governs this agreement.

In witness whereof the parties have signed:

___________________            ___________________
${g(d,"partyA")}                ${g(d,"partyB")}

Certification: the agreement was approved before me after its meaning was explained and the parties signed freely.
___________________  (Family Court judge or notary)`;}},
{id:"cohabitation",cat:"family",icon:"users",accent:"n",live:true,
 title:{he:"הסכם ידועים בציבור",en:"Cohabitation Agreement"},
 blurb:{he:"זכויות וחובות לבני זוג ללא נישואין.",en:"Rights for unmarried partners."},
 fields:[
   F("partnerA","text","בן/בת זוג א׳","Partner A",{req:true,half:true}),
   F("partnerB","text","בן/בת זוג ב׳","Partner B",{req:true,half:true}),
   F("startDate","date","תחילת החיים המשותפים","Cohabitation start",{half:true}),
   F("home","text","כתובת מגורים משותפת","Shared home",{half:true}),
   F("propertyTerms","textarea","רכוש והפרדה / שיתוף","Property terms",{req:true}),
   F("expenses","textarea","הוצאות משק בית","Household expenses",{req:true}),
   F("separation","textarea","הסדר בעת פרידה","Separation terms"),
 ],
 gen(d){return LANG==="he"?
`הסכם חיים משותפים / ידועים בציבור
נערך ביום ${today()}

בין: ${g(d,"partnerA")}
לבין: ${g(d,"partnerB")}

1. הצדדים מנהלים או מתכוונים לנהל חיים משותפים החל מיום ${fdate(d.startDate)} בכתובת ${g(d,"home")}.
2. רכוש: ${g(d,"propertyTerms")}
3. הוצאות משק בית: ${g(d,"expenses")}
4. פרידה: ${g(d,"separation")}
5. כל צד מצהיר כי חתם על הסכם זה מרצונו החופשי לאחר שקיבל הזדמנות להתייעץ משפטית.
6. מומלץ לאשר הסכם זה בפני ערכאה מוסמכת או נוטריון לפי הצורך ולפי ייעוץ משפטי פרטני.

___________________            ___________________
${g(d,"partnerA")}              ${g(d,"partnerB")}`
:
`Cohabitation Agreement
Made on ${today()}

Between: ${g(d,"partnerA")}
And:     ${g(d,"partnerB")}

1. The parties live or intend to live together from ${fdate(d.startDate)} at ${g(d,"home")}.
2. Property: ${g(d,"propertyTerms")}
3. Household expenses: ${g(d,"expenses")}
4. Separation: ${g(d,"separation")}
5. Each party declares that they sign freely after having an opportunity to obtain legal advice.
6. It is recommended to approve this agreement before the competent authority or a notary where needed and according to individual legal advice.

___________________            ___________________
${g(d,"partnerA")}              ${g(d,"partnerB")}`;}},
{id:"divorce-settlement",cat:"family",icon:"file",accent:"n",live:true,
 title:{he:"הסכם גירושין",en:"Divorce Settlement"},
 blurb:{he:"הסדר רכוש, מזונות ומשמורת.",en:"Property, support and custody."},
 fields:[
   F("spouseA","text","בן/בת זוג א׳","Spouse A",{req:true,half:true}),
   F("spouseB","text","בן/בת זוג ב׳","Spouse B",{req:true,half:true}),
   F("children","textarea","ילדים משותפים","Children"),
   F("property","textarea","חלוקת רכוש וחובות","Property and debts",{req:true}),
   F("support","textarea","מזונות / השתתפות בהוצאות","Support / expenses",{req:true}),
   F("parenting","textarea","זמני שהות והורות","Parenting time",{req:true}),
   F("approvalCourt","text","ערכאה לאישור","Approving court",{ph:{he:"בית המשפט לענייני משפחה / בית הדין הרבני",en:"Family Court / Rabbinical Court"}}),
 ],
 gen(d){return LANG==="he"?
`טיוטת הסכם גירושין
נערכה ביום ${today()}

בין: ${g(d,"spouseA")}
לבין: ${g(d,"spouseB")}

1. הצדדים מבקשים להסדיר בהסכמה את מכלול העניינים הנובעים מסיום הקשר.
2. ילדים משותפים: ${g(d,"children")}
3. רכוש וחובות: ${g(d,"property")}
4. מזונות והוצאות: ${g(d,"support")}
5. הורות וזמני שהות: ${g(d,"parenting")}
6. הצדדים יפעלו לאישור ההסכם בפני ${g(d,"approvalCourt")}. תוקף סעיפים הטעונים אישור מותנה באישור ערכאה מוסמכת.
7. הצדדים מצהירים כי ההסכם נערך מרצון חופשי, לאחר שניתנה להם הזדמנות לקבל ייעוץ משפטי עצמאי.

___________________            ___________________
${g(d,"spouseA")}               ${g(d,"spouseB")}`
:
`Draft Divorce Settlement
Made on ${today()}

Between: ${g(d,"spouseA")}
And:     ${g(d,"spouseB")}

1. The parties wish to resolve by agreement all matters arising from the end of their relationship.
2. Children: ${g(d,"children")}
3. Property and debts: ${g(d,"property")}
4. Support and expenses: ${g(d,"support")}
5. Parenting and time-sharing: ${g(d,"parenting")}
6. The parties will seek approval before ${g(d,"approvalCourt")}. Clauses requiring approval take effect only upon approval by the competent authority.
7. The parties declare that they enter this agreement freely after having an opportunity to obtain independent legal advice.

___________________            ___________________
${g(d,"spouseA")}               ${g(d,"spouseB")}`;}},
{id:"child-support",cat:"family",icon:"coins",accent:"n",live:true,
 title:{he:"הסדר מזונות ילדים",en:"Child Support Arrangement"},
 blurb:{he:"קביעת מזונות והוצאות.",en:"Set support and expenses."},
 fields:[
   F("parentA","text","הורה א׳","Parent A",{req:true,half:true}),
   F("parentB","text","הורה ב׳","Parent B",{req:true,half:true}),
   F("children","textarea","פרטי הילדים","Children",{req:true}),
   F("monthlySupport","number","סכום חודשי (₪)","Monthly support (₪)",{req:true,half:true}),
   F("paymentDay","number","יום בחודש לתשלום","Payment day",{half:true}),
   F("extraExpenses","textarea","הוצאות חריגות / חינוך / בריאות","Extra expenses",{req:true}),
   F("indexation","text","הצמדה / עדכון","Indexation / update",{half:true}),
 ],
 gen(d){const day=g(d,"paymentDay")===BL?"10":g(d,"paymentDay");return LANG==="he"?
`הסדר מזונות והוצאות ילדים
נערך ביום ${today()}

בין: ${g(d,"parentA")}
לבין: ${g(d,"parentB")}

1. ילדים: ${g(d,"children")}
2. סכום חודשי: ישולם סך של ${money(d.monthlySupport)} לחודש, עד ליום ${day} בכל חודש.
3. הוצאות נוספות: ${g(d,"extraExpenses")}
4. הצמדה ועדכון: ${g(d,"indexation")}
5. כל שינוי מהותי בנסיבות ייבחן בהסכמה או בפני ערכאה מוסמכת.
6. הסדר זה הוא טיוטה ויש לאשרו כחלק מהסכם כולל או בפני ערכאה מוסמכת לפי דין.

___________________            ___________________
${g(d,"parentA")}               ${g(d,"parentB")}`
:
`Child Support and Expenses Arrangement
Made on ${today()}

Between: ${g(d,"parentA")}
And:     ${g(d,"parentB")}

1. Children: ${g(d,"children")}
2. Monthly amount: ${money(d.monthlySupport)} shall be paid each month by day ${day}.
3. Additional expenses: ${g(d,"extraExpenses")}
4. Indexation and updates: ${g(d,"indexation")}
5. Any material change in circumstances shall be addressed by agreement or before the competent authority.
6. This is a draft and should be approved as part of a broader agreement or before the competent authority where required by law.

___________________            ___________________
${g(d,"parentA")}               ${g(d,"parentB")}`;}},
{id:"parenting-plan",cat:"family",icon:"users",accent:"n",live:true,
 title:{he:"הסכם הורות / משמורת",en:"Parenting / Custody Plan"},
 blurb:{he:"חלוקת זמני שהות ואחריות הורית.",en:"Time-sharing and responsibility."},
 fields:[
   F("parentA","text","הורה א׳","Parent A",{req:true,half:true}),
   F("parentB","text","הורה ב׳","Parent B",{req:true,half:true}),
   F("children","textarea","פרטי הילדים","Children",{req:true}),
   F("weeklySchedule","textarea","זמני שהות שבועיים","Weekly schedule",{req:true}),
   F("holidays","textarea","חגים וחופשות","Holidays and vacations",{req:true}),
   F("decisions","textarea","קבלת החלטות","Decision-making",{req:true}),
   F("communication","textarea","תקשורת בין ההורים","Parent communication"),
 ],
 gen(d){return LANG==="he"?
`תכנית הורות וזמני שהות
נערכה ביום ${today()}

בין: ${g(d,"parentA")}
לבין: ${g(d,"parentB")}

1. ילדים: ${g(d,"children")}
2. זמני שהות שבועיים: ${g(d,"weeklySchedule")}
3. חגים וחופשות: ${g(d,"holidays")}
4. קבלת החלטות בענייני חינוך, בריאות ורווחה: ${g(d,"decisions")}
5. תקשורת בין ההורים: ${g(d,"communication")}
6. טובת הילדים תנחה את הצדדים בכל החלטה. כל שינוי מהותי ייעשה בהסכמה בכתב או בהחלטת ערכאה מוסמכת.
7. מומלץ לאשר תכנית זו בפני ערכאה מוסמכת ככל שהיא חלק מהליך משפחתי.

___________________            ___________________
${g(d,"parentA")}               ${g(d,"parentB")}`
:
`Parenting Plan
Made on ${today()}

Between: ${g(d,"parentA")}
And:     ${g(d,"parentB")}

1. Children: ${g(d,"children")}
2. Weekly time-sharing: ${g(d,"weeklySchedule")}
3. Holidays and vacations: ${g(d,"holidays")}
4. Decisions regarding education, health and welfare: ${g(d,"decisions")}
5. Parent communication: ${g(d,"communication")}
6. The children's best interests shall guide every decision. Any material change shall be made by written agreement or competent authority decision.
7. It is recommended to approve this plan before the competent authority where it forms part of a family proceeding.

___________________            ___________________
${g(d,"parentA")}               ${g(d,"parentB")}`;}},
{id:"enduring-poa",cat:"family",icon:"shield",accent:"b",live:true,
 title:{he:"ייפוי כוח מתמשך",en:"Enduring Power of Attorney"},
 blurb:{he:"הסמכה לעתיד למצב של אובדן כשירות.",en:"Future authority if capacity is lost."},
 fields:[
   F("principalName","text","שם הממנה","Principal",{req:true,half:true}),
   F("agentName","text","שם מיופה הכוח","Agent",{req:true,half:true}),
   F("personalMatters","textarea","עניינים אישיים","Personal matters",{req:true}),
   F("propertyMatters","textarea","ענייני רכוש","Property matters",{req:true}),
   F("medicalMatters","textarea","עניינים רפואיים","Medical matters"),
   F("instructions","textarea","הנחיות מקדימות","Advance instructions"),
 ],
 gen(d){return LANG==="he"?
`טיוטת הנחיות לייפוי כוח מתמשך
נערכה ביום ${today()}

ממנה: ${g(d,"principalName")}
מיופה כוח מוצע: ${g(d,"agentName")}

חשוב: ייפוי כוח מתמשך בישראל חייב להיערך ולהיחתם בפני עורך דין שהוסמך לכך, ולהיות מופקד כדין. מסמך זה הוא טיוטת הכנה בלבד.

1. עניינים אישיים: ${g(d,"personalMatters")}
2. ענייני רכוש: ${g(d,"propertyMatters")}
3. עניינים רפואיים: ${g(d,"medicalMatters")}
4. הנחיות מקדימות: ${g(d,"instructions")}
5. אבקש כי מיופה הכוח יפעל בתום לב, בשקיפות, ותוך שמירה על רצוני, כבודי וטובתי.

חתימת הממנה להכנה בלבד: ___________________
${g(d,"principalName")}`
:
`Draft Instructions for an Enduring Power of Attorney
Made on ${today()}

Principal: ${g(d,"principalName")}
Proposed agent: ${g(d,"agentName")}

Important: an enduring power of attorney in Israel must be prepared and signed before a lawyer certified for this purpose and deposited as required by law. This document is only a preparation draft.

1. Personal matters: ${g(d,"personalMatters")}
2. Property matters: ${g(d,"propertyMatters")}
3. Medical matters: ${g(d,"medicalMatters")}
4. Advance instructions: ${g(d,"instructions")}
5. I ask that the agent act in good faith, transparently, and while preserving my wishes, dignity and best interests.

Preparation signature only: ___________________
${g(d,"principalName")}`;}},
{id:"travel-consent",cat:"family",icon:"plane",accent:"g",live:true,
 title:{he:"הסכמת הורה לנסיעת קטין",en:"Parental Travel Consent"},
 blurb:{he:"אישור יציאת קטין לחו״ל.",en:"Consent for a minor to travel."},
 fields:[
   F("parentName","text","שם ההורה המאשר","Consenting parent",{req:true,half:true}),
   F("childName","text","שם הקטין","Minor child",{req:true,half:true}),
   F("childId","text","ת.ז. / דרכון קטין","Child ID / passport",{half:true}),
   F("travelWith","text","נוסע עם","Travelling with",{req:true}),
   F("destination","text","יעד","Destination",{req:true,half:true}),
   F("departDate","date","תאריך יציאה","Departure date",{req:true,half:true}),
   F("returnDate","date","תאריך חזרה","Return date",{req:true,half:true}),
   F("contact","text","טלפון הורה מאשר","Parent contact",{half:true}),
 ],
 gen(d){return LANG==="he"?
`הסכמת הורה לנסיעת קטין לחו״ל

אני, ${g(d,"parentName")}, מאשר/ת בזאת כי הקטין/ה ${g(d,"childName")}, ת.ז./דרכון ${g(d,"childId")}, רשאי/ת לצאת מישראל ולנסוע אל ${g(d,"destination")} יחד עם ${g(d,"travelWith")}.

תקופת הנסיעה: מיום ${fdate(d.departDate)} ועד יום ${fdate(d.returnDate)}.
פרטי קשר של ההורה המאשר: ${g(d,"contact")}.

הסכמה זו ניתנת מרצוני החופשי. מומלץ לאמת חתימה בפני עורך דין או נוטריון, במיוחד כאשר הדבר נדרש על ידי חברת תעופה או רשות גבול.

תאריך: ${today()}
חתימה: ___________________
${g(d,"parentName")}`
:
`Parental Consent for Minor Travel Abroad

I, ${g(d,"parentName")}, hereby consent that the minor ${g(d,"childName")}, ID/passport ${g(d,"childId")}, may leave Israel and travel to ${g(d,"destination")} with ${g(d,"travelWith")}.

Travel period: from ${fdate(d.departDate)} until ${fdate(d.returnDate)}.
Consenting parent contact: ${g(d,"contact")}.

This consent is given freely. Signature verification by a lawyer or notary is recommended, especially where required by an airline or border authority.

Date: ${today()}
Signature: ___________________
${g(d,"parentName")}`;}},

/* ---- VEHICLE ---- */
{id:"vehicle-sale",cat:"vehicle",icon:"car",accent:"g",live:true,
 title:{he:"זיכרון דברים - מכר רכב",en:"Vehicle Sale Agreement"},
 blurb:{he:"חוזה מכר רכב בין מוכר לקונה.",en:"Car sale contract between seller and buyer."},
 fields:[
   F("sellerName","text","שם המוכר","Seller name",{req:true,half:true}),
   F("sellerId","text","ת.ז. המוכר","Seller ID",{half:true}),
   F("buyerName","text","שם הקונה","Buyer name",{req:true,half:true}),
   F("buyerId","text","ת.ז. הקונה","Buyer ID",{half:true}),
   F("make","text","יצרן ודגם","Make & model",{half:true}),
   F("vehicleNumber","text","מספר רכב","Vehicle no.",{req:true,half:true}),
   F("year","number","שנת ייצור","Year",{half:true}),
   F("km","number","קילומטראז׳","Mileage (km)",{half:true}),
   F("price","number","מחיר מוסכם (₪)","Agreed price (₪)",{req:true}),
 ],
 gen(d){return LANG==="he"?
`זיכרון דברים - מכירת רכב
נערך ביום ${today()}

המוכר: ${g(d,"sellerName")}, ת.ז. ${g(d,"sellerId")}
הקונה: ${g(d,"buyerName")}, ת.ז. ${g(d,"buyerId")}

1. המוכר מוכר לקונה את הרכב מסוג ${g(d,"make")}, מספר רישוי ${g(d,"vehicleNumber")}, שנת ${g(d,"year")}, שקרא ${g(d,"km")} ק״מ ("הרכב").
2. התמורה המוסכמת היא ${money(d.price)}, שתשולם במעמד העברת הבעלות.
3. המוכר מצהיר כי הרכב בבעלותו, נקי מכל חוב, שעבוד או עיקול, וכי לא ידוע לו על פגם נסתר מהותי.
4. הקונה בדק/ה את הרכב ומצא/ה אותו מתאים לצרכיו/ה, ומקבל/ת אותו במצבו ("AS-IS"), למעט מצגי המוכר לעיל.
5. הצדדים יחתמו על העברת הבעלות במשרד הרישוי במעמד התשלום.

ולראיה באו הצדדים על החתום:

___________________            ___________________
המוכר                          הקונה`
:
`Vehicle Sale Agreement
Made on ${today()}

Seller: ${g(d,"sellerName")}, ID ${g(d,"sellerId")}
Buyer:  ${g(d,"buyerName")}, ID ${g(d,"buyerId")}

1. The Seller sells to the Buyer the vehicle ${g(d,"make")}, registration ${g(d,"vehicleNumber")}, year ${g(d,"year")}, reading ${g(d,"km")} km (the "Vehicle").
2. The agreed price is ${money(d.price)}, payable upon transfer of ownership.
3. The Seller declares the Vehicle is owned by them, free of any debt, lien or attachment, and that they are unaware of any material hidden defect.
4. The Buyer has inspected the Vehicle, found it suitable, and accepts it "AS-IS", save for the Seller's representations above.
5. The parties shall sign the ownership transfer at the licensing office upon payment.

In witness whereof the parties have signed:

___________________            ___________________
Seller                          Buyer`;}},

{id:"bill-of-sale",cat:"vehicle",icon:"doc",accent:"g",live:true,
 title:{he:"חוזה מכר מיטלטלין",en:"Bill of Sale (Goods)"},
 blurb:{he:"מכירת חפץ/ציוד בין פרטיים.",en:"Sale of goods between individuals."},
 fields:[
   F("sellerName","text","שם המוכר","Seller name",{req:true,half:true}),
   F("buyerName","text","שם הקונה","Buyer name",{req:true,half:true}),
   F("item","text","הפריט הנמכר","Item sold",{req:true}),
   F("itemDetails","textarea","תיאור ומצב הפריט","Description and condition"),
   F("price","number","מחיר מוסכם (₪)","Agreed price (₪)",{req:true,half:true}),
   F("date","date","תאריך המכירה","Sale date",{half:true}),
 ],
 gen(d){return LANG==="he"?
`חוזה מכר מיטלטלין
נערך ביום ${g(d,"date")===BL?today():fdate(d.date)}

המוכר: ${g(d,"sellerName")}
הקונה: ${g(d,"buyerName")}

1. המוכר מוכר לקונה את הפריט: ${g(d,"item")}.
2. תיאור ומצב: ${g(d,"itemDetails")}
3. התמורה המוסכמת היא ${money(d.price)}, שתשולם במעמד מסירת הפריט.
4. המוכר מצהיר כי הפריט בבעלותו, נקי מכל חוב או שעבוד, וכי אין לו ידיעה על פגם נסתר מהותי.
5. הקונה בדק/ה את הפריט ומקבל/ת אותו במצבו ("AS-IS"), למעט מצגי המוכר לעיל.
6. הבעלות בפריט תעבור לקונה עם השלמת התשלום והמסירה.

ולראיה באו הצדדים על החתום:

___________________            ___________________
המוכר                          הקונה`
:
`Bill of Sale (Goods)
Made on ${g(d,"date")===BL?today():fdate(d.date)}

Seller: ${g(d,"sellerName")}
Buyer:  ${g(d,"buyerName")}

1. The Seller sells to the Buyer the item: ${g(d,"item")}.
2. Description and condition: ${g(d,"itemDetails")}
3. The agreed price is ${money(d.price)}, payable upon delivery of the item.
4. The Seller declares the item is owned by them, free of any debt or lien, and that they are unaware of any material hidden defect.
5. The Buyer has inspected the item and accepts it "AS-IS", save for the Seller's representations above.
6. Title passes to the Buyer upon full payment and delivery.

In witness whereof the parties have signed:

___________________            ___________________
Seller                          Buyer`;}},
{id:"accident-demand",cat:"vehicle",icon:"alert",accent:"r",live:true,
 title:{he:"דרישת פיצוי תאונת רכב",en:"Vehicle Accident Demand"},
 blurb:{he:"דרישת פיצוי לנזקי רכוש/גוף.",en:"Demand for accident damages."},
 fields:[
   F("claimantName","text","שם הנפגע / דורש","Claimant",{req:true,half:true}),
   F("recipientName","text","שם הנהג / מבטח","Driver / insurer",{req:true,half:true}),
   F("accidentDate","date","תאריך התאונה","Accident date",{req:true,half:true}),
   F("location","text","מקום התאונה","Location",{req:true,half:true}),
   F("vehicleDetails","text","פרטי רכב הנפגע","Claimant vehicle",{req:true}),
   F("damageAmount","number","סכום נזק (₪)","Damage amount (₪)",{half:true}),
   F("facts","textarea","תיאור התאונה","Accident description",{req:true}),
   F("evidence","textarea","ראיות מצורפות","Evidence"),
 ],
 gen(d){return LANG==="he"?
`${today()}

אל: ${g(d,"recipientName")}
מאת: ${g(d,"claimantName")}

הנדון: דרישת פיצוי בגין תאונת רכב מיום ${fdate(d.accidentDate)}

1. ביום ${fdate(d.accidentDate)} אירעה תאונת רכב ב-${g(d,"location")}.
2. פרטי רכבי: ${g(d,"vehicleDetails")}.
3. נסיבות התאונה: ${g(d,"facts")}
4. כתוצאה מהתאונה נגרם לי נזק${d.damageAmount?` בסך ${money(d.damageAmount)}`:""}, בצירוף הוצאות נלוות ככל שיוכחו.
5. ראיות ואסמכתאות: ${g(d,"evidence")}
6. אבקש לשלם את סכום הנזק בתוך 14 ימים, או להעביר את פרטי המבטח המטפל. כל זכויותיי שמורות.

בכבוד רב,
${g(d,"claimantName")}`
:
`${today()}

To: ${g(d,"recipientName")}
From: ${g(d,"claimantName")}

Re: Compensation demand for vehicle accident on ${fdate(d.accidentDate)}

1. On ${fdate(d.accidentDate)} a vehicle accident occurred at ${g(d,"location")}.
2. My vehicle details: ${g(d,"vehicleDetails")}.
3. Circumstances: ${g(d,"facts")}
4. As a result, I suffered damage${d.damageAmount?` in the amount of ${money(d.damageAmount)}`:""}, plus related expenses as proven.
5. Evidence and supporting documents: ${g(d,"evidence")}
6. Please pay the damage amount within 14 days or provide the handling insurer details. All rights reserved.

Respectfully,
${g(d,"claimantName")}`;}},

/* ---- BUSINESS ---- */
{id:"nda",cat:"business",icon:"shield",accent:"g",live:true,
 title:{he:"הסכם סודיות (NDA)",en:"Non-Disclosure Agreement (NDA)"},
 blurb:{he:"הגנה על מידע סודי בין צדדים.",en:"Protect confidential information."},
 fields:[
   F("partyA","text","צד א׳ (מגלה)","Party A (discloser)",{req:true,half:true}),
   F("partyB","text","צד ב׳ (מקבל)","Party B (recipient)",{req:true,half:true}),
   SEL("mutual","סוג ההסכם","Type",["דו-צדדי (הדדי)","חד-צדדי"],["Mutual","One-way"],{half:true}),
   F("termYears","number","תקופת הסודיות (שנים)","Confidentiality term (yrs)",{half:true,ph:{he:"3",en:"3"}}),
   F("purpose","textarea","מטרת הגילוי","Purpose of disclosure",{req:true,ph:{he:"לדוגמה: בחינת שיתוף פעולה עסקי",en:"e.g., evaluating a business collaboration"}}),
 ],
 gen(d){const y=g(d,"termYears")===BL?"3":g(d,"termYears");return LANG==="he"?
`הסכם שמירה על סודיות (NDA)
נערך ביום ${today()}

בין: ${g(d,"partyA")} לבין: ${g(d,"partyB")} ("הצדדים").
סוג ההסכם: ${g(d,"mutual")}.

1. מטרה: ${g(d,"purpose")}.
2. "מידע סודי" - כל מידע, בכתב או בע״פ, שנמסר בין הצדדים בקשר למטרה, למעט מידע שהוא נחלת הכלל שלא עקב הפרה.
3. הצד המקבל ישמור על המידע בסודיות מוחלטת, ישתמש בו אך ורק למטרה, ולא יגלה אותו לצד שלישי ללא הסכמה מראש ובכתב.
4. חובת הסודיות תעמוד בתוקפה ${y} שנים ממועד הגילוי.
5. הפרת הסכם זה תזכה את הצד הנפגע בכל סעד שבדין, לרבות צו מניעה.
6. על הסכם זה יחול הדין הישראלי.

___________________            ___________________
${g(d,"partyA")}                ${g(d,"partyB")}`
:
`Non-Disclosure Agreement (NDA)
Made on ${today()}

Between: ${g(d,"partyA")} and: ${g(d,"partyB")} (the "Parties").
Type: ${g(d,"mutual")}.

1. Purpose: ${g(d,"purpose")}.
2. "Confidential Information" means any information, written or oral, exchanged in connection with the Purpose, except information that is public other than through breach.
3. The receiving party shall keep the information strictly confidential, use it solely for the Purpose, and not disclose it to any third party without prior written consent.
4. The confidentiality obligation shall remain in force for ${y} years from disclosure.
5. Breach entitles the injured party to every remedy at law, including injunctive relief.
6. This agreement is governed by Israeli law.

___________________            ___________________
${g(d,"partyA")}                ${g(d,"partyB")}`;}},

{id:"freelance-agreement",cat:"business",icon:"file",accent:"b",live:true,
 title:{he:"הסכם פרילנסר / נותן שירות",en:"Freelance / Service Agreement"},
 blurb:{he:"היקף, תמורה, לוחות זמנים וקניין רוחני.",en:"Scope, fees, timeline and IP."},
 fields:[
   F("clientName","text","שם הלקוח","Client name",{req:true,half:true}),
   F("contractorName","text","שם נותן השירות","Contractor name",{req:true,half:true}),
   F("services","textarea","תיאור השירותים","Description of services",{req:true}),
   F("fee","number","תמורה (₪)","Fee (₪)",{req:true,half:true}),
   F("paymentTerms","text","תנאי תשלום","Payment terms",{half:true,ph:{he:"שוטף+30",en:"Net 30"}}),
   F("startDate","date","תאריך התחלה","Start date",{half:true}),
   SEL("ipOwner","בעלות בתוצרי העבודה","IP ownership",["הלקוח","נותן השירות"],["Client","Contractor"],{half:true}),
 ],
 gen(d){return LANG==="he"?
`הסכם למתן שירותים
נערך ביום ${today()}

בין: ${g(d,"clientName")} ("הלקוח")
לבין: ${g(d,"contractorName")} ("נותן השירות"), כעצמאי/ת.

1. השירותים: ${g(d,"services")}.
2. תקופה: השירותים יחלו ביום ${fdate(d.startDate)}.
3. תמורה: ${money(d.fee)}, בתנאי תשלום ${g(d,"paymentTerms")}, כנגד חשבונית כדין.
4. מעמד: נותן השירות הוא קבלן עצמאי, ואין ביחסי הצדדים יחסי עובד-מעביד.
5. קניין רוחני: זכויות הקניין הרוחני בתוצרי העבודה יהיו של ${g(d,"ipOwner")}, עם השלמת התשלום.
6. סודיות: כל צד ישמור על מידע סודי של משנהו.
7. סיום: כל צד רשאי לסיים בהודעה מוקדמת של 14 יום בכתב; ישולם עבור עבודה שבוצעה.
8. דין: הדין הישראלי יחול על הסכם זה.

___________________            ___________________
${g(d,"clientName")}            ${g(d,"contractorName")}`
:
`Service Agreement
Made on ${today()}

Between: ${g(d,"clientName")} (the "Client")
And:     ${g(d,"contractorName")} (the "Contractor"), as an independent contractor.

1. Services: ${g(d,"services")}.
2. Term: services commence on ${fdate(d.startDate)}.
3. Fee: ${money(d.fee)}, on ${g(d,"paymentTerms")} terms, against a lawful invoice.
4. Status: the Contractor is an independent contractor; nothing creates an employer-employee relationship.
5. IP: intellectual-property rights in the work product shall belong to the ${g(d,"ipOwner")} upon full payment.
6. Confidentiality: each party shall protect the other's confidential information.
7. Termination: either party may terminate on 14 days' written notice; work performed shall be paid.
8. Governing law: Israeli law applies.

___________________            ___________________
${g(d,"clientName")}            ${g(d,"contractorName")}`;}},

{id:"cease-desist",cat:"business",icon:"alert",accent:"r",live:true,
 title:{he:"מכתב הפסקת הפרה (Cease & Desist)",en:"Cease & Desist Letter"},
 blurb:{he:"דרישה להפסיק הפרת זכויות/לשון הרע/הטרדה.",en:"Demand to stop infringement/defamation/harassment."},
 fields:[
   F("senderName","text","שם השולח","Your name",{req:true,half:true}),
   F("recipientName","text","שם הנמען","Recipient name",{req:true,half:true}),
   F("recipientAddress","text","כתובת הנמען","Recipient address"),
   SEL("violationType","סוג ההפרה","Type of violation",
     ["הפרת זכויות יוצרים","לשון הרע / פגיעה בשם הטוב","הטרדה","הפרת סימן מסחר","הפרת סוד מסחרי"],
     ["Copyright infringement","Defamation","Harassment","Trademark infringement","Trade-secret breach"],{req:true}),
   F("description","textarea","תיאור ההפרה","Description of the violation",{req:true}),
   F("deadlineDays","number","ימים להפסקה","Days to comply",{ph:{he:"7",en:"7"}}),
 ],
 gen(d){const days=g(d,"deadlineDays")===BL?"7":g(d,"deadlineDays");return LANG==="he"?
`${today()}

אל: ${g(d,"recipientName")}
${g(d,"recipientAddress")}

הנדון: דרישה להפסקה מיידית - ${g(d,"violationType")}

1.  הובא לידיעתי כי הנך מבצע/ת את הפעולות הבאות: ${g(d,"description")}.
2.  מעשים אלו מהווים ${g(d,"violationType")} ופגיעה בזכויותיי המוגנות על פי דין.
3.  הנך נדרש/ת לחדול לאלתר מההפרה, להסיר כל תוכן מפר ולהימנע מהישנותה, וזאת תוך ${days} ימים ממועד מכתב זה.
4.  כן הנך נדרש/ת לאשר בכתב כי ההפרה הופסקה.
5.  לא תיענה הדרישה - אפעל בכל דרך חוקית, לרבות תביעה לפיצוי ולצו מניעה, ללא התראה נוספת. כל זכויותיי שמורות.

בכבוד רב,
${g(d,"senderName")}`
:
`${today()}

To: ${g(d,"recipientName")}
${g(d,"recipientAddress")}

Re: Demand to Cease and Desist - ${g(d,"violationType")}

1.  It has come to my attention that you are engaging in the following: ${g(d,"description")}.
2.  These acts constitute ${g(d,"violationType")} and infringe my rights protected by law.
3.  You are required to cease the infringement immediately, remove all infringing content, and refrain from any recurrence, within ${days} days of this letter.
4.  You are further required to confirm in writing that the infringement has stopped.
5.  Failing compliance, I will pursue every lawful remedy, including a claim for damages and an injunction, without further notice. All rights reserved.

Respectfully,
${g(d,"senderName")}`;}},

{id:"service-quote",cat:"business",icon:"doc",accent:"n",live:true,
 title:{he:"הצעת מחיר / הסכם שירות",en:"Quote / Service Proposal"},
 blurb:{he:"הצעה מסחרית מחייבת ללקוח.",en:"Binding commercial proposal."},
 fields:[
   F("providerName","text","שם נותן השירות","Provider",{req:true,half:true}),
   F("clientName","text","שם הלקוח","Client",{req:true,half:true}),
   F("services","textarea","פירוט שירותים","Services",{req:true}),
   F("price","number","מחיר (₪)","Price (₪)",{req:true,half:true}),
   F("validUntil","date","תוקף ההצעה","Valid until",{half:true}),
   F("paymentTerms","text","תנאי תשלום","Payment terms",{half:true}),
   F("timeline","text","לוחות זמנים","Timeline",{half:true}),
 ],
 gen(d){return LANG==="he"?
`הצעת מחיר / הסכם שירות
תאריך: ${today()}

מאת: ${g(d,"providerName")}
לכבוד: ${g(d,"clientName")}

1. השירותים: ${g(d,"services")}
2. מחיר: ${money(d.price)}, בתוספת מע״מ ככל שחל.
3. תנאי תשלום: ${g(d,"paymentTerms")}.
4. לוחות זמנים: ${g(d,"timeline")}.
5. תוקף ההצעה: עד ${fdate(d.validUntil)}.
6. אישור בכתב או תחילת עבודה לפי בקשת הלקוח יהוו קבלת ההצעה והתחייבות לתשלום.
7. שינויים בהיקף השירותים יחייבו אישור ותמחור נפרד.

חתימת לקוח לאישור: ___________________
${g(d,"clientName")}`
:
`Quote / Service Proposal
Date: ${today()}

From: ${g(d,"providerName")}
To:   ${g(d,"clientName")}

1. Services: ${g(d,"services")}
2. Price: ${money(d.price)}, plus VAT if applicable.
3. Payment terms: ${g(d,"paymentTerms")}.
4. Timeline: ${g(d,"timeline")}.
5. Valid until: ${fdate(d.validUntil)}.
6. Written approval or commencement of work at the client's request constitutes acceptance and obligation to pay.
7. Changes in scope require separate approval and pricing.

Client approval signature: ___________________
${g(d,"clientName")}`;}},
{id:"company-registration",cat:"business",icon:"build",accent:"b",live:true,
 title:{he:"רישום חברה / עוסק - מדריך",en:"Company / Sole-Trader Registration"},
 blurb:{he:"צ׳קליסט ומסמכים לפתיחת עסק.",en:"Checklist & docs to open a business."},
 fields:[
   SEL("entityType","סוג התאגדות","Entity type",["עוסק פטור","עוסק מורשה","חברה בע״מ","שותפות"],["Exempt sole trader","Licensed sole trader","Limited company","Partnership"],{req:true}),
   F("businessName","text","שם עסק מוצע","Proposed business name",{req:true}),
   F("ownerNames","textarea","בעלים / בעלי מניות","Owners / shareholders",{req:true}),
   F("activity","textarea","תחום פעילות","Business activity",{req:true}),
   F("address","text","כתובת עסק","Business address",{req:true}),
   F("notes","textarea","הערות / רישיונות מיוחדים","Notes / special licenses"),
 ],
 gen(d){return LANG==="he"?
`צ׳קליסט פתיחת עסק ורישום
תאריך: ${today()}

סוג התאגדות: ${g(d,"entityType")}
שם עסק מוצע: ${g(d,"businessName")}
בעלים / בעלי מניות: ${g(d,"ownerNames")}
כתובת: ${g(d,"address")}

1. תיאור פעילות: ${g(d,"activity")}
2. פעולות ראשונות:
   א. בדיקת שם עסק/חברה וזמינותו.
   ב. פתיחת תיק במס הכנסה, מע״מ וביטוח לאומי לפי סוג ההתאגדות.
   ג. הכנת מסמכי יסוד: תקנון/הסכם מייסדים/הסכם שותפות לפי הצורך.
   ד. בדיקת צורך ברישיון עסק, היתר מקצועי, ביטוח ואישורי רגולציה.
   ה. פתיחת חשבון בנק עסקי והסדרת הנהלת חשבונות.
3. הערות מיוחדות: ${g(d,"notes")}

מסמך זה הוא צ׳קליסט הכנה ואינו מחליף ייעוץ מס, חשבונאות או ייעוץ משפטי פרטני.`
:
`Business Registration Checklist
Date: ${today()}

Entity type: ${g(d,"entityType")}
Proposed business name: ${g(d,"businessName")}
Owners / shareholders: ${g(d,"ownerNames")}
Address: ${g(d,"address")}

1. Business activity: ${g(d,"activity")}
2. First actions:
   a. Check business/company name availability.
   b. Open tax, VAT and National Insurance files according to entity type.
   c. Prepare foundation documents: articles, founders agreement or partnership agreement as needed.
   d. Check need for business license, professional permit, insurance and regulatory approvals.
   e. Open a business bank account and arrange bookkeeping.
3. Special notes: ${g(d,"notes")}

This is a preparation checklist and does not replace tax, accounting or individual legal advice.`;}},
{id:"partnership-agreement",cat:"business",icon:"hand",accent:"n",live:true,
 title:{he:"הסכם שותפות",en:"Partnership Agreement"},
 blurb:{he:"חלוקת אחזקות, רווחים וניהול.",en:"Shares, profits and management."},
 fields:[
   F("partnerA","text","שותף א׳","Partner A",{req:true,half:true}),
   F("partnerB","text","שותף ב׳","Partner B",{req:true,half:true}),
   F("businessName","text","שם פעילות / שותפות","Business / partnership name",{req:true}),
   F("purpose","textarea","מטרת השותפות","Purpose",{req:true}),
   F("shares","textarea","אחוזים / תרומות","Shares / contributions",{req:true}),
   F("management","textarea","ניהול וקבלת החלטות","Management and decisions",{req:true}),
   F("exitTerms","textarea","פרישה / פירוק","Exit / dissolution"),
 ],
 gen(d){return LANG==="he"?
`הסכם שותפות
נערך ביום ${today()}

בין: ${g(d,"partnerA")}
לבין: ${g(d,"partnerB")}

1. שם ומטרה: הצדדים מקימים פעילות/שותפות בשם ${g(d,"businessName")} לצורך: ${g(d,"purpose")}
2. תרומות וזכויות: ${g(d,"shares")}
3. ניהול וקבלת החלטות: ${g(d,"management")}
4. רווחים והפסדים יחולקו בהתאם לאחוזים או להסכמות שנקבעו בסעיף התרומות והזכויות, אלא אם הוסכם אחרת בכתב.
5. סודיות ואי עקיפה: הצדדים ישמרו על מידע עסקי של השותפות ולא יעקפו הזדמנויות עסקיות שלה.
6. פרישה או פירוק: ${g(d,"exitTerms")}
7. הדין הישראלי יחול על הסכם זה.

___________________            ___________________
${g(d,"partnerA")}              ${g(d,"partnerB")}`
:
`Partnership Agreement
Made on ${today()}

Between: ${g(d,"partnerA")}
And:     ${g(d,"partnerB")}

1. Name and purpose: the parties establish a business/partnership named ${g(d,"businessName")} for: ${g(d,"purpose")}
2. Contributions and rights: ${g(d,"shares")}
3. Management and decisions: ${g(d,"management")}
4. Profits and losses shall be shared according to the percentages or arrangements stated above unless otherwise agreed in writing.
5. Confidentiality and non-circumvention: the parties shall protect partnership business information and not bypass its opportunities.
6. Exit or dissolution: ${g(d,"exitTerms")}
7. Israeli law applies.

___________________            ___________________
${g(d,"partnerA")}              ${g(d,"partnerB")}`;}},
{id:"website-terms",cat:"business",icon:"globe",accent:"n",live:true,
 title:{he:"תקנון ומדיניות פרטיות",en:"Website Terms & Privacy Policy"},
 blurb:{he:"תנאי שימוש ופרטיות לאתר.",en:"Terms of use & privacy for a site."},
 fields:[
   F("siteName","text","שם האתר / אפליקציה","Site / app name",{req:true,half:true}),
   F("operatorName","text","מפעיל האתר","Operator",{req:true,half:true}),
   F("siteUrl","text","כתובת האתר","Site URL",{half:true}),
   F("services","textarea","שירותים באתר","Services",{req:true}),
   F("dataCollected","textarea","מידע שנאסף","Data collected",{req:true}),
   F("contactEmail","text","אימייל לפניות פרטיות","Privacy contact",{req:true}),
 ],
 gen(d){return LANG==="he"?
`תקנון שימוש ומדיניות פרטיות
עודכן ביום ${today()}

אתר: ${g(d,"siteName")} (${g(d,"siteUrl")})
מפעיל: ${g(d,"operatorName")}

1. השירותים: האתר מספק את השירותים הבאים: ${g(d,"services")}
2. שימוש באתר כפוף לתקנון זה. אין להשתמש באתר למטרה בלתי חוקית, פוגענית או המטעה צדדים שלישיים.
3. המידע באתר ניתן כשירות כללי ואינו מהווה ייעוץ מקצועי פרטני, אלא אם צוין אחרת במפורש.
4. פרטיות: במסגרת השימוש באתר עשוי להיאסף המידע הבא: ${g(d,"dataCollected")}
5. מטרות שימוש במידע: מתן שירות, תמיכה, אבטחה, שיפור האתר, עמידה בחובות דין ופנייה למשתמש לפי הצורך.
6. העברת מידע לצדדים שלישיים תיעשה רק לפי דין, לצורך הפעלת האתר, או לפי הסכמת המשתמש.
7. משתמש רשאי לפנות לבקשות עיון, תיקון או מחיקה בהתאם לדין בכתובת: ${g(d,"contactEmail")}
8. מפעיל האתר רשאי לעדכן תקנון זה מעת לעת.

מסמך זה הוא טיוטה ויש להתאימו פרטנית לסוג האתר, לקהל היעד ולדרישות הדין החלות.`
:
`Website Terms of Use and Privacy Policy
Updated on ${today()}

Site: ${g(d,"siteName")} (${g(d,"siteUrl")})
Operator: ${g(d,"operatorName")}

1. Services: the site provides the following services: ${g(d,"services")}
2. Use of the site is subject to these terms. The site may not be used for unlawful, harmful or misleading purposes.
3. Site information is general and does not constitute individualized professional advice unless expressly stated.
4. Privacy: the following data may be collected during use: ${g(d,"dataCollected")}
5. Purposes: service delivery, support, security, site improvement, legal compliance and user communications where needed.
6. Data may be shared with third parties only as required by law, for site operation, or with user consent.
7. Users may contact the operator regarding access, correction or deletion requests according to law at: ${g(d,"contactEmail")}
8. The operator may update these terms from time to time.

This is a draft and must be tailored to the specific site, audience and applicable legal requirements.`;}},
{id:"hearing-simulation",cat:"court",icon:"gavel",accent:"r",live:true,
 title:{he:"סימולציית דיון משפטי",en:"Court Hearing Simulation"},
 blurb:{he:"תרגול לקראת דיון: שאלות צפויות, טיעוני הצד השני ונקודות לחיזוק.",en:"Hearing prep: expected questions, opposing arguments, points to strengthen."},
 fields:[
   SEL("caseArea","תחום התיק","Case area",["משפחה וגירושין","פלילי ותעבורה","מקרקעין ונדל\"ן","עבודה","נזיקין וביטוח לאומי","חוזים וכספים","אחר"],["Family & divorce","Criminal & traffic","Real estate","Labor","Torts & national insurance","Contracts & money","Other"],{req:true}),
   SEL("myRole","התפקיד שלכם בדיון","Your role in the hearing",
     ["תובע/ת","נתבע/ת","חשוד/ה או נאשם/ת","עד/ה","מבקש/ת בהליך אזרחי"],
     ["Plaintiff","Defendant","Suspect / accused","Witness","Applicant in a civil proceeding"],{req:true}),
   F("caseFacts","textarea","מה קרה? תארו את המקרה בקצרה","What happened? Describe the case briefly",{req:true,ph:{he:"האירועים המרכזיים, תאריכים, מי מעורב…",en:"Key events, dates, who is involved…"}}),
   F("myGoal","text","מה הייתם רוצים להשיג בדיון","What outcome do you want",{req:true,half:true}),
   F("hearingDate","date","מועד הדיון (אם ידוע)","Hearing date (if known)",{half:true}),
   F("evidence","textarea","ראיות ומסמכים שיש בידיכם","Evidence and documents you have",{ph:{he:"חוזה, הודעות, תמונות, חוות דעת…",en:"Contract, messages, photos, expert opinions…"}}),
 ],
 gen(d){return LANG==="he"?
`סימולציית הכנה לדיון משפטי
הוכן ביום ${today()}${d.hearingDate?" · מועד הדיון: "+fdate(d.hearingDate):""}

תחום: ${g(d,"caseArea")} · תפקיד: ${g(d,"myRole")}

1. תמצית המקרה
${g(d,"caseFacts")}

2. המטרה שלכם בדיון
${g(d,"myGoal")}

3. שאלות שסביר שתישאלו
- תארו במילים שלכם, לפי סדר זמנים, מה בדיוק קרה.
- אילו מסמכים או ראיות תומכים בגרסה שלכם?
- האם פניתם לצד השני לפני ההליך? מה הוצע ומה נענה?
- מה הנזק או הפגיעה שנגרמו לכם בפועל?

4. טיעונים שהצד השני עשוי להעלות
- גרסה עובדתית שונה לאירועים המרכזיים.
- טענות לגבי חסר במסמכים, במועדים או בראיות.
- הצעת פשרה או הקטנת אחריות.

5. ראיות ומסמכים שבידיכם
${g(d,"evidence")}

6. רשימת הכנה לפני הדיון
- סדרו את המסמכים לפי סדר כרונולוגי ותייקו עותקים.
- הכינו תשובה של עד דקה לשאלה "מה קרה" בלי להתפזר.
- כתבו מראש את שלוש הנקודות החשובות ביותר מבחינתכם.
- דייקו בעובדות: אמירה לא מדויקת אחת פוגעת באמינות כולה.

סימולציה זו היא כלי תרגול והכנה בלבד. היא אינה ייעוץ משפטי, אינה חיזוי תוצאה ואינה תחליף להכנה עם עורך דין מוסמך.`
:
`Court hearing preparation simulation
Prepared on ${today()}${d.hearingDate?" · Hearing date: "+fdate(d.hearingDate):""}

Area: ${g(d,"caseArea")} · Role: ${g(d,"myRole")}

1. Case summary
${g(d,"caseFacts")}

2. Your goal in the hearing
${g(d,"myGoal")}

3. Questions you are likely to be asked
- Describe in your own words, in order, exactly what happened.
- Which documents or evidence support your version?
- Did you approach the other side before proceedings? What was offered and answered?
- What actual harm or loss did you suffer?

4. Arguments the other side may raise
- A different factual version of the key events.
- Claims about missing documents, deadlines or evidence.
- A settlement offer or reduced liability.

5. Evidence and documents you hold
${g(d,"evidence")}

6. Preparation checklist
- Organize documents chronologically and bring copies.
- Prepare a one-minute answer to "what happened" without drifting.
- Write down your three most important points in advance.
- Be precise: one inaccurate statement damages overall credibility.

This simulation is a practice and preparation tool only. It is not legal advice, not an outcome prediction, and not a substitute for preparing with a licensed attorney.`;}},
{id:"cost-estimator",cat:"court",icon:"coins",accent:"g",live:true,
 title:{he:"הערכת עלות עורך דין",en:"Lawyer Cost Estimator"},
 blurb:{he:"טווחי שכר טרחה מקובלים לפי תחום וסוג הליך, לפי הנתונים שמפורסמים באתר.",en:"Common fee ranges by area and proceeding type, based on data published on the site."},
 fields:[
   SEL("costArea","תחום משפטי","Legal area",["משפחה וגירושין","פלילי ותעבורה","מקרקעין ונדל\"ן","עבודה","נזיקין וביטוח לאומי","חוזים וכספים","אחר"],["Family & divorce","Criminal & traffic","Real estate","Labor","Torts & national insurance","Contracts & money","Other"],{req:true}),
   SEL("engagement","סוג השירות","Service type",
     ["ייעוץ ראשוני חד-פעמי","ליווי מלא בהליך","הכנת מסמך או חוזה","ייצוג בתיק נזיקין (אחוזים)"],
     ["One-time initial consult","Full representation","Document or contract drafting","Injury case (contingency)"],{req:true}),
   SEL("complexity","מורכבות משוערת","Estimated complexity",
     ["פשוט: עניין ממוקד אחד","בינוני: כמה סוגיות או צדדים","מורכב: מחלוקת רחבה או סכומים גבוהים"],
     ["Simple: one focused issue","Medium: several issues or parties","Complex: broad dispute or high amounts"],{req:true}),
   F("costNotes","textarea","פרטים נוספים על המקרה (רשות)","More details (optional)"),
 ],
 gen(d){return LANG==="he"?
`הערכת טווחי עלות לשירות משפטי
הוכן ביום ${today()}

תחום: ${g(d,"costArea")}
סוג שירות: ${g(d,"engagement")}
מורכבות: ${g(d,"complexity")}

טווחים מקובלים בישראל (כפי שמפורסם במדריכי Jus-Tice):
- ייעוץ ראשוני חד-פעמי: 200 עד 800 שקלים.
- שכר טרחה שעתי: 350 עד 1,500 שקלים לשעה, לפי ניסיון ותחום.
- תיקי נזיקין ותאונות: שכר באחוזים, בדרך כלל 8 עד 25 אחוזים מהפיצוי, ללא תשלום מראש.
- גירושין בהסכמה: לרוב שכר קבוע מוסכם מראש בטווח של 5,000 עד 15,000 שקלים.
- גירושין במחלוקת: לרוב 15,000 עד 30,000 שקלים ומעלה, לפי משך ומורכבות.

הערות למקרה שתיארתם:
${g(d,"costNotes")}

איך להשתמש בהערכה:
- בקשו הצעת שכר טרחה מפורטת בכתב לפני תחילת עבודה. לפי כללי לשכת עורכי הדין, הסכם שכר טרחה חייב להיות בכתב.
- שאלו מה כלול במחיר ומה נחשב תוספת: דיונים, ערעורים, נסיעות, אגרות.
- השוו בין 2 עד 3 הצעות לפני החלטה.

הטווחים הם מידע כללי שמבוסס על הנתונים המתפרסמים באתר ואינם הצעת מחיר, התחייבות או ייעוץ משפטי. המחיר בפועל נקבע מול עורך הדין בלבד.`
:
`Legal fee range estimate
Prepared on ${today()}

Area: ${g(d,"costArea")}
Service type: ${g(d,"engagement")}
Complexity: ${g(d,"complexity")}

Common ranges in Israel (as published in Jus-Tice guides):
- One-time initial consult: 200 to 800 ILS.
- Hourly fees: 350 to 1,500 ILS per hour, by experience and field.
- Injury cases: contingency fees, usually 8 to 25 percent of compensation, no upfront payment.
- Uncontested divorce: usually a fixed fee agreed in advance, 5,000 to 15,000 ILS.
- Contested divorce: usually 15,000 to 30,000 ILS and up, by length and complexity.

Notes on your case:
${g(d,"costNotes")}

How to use this estimate:
- Request a detailed written fee proposal before work begins. Bar rules require fee agreements in writing.
- Ask what the price includes and what counts as extra: hearings, appeals, travel, court fees.
- Compare 2 to 3 proposals before deciding.

These ranges are general information based on data published on this site. They are not a quote, a commitment or legal advice. The actual fee is set only with the attorney.`;}},
{id:"court-arena",cat:"court",icon:"scales",accent:"r",live:true,
 title:{he:"סימולציית בית משפט: CourtAI Arena",en:"Courtroom Simulation: CourtAI Arena"},
 blurb:{he:"דיון מדומה מלא: פתיחות, חקירות, מוצגים, סיכומים והכרעה מנומקת לפי הראיות.",en:"Full simulated hearing: openings, examinations, exhibits, closings and a reasoned ruling."},
 fields:[
   SEL("arenaArea","תחום התיק","Case area",["משפחה וגירושין","פלילי ותעבורה","מקרקעין ונדל\"ן","עבודה","נזיקין וביטוח לאומי","חוזים וכספים","אחר"],["Family & divorce","Criminal & traffic","Real estate","Labor","Torts & national insurance","Contracts & money","Other"],{req:true}),
   SEL("arenaSide","באיזה צד אתם","Which side are you on",["התובע/ת","הנתבע/ת","הנאשם/ת (פלילי)","המבקש/ת"],["Plaintiff","Defendant","Accused (criminal)","Applicant"],{req:true}),
   F("arenaFacts","textarea","תיאור המקרה והרקע","Case facts and background",{req:true,ph:{he:"מה קרה, מתי, מי מעורב, מה המחלוקת…",en:"What happened, when, who is involved, what is disputed…"}}),
   F("arenaPoints","textarea","שלוש הנקודות החזקות שלכם","Your three strongest points",{req:true}),
   F("arenaEvidence","textarea","ראיות ומוצגים (אחד בכל שורה)","Evidence and exhibits (one per line)",{req:true,ph:{he:"חוזה חתום, תכתובת וואטסאפ, חוות דעת…",en:"Signed contract, WhatsApp thread, expert opinion…"}}),
   F("arenaOpposing","textarea","מה הצד השני צפוי לטעון","What the other side will likely argue"),
 ],
 gen(d){
   const evLines=(d.arenaEvidence||"").split("\n").map(s=>s.trim()).filter(Boolean);
   const exhibitsHe=evLines.length?evLines.map((e,i)=>`מוצג ת/${i+1}: ${e} (סטטוס: ממתין לקבילות)`).join("\n"):"מוצג ת/1: __________ (סטטוס: ממתין לקבילות)";
   const exhibitsEn=evLines.length?evLines.map((e,i)=>`Exhibit P-${i+1}: ${e} (status: pending admission)`).join("\n"):"Exhibit P-1: __________ (status: pending admission)";
   return LANG==="he"?
`פרוטוקול סימולציה: תיק ${g(d,"arenaArea")}
הוכן ביום ${today()} · תפקידכם בסימולציה: ${g(d,"arenaSide")}

א. תיק הדיון (Case Docket)
${g(d,"arenaFacts")}

ב. עץ המטרות (מה נחשב הצלחה לכל צד)
- הצד שלכם: ${g(d,"arenaPoints")}
- הצד שכנגד (משוער): ${g(d,"arenaOpposing")}

ג. רשימת מוצגים
${exhibitsHe}

ד. סדר הדיון (פרוטוקול הסימולציה)
1. פתיחת הדיון על ידי בית המשפט
2. דבר פתיחה: בא כוח התובע
3. דבר פתיחה: בא כוח הנתבע
4. פרשת התביעה: הצגת מוצגים וחקירה ראשית (שאלות פתוחות)
5. חקירה נגדית (שאלות מובילות, תשובות כן/לא)
6. פרשת ההגנה
7. סיכומים: שני הצדדים
8. הכרעה מנומקת של בית המשפט על בסיס הראיות בלבד

ה. הנחיות לתמליל הסימולציה (להשלמה מלאה)
יש להשלים מסמך זה לתמליל דיון מלא בעברית לפי סדר הדיון שלמעלה, בפורמט תמליל:
"השופט/ת:", "ב"כ התובע:", "ב"כ הנתבע:", "העד/ה:".
כל דובר מדבר 2 עד 4 משפטים בכל תור, כמו בדיון חי.
יש להפנות למוצגים לפי המספור שלהם (ת/1, ת/2) בעת הצגתם.
בחקירה ראשית: שאלות פתוחות. בחקירה נגדית: שאלות מובילות.
בסיום: הכרעה מנומקת של השופט/ת המבוססת אך ורק על הראיות שהוצגו, ואחריה
ניתוח קצר: ציון עוצמה לכל צד בסולם 0 עד 100 עם נימוק, לאיזה כיוון נטה הדיון, סתירות שהתגלו בגרסאות, ונקודות שכדאי לחזק לפני דיון אמיתי.

סימולציה זו היא תרגול והמחשה בלבד: לא ייעוץ משפטי, לא חיזוי תוצאה ולא תחליף להכנה עם עורך דין מוסמך. התוצאה בתיק אמיתי תלויה בנסיבות, בראיות ובערכאה.`
:
`Simulation protocol: ${g(d,"arenaArea")} case
Prepared on ${today()} · Your role: ${g(d,"arenaSide")}

A. Case docket
${g(d,"arenaFacts")}

B. Goal tree (what counts as success per side)
- Your side: ${g(d,"arenaPoints")}
- Opposing side (estimated): ${g(d,"arenaOpposing")}

C. Exhibit list
${exhibitsEn}

D. Order of proceedings (simulation protocol)
1. Court opens the session
2. Opening statement: plaintiff counsel
3. Opening statement: defense counsel
4. Plaintiff case: exhibits and direct examination (open-ended questions)
5. Cross-examination (leading yes/no questions)
6. Defense case
7. Closing arguments: both sides
8. Reasoned ruling based strictly on the evidence

E. Transcript instructions (for full completion)
Complete this document into a full hearing transcript following the order above, in transcript format:
"Judge:", "Plaintiff counsel:", "Defense counsel:", "Witness:".
Each speaker takes 2 to 4 sentences per turn, as in a live courtroom.
Reference exhibits by label (P-1, P-2) when introduced.
Direct examination: open-ended questions. Cross-examination: leading questions.
End with the judge's reasoned ruling based strictly on the evidence presented, followed by
a short analysis: a strength score for each side on a 0 to 100 scale with reasoning, which way the hearing leaned, contradictions detected between versions, and points to strengthen before a real hearing.

This simulation is practice and illustration only: not legal advice, not an outcome prediction, and not a substitute for preparing with a licensed attorney.`;}},
{id:"contract-arena",cat:"court",icon:"scroll",accent:"b",live:true,
 title:{he:"סימולציית חוזה: מכר, שכירות ושירותים",en:"Contract Simulation: Sale, Lease & Services"},
 blurb:{he:"בוחנים חוזה בלחץ של דיון: אילו סעיפים יחזיקו, אילו יישברו ומה לתקן לפני חתימה.",en:"Stress-test a contract in a simulated dispute: which clauses hold, which break, what to fix."},
 fields:[
   SEL("contractType","סוג החוזה","Contract type",["מכר דירה או מגרש","שכירות למגורים","שכירות מסחרית","הסכם שירותים","הסכם קבלנות ושיפוצים","אחר"],["Apartment or land sale","Residential lease","Commercial lease","Services agreement","Construction / renovation","Other"],{req:true}),
   SEL("contractSide","הצד שלכם בחוזה","Your side",["הקונה / השוכר / המזמין","המוכר / המשכיר / נותן השירות"],["Buyer / tenant / client","Seller / landlord / provider"],{req:true}),
   F("contractParties","text","הצדדים לחוזה","Parties",{req:true,half:true}),
   F("contractAsset","text","הנכס או השירות","Asset or service",{req:true,half:true,ph:{he:"דירת 4 חדרים ברחובות, מגרש 500 מ\"ר…",en:"4-room flat, 500 sqm plot…"}}),
   F("contractTerms","textarea","הסעיפים המרכזיים כפי שסוכמו","Key agreed terms",{req:true,ph:{he:"מחיר ולוח תשלומים, מועד מסירה, בדק, ערבויות, פיצוי מוסכם…",en:"Price and schedule, delivery date, warranties, agreed damages…"}}),
   F("contractWorries","textarea","מה מדאיג אתכם בעסקה","What worries you",{req:true}),
 ],
 gen(d){return LANG==="he"?
`סימולציית עמידות חוזה
הוכן ביום ${today()}

סוג: ${g(d,"contractType")} · הצד שלכם: ${g(d,"contractSide")}
צדדים: ${g(d,"contractParties")}
נכס או שירות: ${g(d,"contractAsset")}

א. הסעיפים המרכזיים כפי שסוכמו
${g(d,"contractTerms")}

ב. נקודות שמדאיגות אתכם
${g(d,"contractWorries")}

ג. תרחיש הלחץ (פרוטוקול הסימולציה)
1. הצד השני מפר את החוזה בנקודה הרגישה ביותר עבורכם.
2. כל צד מציג את פרשנותו לסעיפים שסוכמו.
3. נבחנת השאלה: מה כתוב בפועל לעומת מה שהתכוונתם.
4. נבדקים סעדים: אכיפה, ביטול, פיצוי מוסכם, קיזוז.

ד. הנחיות להשלמת הסימולציה
יש להשלים מסמך זה לניתוח עמידות מלא בעברית במבנה הבא:
"תרחיש ההפרה:", "טענת הצד שלכם:", "טענת הצד שכנגד:", "הכרעה מנומקת:" עבור שלושת התרחישים המסוכנים ביותר לחוזה כזה.
לכל תרחיש לסיים בשורת "תיקון מומלץ לחוזה:" עם ניסוח סעיף מגן קצר.
בסוף: רשימת חמשת הסעיפים שחובה לוודא שקיימים בחוזה כזה לפני חתימה.

הסימולציה נועדה לזיהוי סיכונים והכנה בלבד. היא אינה ייעוץ משפטי ואינה תחליף לבדיקת החוזה על ידי עורך דין מוסמך לפני חתימה.`
:
`Contract stress-test simulation
Prepared on ${today()}

Type: ${g(d,"contractType")} · Your side: ${g(d,"contractSide")}
Parties: ${g(d,"contractParties")}
Asset or service: ${g(d,"contractAsset")}

A. Key agreed terms
${g(d,"contractTerms")}

B. Your concerns
${g(d,"contractWorries")}

C. Stress scenario (simulation protocol)
1. The other side breaches at your most sensitive point.
2. Each side presents its reading of the agreed terms.
3. The gap between what is written and what was intended is examined.
4. Remedies are tested: enforcement, rescission, agreed damages, set-off.

D. Completion instructions
Complete this document into a full resilience analysis structured as:
"Breach scenario:", "Your side's claim:", "Opposing claim:", "Reasoned ruling:" for the three riskiest scenarios for this contract type.
End each scenario with "Recommended contract fix:" and a short protective clause.
Finish with the five clauses that must exist in this contract type before signing.

This simulation is for risk-spotting and preparation only. It is not legal advice and not a substitute for attorney review before signing.`;}},
{id:"witness-prep",cat:"court",icon:"users",accent:"g",live:true,
 title:{he:"הכנת עדות וחקירה נגדית",en:"Witness Preparation & Cross-Examination"},
 blurb:{he:"מתאמנים על העדות: שאלות חקירה ראשית ונגדית, תשובות מודל ומלכודות נפוצות.",en:"Practice your testimony: direct and cross questions, model answers, common traps."},
 fields:[
   SEL("witnessRole","מי אתם בעדות","Your role",["עד/ת מטעם התביעה","עד/ת מטעם ההגנה","בעל/ת דין שמעיד/ה","עד/ת מומחה"],["Prosecution/plaintiff witness","Defense witness","Party testifying","Expert witness"],{req:true}),
   F("witnessEvent","textarea","מה ראיתם או יודעים? תארו את האירוע","What did you see or know? Describe the event",{req:true}),
   F("witnessWeak","textarea","נקודות רגישות בעדות שלכם","Sensitive points in your testimony",{req:true,ph:{he:"פערי זמן, זיכרון חלקי, קשר לצדדים…",en:"Time gaps, partial memory, ties to a party…"}}),
   F("witnessRelation","text","הקשר שלכם לצדדים","Your relation to the parties",{half:true}),
   F("witnessDocs","text","מסמכים שקשורים לעדות","Documents tied to the testimony",{half:true}),
 ],
 gen(d){return LANG==="he"?
`תוכנית הכנה לעדות
הוכן ביום ${today()} · תפקיד: ${g(d,"witnessRole")}

א. גרסת העדות שלכם
${g(d,"witnessEvent")}

ב. נקודות רגישות שזוהו
${g(d,"witnessWeak")}

ג. כללי יסוד לעד
- עונים רק על מה שנשאל. לא מתנדבים מידע.
- מותר ואף רצוי לומר "איני זוכר/ת" כשזו האמת.
- לא מנחשים. אם לא בטוחים, אומרים שלא בטוחים.
- מקשיבים לשאלה עד סופה, נושמים, ואז עונים.
- אמת אחת: גרסה שסותרת מסמך תישבר בחקירה.

ד. חקירה ראשית (שאלות פתוחות, לפי הפרוטוקול)
- ספרו לבית המשפט מה ראיתם ביום האירוע.
- תארו את מיקומכם ומה אפשר היה לראות משם.
- מה קרה מיד לפני ומיד אחרי?

ה. חקירה נגדית (שאלות מובילות, תשובות כן/לא)
- נכון שהיכרתם את ${g(d,"witnessRelation")} עוד קודם?
- נכון שלא ראיתם את הרגע המדויק?
- נכון שבפעם הראשונה סיפרתם גרסה שונה?

ו. הנחיות להשלמת התרגול
יש להשלים מסמך זה לתסריט אימון מלא בעברית: 8 שאלות חקירה ראשית פתוחות עם תשובת מודל קצרה לכל אחת לפי הגרסה שלמעלה, ואז 8 שאלות חקירה נגדית מובילות שתוקפות בדיוק את הנקודות הרגישות שצוינו, עם הדרך הנכונה לענות על כל אחת ומלכודת נפוצה להיזהר ממנה. לסיום: שלוש הערות אימון אישיות.

התרגול נועד להכנה בלבד. אין בו הדרכה לשנות עדות: העדות בבית המשפט חייבת להיות אמת. הכנה עם עורך דין מוסמך היא הדרך הנכונה לקראת עדות אמיתית.`
:
`Witness preparation plan
Prepared on ${today()} · Role: ${g(d,"witnessRole")}

A. Your testimony version
${g(d,"witnessEvent")}

B. Sensitive points identified
${g(d,"witnessWeak")}

C. Ground rules
- Answer only what was asked. Never volunteer.
- "I don't remember" is a proper answer when true.
- Never guess. If unsure, say so.
- Hear the full question, breathe, then answer.
- One truth: a version that contradicts a document breaks on cross.

D. Direct examination (open questions, per protocol)
- Tell the court what you saw that day.
- Describe where you stood and what was visible.
- What happened right before and right after?

E. Cross-examination (leading yes/no questions)
- You knew ${g(d,"witnessRelation")} beforehand, correct?
- You did not see the exact moment, correct?
- Your first account was different, correct?

F. Completion instructions
Complete this into a full practice script: 8 open direct-examination questions with a short model answer each based on the version above, then 8 leading cross-examination questions attacking exactly the sensitive points listed, with the right way to answer each and a common trap to avoid. End with three personal coaching notes.

Practice only. This is never guidance to change testimony: court testimony must be truthful. Preparing with a licensed attorney is the right path before a real testimony.`;}},
];

/* ============================================================
   RENDER - hub
   ============================================================ */
let CURF="all", Q="";
function renderCats(){
  const wrap=$("#cats"); wrap.innerHTML="";
  const mk=(id,label,n)=>{const b=el("button",{class:"cat"+(CURF===id?" on":""),"data-c":id});b.innerHTML=esc(label)+(n!=null?` <span class="n">${n}</span>`:"");b.onclick=()=>{CURF=id;renderCats();renderGrid();};return b;};
  wrap.append(mk("all",ui("all"),TOOLS.length));
  CATS.forEach(c=>wrap.append(mk(c.id,t(c.label),TOOLS.filter(x=>x.cat===c.id).length)));
}
function matches(tool){
  if(CURF!=="all"&&tool.cat!==CURF)return false;
  if(!Q)return true;
  const hay=(t(tool.title)+" "+t(tool.blurb)+" "+t(tool.title==tool.title?tool.title.he:"")+" "+tool.title.en+" "+tool.title.he).toLowerCase();
  return hay.includes(Q);
}
function renderGrid(){
  const grid=$("#grid"); grid.innerHTML="";
  const list=TOOLS.filter(matches);
  if(!list.length){grid.append(el("div",{class:"empty"},ui("empty")));return;}
  // group by category, live first within each
  const order=CATS.map(c=>c.id);
  list.sort((a,b)=> (order.indexOf(a.cat)-order.indexOf(b.cat)) || (b.live-a.live));
  let lastCat=null;
  list.forEach(tool=>{
    if(tool.cat!==lastCat){lastCat=tool.cat;const cl=CATS.find(c=>c.id===tool.cat);
      grid.append(el("div",{class:"grp-title",style:"grid-column:1/-1"},t(cl.label)));}
    grid.append(card(tool));
  });
}
function card(tool){
  const c=el("div",{class:"card "+tool.accent+(tool.live?"":" n"),role:"button",tabindex:"0"});
  c.innerHTML=`
    <span class="ico">${ic(tool.icon)}</span>
    <h3>${esc(t(tool.title))}</h3>
    <p>${esc(t(tool.blurb))}</p>
    <div class="foot">
      <span class="badge ${tool.live?"live":"review"}">${tool.live?ui("live"):ui("review")}</span>
      <span class="go">${ui("open")} ${ICONS.arrow}</span>
    </div>`;
  const act=()=>tool.live?openTool(tool.id):toast(t(tool.title)+" - "+ui("review"));
  c.onclick=act; c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();act();}};
  return c;
}

/* ============================================================
   WIZARD
   ============================================================ */
let CUR=null, DATA={}, LAST_DOC="";
function fieldHTML(f){
  const lbl=esc(t(f.label))+(f.req?` <span class="req">*</span>`:"")+(f.hint?` <span class="hint">${esc(t(f.hint))}</span>`:"");
  const val=DATA[f.name]!=null?DATA[f.name]:"";
  let ctrl;
  if(f.type==="textarea")ctrl=`<textarea name="${f.name}" placeholder="${esc(t(f.ph)||"")}">${esc(val)}</textarea>`;
  else if(f.type==="select")ctrl=`<select name="${f.name}">${(f.ph?`<option value="">${esc(t(f.ph))}</option>`:"")}${f.options.map(o=>`<option ${val===t(o.label)?"selected":""}>${esc(t(o.label))}</option>`).join("")}</select>`;
  else ctrl=`<input type="${f.type||"text"}" name="${f.name}" placeholder="${esc(t(f.ph)||"")}" value="${esc(val)}">`;
  return `<div class="field" data-f="${f.name}"><label>${lbl}</label>${ctrl}</div>`;
}
function formHTML(tool){
  const fs=tool.fields; let h="",i=0;
  while(i<fs.length){
    if(fs[i].half&&fs[i+1]&&fs[i+1].half){h+=`<div class="row2">${fieldHTML(fs[i])}${fieldHTML(fs[i+1])}</div>`;i+=2;}
    else{h+=fieldHTML(fs[i]);i++;}
  }
  return h;
}
function openTool(id){
  CUR=TOOLS.find(x=>x.id===id); if(!CUR)return;
  DATA={}; LAST_DOC="";
  const sheet=$("#sheet");
  sheet.innerHTML=`
    <div class="sheet-hd">
      <span class="ico">${ic(CUR.icon)}</span>
      <div><h2>${esc(t(CUR.title))}</h2><p>${esc(t(CUR.blurb))}</p></div>
      <button class="x" id="xBtn" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="sheet-body">
      <div class="form-col">
        <form id="form" autocomplete="off">${formHTML(CUR)}</form>
        <div class="btnrow">
          <button class="btn primary" id="genBtn">${ICONS.pen}${ui("generate")}</button>
          <button class="btn ai" id="aiBtn">${ICONS.spark}${ui("enhance")}</button>
          <button class="btn ghost" id="resetBtn">${ui("reset")}</button>
          <button class="btn" id="reviewBtn">${LANG==="he"?"בדיקת עורך דין למסמך":"Request attorney review"}</button>
          <button class="btn" id="docBtn">${LANG==="he"?"צירוף מסמך לבדיקה":"Attach a document"}</button>
        </div>
        <div class="ai-note">${ui("aiNote")}</div>
        <div class="disclaimer">${ui("disc")}</div>
      </div>
      <div class="prev-col">
        <div class="prev-head">
          <span class="lbl">${ui("previewLbl")}</span>
          <div class="btnrow" style="margin:0">
            <button class="btn" id="copyBtn">${ui("copy")}</button>
            <button class="btn" id="printBtn">${ui("print")}</button>
            <button class="btn" id="dlBtn">${ui("download")}</button>
            <button class="btn" id="lawyerBtn">${ui("lawyer")}</button>
          </div>
        </div>
        <div class="paper empty" id="paper">${esc(ui("previewEmpty"))}</div>
      </div>
    </div>`;
  // wire
  const form=$("#form",sheet);
  form.addEventListener("input",e=>{const n=e.target.name;if(n){DATA[n]=e.target.value;refreshPreview();}});
  $("#xBtn",sheet).onclick=closeSheet;
  $("#genBtn",sheet).onclick=()=>{if(validate())refreshPreview(true);};
  $("#aiBtn",sheet).onclick=()=>requireLeadGate("enhance",_rawDoEnhance);
  $("#resetBtn",sheet).onclick=()=>{DATA={};LAST_DOC="";form.reset();$("#paper",sheet).className="paper empty";$("#paper",sheet).textContent=ui("previewEmpty");};
  $("#reviewBtn",sheet).onclick=()=>requireLeadGate("review",()=>toast(LANG==="he"?"הבקשה נקלטה. עורך דין רלוונטי יקבל את המסמך לבדיקה.":"Request received. A relevant attorney will get the document for review."));
  $("#docBtn",sheet).onclick=()=>requireLeadGate("doc",()=>toast(LANG==="he"?"המסמך התקבל ויועבר לבדיקה.":"Document received for review."));
  $("#copyBtn",sheet).onclick=()=>requireLeadGate("copy",_rawCopyDoc);
  $("#printBtn",sheet).onclick=()=>requireLeadGate("print",_rawPrintDoc);
  $("#dlBtn",sheet).onclick=()=>requireLeadGate("download",_rawDownloadDoc);
  $("#lawyerBtn",sheet).onclick=()=>window.open("https://jus-tice.co.il/#ask-lawyer","_blank");
  $("#scrim").classList.add("on"); sheet.classList.add("on");
  document.body.style.overflow="hidden";
}
function closeSheet(){$("#sheet").classList.remove("on");$("#scrim").classList.remove("on");document.body.style.overflow="";CUR=null;}
function validate(){
  if(!CUR)return false; let ok=true;
  CUR.fields.forEach(f=>{const w=$(`.field[data-f="${f.name}"]`);if(!w)return;
    if(f.req&&(!DATA[f.name]||!String(DATA[f.name]).trim())){w.classList.add("bad");ok=false;}else w.classList.remove("bad");});
  if(!ok)toast(ui("needFields"));
  return ok;
}
function refreshPreview(force){
  if(!CUR)return;
  const txt=CUR.gen(DATA); LAST_DOC=txt;
  const p=$("#paper"); p.classList.remove("empty"); p.textContent=txt; p.dir=LANG==="he"?"rtl":"ltr";
}
async function _rawDoEnhance(){
  if(!CUR)return; if(!validate())return;
  const base=CUR.gen(DATA); LAST_DOC=base;
  const p=$("#paper"); p.classList.remove("empty"); p.dir=LANG==="he"?"rtl":"ltr"; p.textContent=base;
  const btn=$("#aiBtn"); btn.disabled=true;
  const steps=LANG==="he"
    ?["1/3 אוספים את הפרטים מהשאלון","2/3 ה-AI מנסח ומחדד את המסמך","3/3 בודקים מבנה ומציגים"]
    :["1/3 Collecting your answers","2/3 AI is drafting and sharpening","3/3 Checking structure and rendering"];
  let stepBox=$("#aiSteps");
  if(!stepBox){stepBox=el("div",{id:"aiSteps",class:"ai-note"});$(".prev-col")?.insertBefore(stepBox,$("#paper"));}
  const setStep=(i)=>{stepBox.innerHTML=steps.map((s,j)=>`<div style="opacity:${j<=i?1:.38};font-weight:${j===i?700:400}">${j<i?"✓":j===i?"●":"○"} ${esc(s)}</div>`).join("");};
  setStep(0);
  setStep(1);
  const out=await aiEnhance({tool:CUR.id,lang:LANG,fields:DATA,draft:base});
  setStep(2);
  btn.disabled=false;
  setTimeout(()=>{stepBox&&stepBox.remove();},2600);
  if(out && out.text){p.textContent=out.text;LAST_DOC=out.text;toast(ui("aiDone"));if(CUR&&CUR.cat==="court")renderCourtTurn();}
  else if(out && ["daily_site_limit","daily_ip_limit","daily_spend_limit","input_too_large"].includes(out.error)){toast(ui("aiLimit"));}
  else toast(ui("aiOff"));
}
function _rawCopyDoc(){if(!LAST_DOC)return;navigator.clipboard?.writeText(LAST_DOC).then(()=>toast(ui("copied")),()=>toast(ui("copied")));}
function _rawDownloadDoc(){
  if(!LAST_DOC)return;
  const dir=LANG==="he"?"rtl":"ltr";
  const html=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body dir='${dir}' style="font-family:'David',Arial,sans-serif;white-space:pre-wrap;font-size:12pt;line-height:1.7">${esc(LAST_DOC)}</body></html>`;
  const blob=new Blob(["﻿",html],{type:"application/msword"});
  const a=el("a",{href:URL.createObjectURL(blob),download:(CUR?CUR.id:"document")+".doc"});document.body.append(a);a.click();a.remove();
}
function _rawPrintDoc(){
  if(!LAST_DOC)return;
  let pa=$("#printArea"); if(!pa){pa=el("div",{id:"printArea"});document.body.append(pa);}
  pa.dir=LANG==="he"?"rtl":"ltr";
  pa.style.cssText="white-space:pre-wrap;font-family:'David',Arial,sans-serif;font-size:12pt;line-height:1.7";
  pa.textContent=LAST_DOC; window.print();
}

/* ============================================================
   LANGUAGE
   ============================================================ */
function applyLang(){
  document.documentElement.lang=LANG; document.documentElement.dir=LANG==="he"?"rtl":"ltr";
  $("#langLabel").textContent=LANG==="he"?"EN":"עב";
  $$("[data-i18n]").forEach(n=>{const k=n.getAttribute("data-i18n");if(I18N[LANG][k]!=null)n.innerHTML=I18N[LANG][k];});
  $("#search").placeholder=ui("searchPh");
  $("#statTools").textContent="50+"; $("#statLive").textContent=String(TOOLS.filter(x=>x.live).length);
  renderCats(); renderGrid();
  if(CUR){const id=CUR.id;closeSheet();openTool(id);} // rebuild open sheet in new language
}
$("#langBtn").onclick=()=>{LANG=LANG==="he"?"en":"he";localStorage.setItem("justice_lang",LANG);applyLang();};
$("#search").addEventListener("input",e=>{Q=e.target.value.trim().toLowerCase();renderGrid();});
$("#scrim").onclick=closeSheet;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&CUR)closeSheet();});

/* ---------- WordPress / iframe integration ----------
   The plugin embeds this app as: index.html?api=<rest_url>&lang=he
   - api : same-origin REST proxy that holds the OpenAI key server-side
   - lang: initial language (he|en)                                     */
try{
  const u=new URL(location.href);
  const api=u.searchParams.get("api");
  if(api){AI_CONFIG.endpoint=api;AI_CONFIG.enabled=true;}
  else if(location.protocol.indexOf("http")===0){
    AI_CONFIG.endpoint=new URL("/wp-json/justice/v1/generate", location.origin).toString();
    AI_CONFIG.enabled=true;
  }
  const lg=u.searchParams.get("lang");
  if(lg==="en"||lg==="he"){LANG=lg;localStorage.setItem("justice_lang",lg);}
}catch(e){}
/* auto-resize when embedded in an iframe (host listens for justiceHeight) */
function postHeight(){try{parent.postMessage({justiceHeight:document.documentElement.scrollHeight},"*");}catch(e){}}
if(window.ResizeObserver){new ResizeObserver(postHeight).observe(document.body);}
window.addEventListener("load",postHeight);

/* ---------- boot ---------- */
applyLang();
/* deep-link: /legal-tools/?cat=housing  or  ?tool=residential-lease  (also supports #tool-id)
   lets every spoke/content page open the exact tool it relates to */
try{
  const u=new URL(location.href);
  const cat=u.searchParams.get("cat");
  if(cat&&CATS.some(c=>c.id===cat)){CURF=cat;renderCats();renderGrid();}
  const AREA_TO_CAT={"family-law":"family","inheritance-law":"family","real-estate-law":"housing","labor-law":"work","traffic-law":"vehicle","tax-law":"money","debt-collection":"money","criminal-law":"court","torts":"court","medical-malpractice":"court"};
  const area=(u.searchParams.get("area")||"").trim();
  if(area)window.JUSTICE_AREA_PARAM=area;
  if(area&&AREA_TO_CAT[area]&&CATS.some(c=>c.id===AREA_TO_CAT[area])){CURF=AREA_TO_CAT[area];renderCats();renderGrid();}
  const tool=(u.searchParams.get("tool")||location.hash.replace(/^#/,"")||"").trim();
  if(tool&&TOOLS.some(x=>x.id===tool&&x.live)){openTool(tool);}
  /* Cross-surface handoff: a launcher elsewhere on the site (homepage AI
     center) stores the visitor's description so they never retype it. */
  try{
    const raw=localStorage.getItem("justice_ai_prefill");
    if(raw){
      const pre=JSON.parse(raw);
      localStorage.removeItem("justice_ai_prefill");
      if(pre&&pre.tool&&TOOLS.some(x=>x.id===pre.tool&&x.live)&&(Date.now()-(pre.ts||0))<600000){
        if(!CUR||CUR.id!==pre.tool)openTool(pre.tool);
        const form=$("#form");
        if(form&&pre.fields){
          Object.keys(pre.fields).forEach(k=>{
            const inp=form.querySelector('[name="'+k+'"]');
            if(inp&&pre.fields[k]){inp.value=pre.fields[k];DATA[k]=pre.fields[k];}
          });
          refreshPreview();
        }
      }
    }
  }catch(e){}
}catch(e){}

/* ============================================================
   Lead gate: free template generation stays open to everyone.
   AI-enhanced output, copy, print and download require a short
   contact form first (this is the lead capture that makes the
   tool monetizable - the visitor becomes a routed legal lead).
   ============================================================ */
let LEAD_UNLOCKED = false;
try { LEAD_UNLOCKED = sessionStorage.getItem("justice_ai_lead_unlocked") === "1"; } catch (e) {}

const GATE_I18N = {
  he: {
    title: "פרטים לפני המשך",
    sub: "השדרוג עם AI, ההעתקה, ההדפסה וההורדה פתוחים אחרי פרטי קשר קצרים. הטיוטה הבסיסית כבר נוצרה למעלה בלי שום הרשמה.",
    name: "שם מלא", phone: "טלפון", email: "אימייל",
    consent: "אני מסכים/ה שיצרו איתי קשר בנוגע לפנייה הזו.",
    upload: "צירוף מסמך קיים לבדיקת עורך דין (רשות)",
    channel: "איך נוח לכם שנחזור אליכם?",
    channelOpts: ["וואטסאפ","שיחת טלפון","פגישת וידאו","אימייל"],
    submit: "המשך לתוצאה המלאה", sending: "שולח…",
    error: "לא הצלחנו לשלוח, נסו שוב.", needFields: "נא למלא שם, טלפון ואישור."
  },
  en: {
    title: "A few details before you continue",
    sub: "AI enhancement, copy, print and download unlock after a short contact form. The base draft above was already generated with no signup at all.",
    name: "Full name", phone: "Phone", email: "Email",
    consent: "I agree to be contacted about this request.",
    upload: "Attach an existing document for lawyer review (optional)",
    channel: "How should we get back to you?",
    channelOpts: ["WhatsApp","Phone call","Video meeting","Email"],
    submit: "Continue to the full result", sending: "Sending…",
    error: "Could not send, please try again.", needFields: "Please fill in name, phone and consent."
  }
};
const gt = k => (GATE_I18N[LANG] || GATE_I18N.he)[k] || k;

function ensureLeadGateModal() {
  let scrim = $("#leadGateScrim");
  if (scrim) return scrim;
  scrim = el("div", { id: "leadGateScrim", class: "lead-gate-scrim" });
  const modal = el("div", { id: "leadGateModal", class: "lead-gate-modal", role: "dialog", "aria-modal": "true" });
  modal.innerHTML = `
    <button type="button" class="x" id="leadGateClose" aria-label="${ui("reset")}">${ICONS.x}</button>
    <h3>${gt("title")}</h3>
    <p>${gt("sub")}</p>
    <form id="leadGateForm">
      <label class="field"><span>${gt("name")} *</span><input type="text" name="lead_name" required></label>
      <label class="field"><span>${gt("phone")} *</span><input type="tel" name="lead_phone" required></label>
      <label class="field"><span>${gt("email")}</span><input type="email" name="lead_email"></label>
      <label class="field"><span>${gt("upload")}</span><input type="file" name="lead_document" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"></label>
      <label class="field"><span>${gt("channel")}</span><select name="lead_channel">${gt("channelOpts").map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select></label>
      <label class="field lead-gate-consent"><input type="checkbox" name="lead_consent" required><span>${gt("consent")}</span></label>
      <input type="text" name="lead_hp" class="lead-gate-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button type="submit" class="btn primary" id="leadGateSubmit">${gt("submit")}</button>
    </form>`;
  document.body.append(scrim, modal);
  $("#leadGateClose", modal).onclick = closeLeadGate;
  scrim.onclick = closeLeadGate;
  $("#leadGateForm", modal).addEventListener("submit", onLeadGateSubmit);
  return scrim;
}
function openLeadGate() {
  ensureLeadGateModal();
  try {
    const saved = JSON.parse(localStorage.getItem("justice_gate_profile") || "null");
    if (saved) {
      const f = $("#leadGateForm");
      if (f) {
        if (f.lead_name && !f.lead_name.value) f.lead_name.value = saved.name || "";
        if (f.lead_phone && !f.lead_phone.value) f.lead_phone.value = saved.phone || "";
        if (f.lead_email && !f.lead_email.value) f.lead_email.value = saved.email || "";
      }
    }
  } catch (e) {}
  $("#leadGateScrim").classList.add("on");
  $("#leadGateModal").classList.add("on");
}
function closeLeadGate() {
  const s = $("#leadGateScrim"), m = $("#leadGateModal");
  if (s) s.classList.remove("on");
  if (m) m.classList.remove("on");
}
let PENDING_GATE_ACTION = null;
let GATE_CONTEXT = "";
function requireLeadGate(actionName, callback) {
  GATE_CONTEXT = actionName || "";
  if (LEAD_UNLOCKED && "review" !== actionName && "doc" !== actionName) { callback(); return; }
  PENDING_GATE_ACTION = callback;
  openLeadGate();
}
async function onLeadGateSubmit(ev) {
  ev.preventDefault();
  const form = ev.target;
  const btn = $("#leadGateSubmit", form);
  const data = new FormData(form);
  if (data.get("lead_hp")) { return; }
  if (!data.get("lead_name") || !data.get("lead_phone") || !data.get("lead_consent")) {
    toast(gt("needFields"));
    return;
  }
  data.append("tool_id", CUR ? CUR.id : "");
  data.append("tool_title", CUR ? t(CUR.title) : "");
  data.append("lang", LANG);
  data.append("fields", JSON.stringify(DATA || {}));
  data.append("draft_excerpt", (LAST_DOC || "").slice(0, 600));
  const gateArea = resolveToolArea();
  if (gateArea) data.append("area", gateArea);
  if ("review" === GATE_CONTEXT || "doc" === GATE_CONTEXT) data.append("review_request", "1");
  const endpoint = (window.JusticeAIApp && window.JusticeAIApp.leadEndpoint) || "";
  if (!endpoint) { toast(gt("error")); return; }
  btn.disabled = true; btn.textContent = gt("sending");
  try {
    const r = await fetch(endpoint, { method: "POST", body: data });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error("failed");
    LEAD_UNLOCKED = true;
    try { sessionStorage.setItem("justice_ai_lead_unlocked", "1"); } catch (e) {}
    try { localStorage.setItem("justice_gate_profile", JSON.stringify({ name: data.get("lead_name") || "", phone: data.get("lead_phone") || "", email: data.get("lead_email") || "" })); } catch (e) {}
    closeLeadGate();
    if (PENDING_GATE_ACTION) { const cb = PENDING_GATE_ACTION; PENDING_GATE_ACTION = null; cb(); }
  } catch (e) {
    toast(gt("error"));
  } finally {
    btn.disabled = false; btn.textContent = gt("submit");
  }
}


/* ============================================================
   Marketplace correlation: matched professionals rail.
   Resolves the active tool to a real practice-areas slug (URL
   ?area= wins, then the tool's category/field mapping), fetches
   publicly approved lawyers from the directory REST endpoint and
   renders them with their skills inside the tool sheet. The same
   resolved area is attached to the lead-gate submission so the
   existing classifier + routing engine can route the lead to
   paying lawyers in that area.
   ============================================================ */
const TOOL_CAT_TO_AREA = { family: "family-law", housing: "real-estate-law", work: "labor-law", vehicle: "traffic-law", money: "debt-collection" };
const ARENA_AREA_HE_TO_SLUG = {
  "משפחה וגירושין": "family-law",
  "פלילי ותעבורה": "criminal-law",
  'מקרקעין ונדל"ן': "real-estate-law",
  "עבודה": "labor-law",
  "נזיקין וביטוח לאומי": "torts",
  "חוזים וכספים": "debt-collection"
};

function resolveToolArea() {
  if (window.JUSTICE_AREA_PARAM) return window.JUSTICE_AREA_PARAM;
  if (!CUR) return "";
  const fieldVal = DATA && (DATA.caseArea || DATA.costArea || DATA.arenaArea);
  if (fieldVal && ARENA_AREA_HE_TO_SLUG[fieldVal]) return ARENA_AREA_HE_TO_SLUG[fieldVal];
  return TOOL_CAT_TO_AREA[CUR.cat] || "";
}

const RAIL_I18N = {
  he: { title: "אנשי מקצוע מתאימים מהאינדקס", verified: "מאומת", all: "לכל עורכי הדין בתחום ←", skills: "תחומי עיסוק" },
  en: { title: "Matching professionals from the directory", verified: "Verified", all: "All lawyers in this area ←", skills: "Practice areas" }
};
const railT = (k) => (RAIL_I18N[LANG] || RAIL_I18N.he)[k] || k;

async function renderLawyerRail() {
  const sheet = $("#sheet");
  if (!sheet || !CUR) return;
  const areaSlug = resolveToolArea();
  if (!areaSlug) return;
  const base = (window.JusticeAIApp && window.JusticeAIApp.matchedLawyersEndpoint) || "";
  if (!base) return;
  let data;
  try {
    const r = await fetch(base + (base.indexOf("?") > -1 ? "&" : "?") + "area=" + encodeURIComponent(areaSlug));
    data = await r.json();
  } catch (e) { return; }
  if (!data || !Array.isArray(data.lawyers) || !data.lawyers.length) return;
  if (!CUR) return; /* sheet closed while fetching */

  let rail = $("#lawyerRail", sheet);
  if (!rail) {
    rail = el("div", { id: "lawyerRail", class: "lawyer-rail" });
    const formCol = $(".form-col", sheet);
    if (!formCol) return;
    formCol.append(rail);
  }

  rail.innerHTML =
    '<div class="lawyer-rail__title">' + esc(railT("title")) + "</div>" +
    data.lawyers.map(function (l) {
      return '<a class="lawyer-rail__card" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
        '<div class="lawyer-rail__head"><strong>' + esc(l.name) + "</strong>" +
        (l.verified ? '<span class="lawyer-rail__badge">' + esc(railT("verified")) + "</span>" : "") +
        "</div>" +
        '<span class="lawyer-rail__city">' + esc([l.type, l.city, l.years ? (LANG === "he" ? l.years + " שנות ניסיון" : l.years + " yrs experience") : ""].filter(Boolean).join(" · ")) + "</span>" +
        (l.skills && l.skills.length ? '<div class="lawyer-rail__skills" aria-label="' + esc(railT("skills")) + '">' + l.skills.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>" : "") +
        "</a>";
    }).join("") +
    '<a class="lawyer-rail__all" href="' + esc(data.directory_url || "/lawyers/") + '">' + esc(railT("all")) + "</a>" +
    '<div class="lawyer-rail__join">' + esc(LANG === "he" ? "עורכי דין: מקומות החשיפה בתחום הזה מוגבלים." : "Lawyers: featured slots in this area are limited.") + ' <a href="/lawyer-plans/?plan_interest=featured&utm_source=tools_rail&utm_medium=b2b&utm_campaign=featured_scarcity">' + esc(LANG === "he" ? "הצטרפות ←" : "Join ←") + "</a></div>";
}

/* Refresh the rail when a tool opens and when an area-bearing field changes. */
(function () {
  const origOpenTool = openTool;
  openTool = function (id) {
    COURT_TURN_USED = false;
    origOpenTool(id);
    setTimeout(renderLawyerRail, 60);
    const form = $("#form");
    if (form) {
      form.addEventListener("change", function (e) {
        if (e.target && ["caseArea", "costArea", "arenaArea"].indexOf(e.target.name) > -1) {
          renderLawyerRail();
        }
      });
    }
  };
  /* Deep-linked tools (?tool= from the article mesh) open before this
     wrapper installs; render the rail for an already-open sheet. */
  if (CUR) setTimeout(renderLawyerRail, 60);
}());


/* ============================================================
   Speak to the court: after an AI simulation transcript exists,
   the participant answers the court in their own words (typed or
   dictated via the browser's speech recognition) and receives the
   court's response: one extra generation, clearly limited by the
   same daily AI budget. Voice output uses the browser's built-in
   speech synthesis. Everything runs client-side; no new services.
   ============================================================ */
let COURT_TURN_USED = false;

function renderCourtTurn() {
  const sheet = $("#sheet");
  if (!sheet || $("#courtTurn", sheet)) return;
  const prevCol = $(".prev-col", sheet);
  if (!prevCol) return;
  const he = LANG === "he";
  const box = el("div", { id: "courtTurn", class: "court-turn" });
  box.innerHTML =
    '<strong>' + esc(he ? "התור שלכם: דברו אל בית המשפט" : "Your turn: address the court") + "</strong>" +
    '<p>' + esc(he ? "כתבו או הקליטו את תגובתכם לשאלת בית המשפט, וקבלו את המשך הדיון." : "Type or dictate your reply to the court's question and get the hearing's continuation.") + "</p>" +
    '<textarea id="courtTurnText" rows="3" placeholder="' + esc(he ? "כבודו, לגבי השאלה ששאל בית המשפט…" : "Your honor, regarding the court's question…") + '"></textarea>' +
    '<div class="court-turn__row">' +
    '<button type="button" class="btn" id="courtMicBtn">' + esc(he ? "הקלטה" : "Dictate") + "</button>" +
    '<button type="button" class="btn primary" id="courtRespondBtn">' + esc(he ? "השיבו לבית המשפט" : "Reply to the court") + "</button>" +
    '<button type="button" class="btn" id="courtSpeakBtn">' + esc(he ? "הקראת הדיון" : "Read aloud") + "</button>" +
    "</div>" +
    '<span class="court-turn__note">' + esc(he ? "תור המשך אחד לכל סימולציה, במסגרת מכסת ה-AI היומית." : "One follow-up turn per simulation, within the daily AI budget.") + "</span>";
  prevCol.append(box);

  const micBtn = $("#courtMicBtn", box);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { micBtn.style.display = "none"; }
  else {
    let rec = null, live = false;
    micBtn.onclick = () => {
      if (live && rec) { rec.stop(); return; }
      rec = new SR();
      rec.lang = he ? "he-IL" : "en-US";
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = Array.from(e.results).map((r) => r[0].transcript).join(" ");
        const ta = $("#courtTurnText", box);
        ta.value = (ta.value ? ta.value + " " : "") + t;
      };
      rec.onend = () => { live = false; micBtn.textContent = he ? "הקלטה" : "Dictate"; };
      live = true; micBtn.textContent = he ? "עצירה" : "Stop"; rec.start();
    };
  }

  $("#courtSpeakBtn", box).onclick = () => {
    if (!("speechSynthesis" in window) || !LAST_DOC) return;
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); return; }
    const utter = new SpeechSynthesisUtterance(LAST_DOC.slice(0, 2400));
    utter.lang = he ? "he-IL" : "en-US";
    window.speechSynthesis.speak(utter);
  };

  $("#courtRespondBtn", box).onclick = async () => {
    const ta = $("#courtTurnText", box);
    const said = (ta.value || "").trim();
    if (!said) { toast(he ? "כתבו או הקליטו תגובה קודם." : "Type or dictate a reply first."); return; }
    if (COURT_TURN_USED) { toast(he ? "תור ההמשך נוצל בסימולציה זו." : "The follow-up turn was already used."); return; }
    const btn = $("#courtRespondBtn", box);
    btn.disabled = true; toast(ui("aiWorking"));
    const tail = (LAST_DOC || "").slice(-1400);
    const draft = he
      ? "קטע אחרון מפרוטוקול הסימולציה:\n" + tail + "\n\nדברי המשתתף (" + t(CUR.title) + "):\n\"" + said + "\"\n\nיש להמשיך את התמליל בעברית בלבד: תגובת השופט/ת לדברי המשתתף (2 עד 4 משפטים), תגובת בא כוח הצד שכנגד (2 עד 4 משפטים), שאלה אחת נוספת של בית המשפט אל המשתתף, והערת אימון קצרה למשתתף על איכות תשובתו. פורמט תמליל עם שמות דוברים."
      : "Latest transcript segment:\n" + tail + "\n\nParticipant statement:\n\"" + said + "\"\n\nContinue the transcript: the judge's response (2-4 sentences), opposing counsel's response (2-4 sentences), one further question from the bench to the participant, and a short coaching note on the participant's answer. Transcript format with speaker names.";
    const out = await aiEnhance({ tool: CUR ? CUR.id : "court-arena", lang: LANG, fields: DATA, draft: draft });
    btn.disabled = false;
    if (out && out.text) {
      COURT_TURN_USED = true;
      const sep = he ? "\n\n=== המשך הדיון: תגובת בית המשפט ===\n" : "\n\n=== The hearing continues ===\n";
      LAST_DOC = LAST_DOC + sep + out.text;
      const p = $("#paper");
      if (p) { p.textContent = LAST_DOC; p.scrollTop = p.scrollHeight; }
      ta.value = "";
      btn.textContent = he ? "התור נוצל" : "Turn used";
      toast(ui("aiDone"));
    } else if (out && ["daily_site_limit", "daily_ip_limit", "daily_spend_limit"].includes(out.error)) {
      toast(ui("aiLimit"));
    } else {
      toast(ui("aiOff"));
    }
  };
}
