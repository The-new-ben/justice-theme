
(function(){
"use strict";
var DOCS=[
{id:"extract",label:"נסח רישום עדכני"},
{id:"contract",label:"ההתחייבות או החוזה שבבסיס ההערה"},
{id:"agreement",label:"הסכם או כתב הסכמה חתום לביטול"},
{id:"request",label:"בקשה ללשכת רישום המקרקעין ואימות חתימות"},
{id:"poa",label:"ייפוי כוח"},
{id:"order",label:"צו שיפוטי לביטול"},
{id:"identity",label:"מסמכי זיהוי וסמכות חתימה"},
{id:"fee",label:"אישור תשלום אגרה לפי דרישת השירות"}
];
var NEED={
consent:{extract:"req",contract:"req",agreement:"req",request:"req",poa:"cond",order:"na",identity:"req",fee:"req"},
court:{extract:"req",order:"req",request:"req",contract:"cond",poa:"cond",agreement:"na",identity:"req",fee:"req"},
dispute:{extract:"req",contract:"req",poa:"cond",agreement:"later",order:"later",request:"later",identity:"later",fee:"later"},
unclear:{extract:"req",contract:"req",poa:"cond",agreement:"later",order:"later",request:"later",identity:"later",fee:"later"}
};
var NEED_TAG={req:"להכנה במסלול זה",cond:"אם מיוצגים או אם רלוונטי",later:"ייתכן שיידרש בהמשך"};
var ROUTE_NAME={consent:"יש הסכמה לביטול",court:"יש צו שיפוטי לביטול",dispute:"אין הסכמה או שהעילה שנויה במחלוקת",unclear:"עוד לא ברור"};
var DOC_ACTION={
extract:"להזמין נסח רישום עדכני של הנכס ולזהות בו את ההערה: מספר שטר, תאריך ולטובת מי נרשמה.",
contract:"לאתר את החוזה או ההתחייבות שבגללם נרשמה ההערה.",
agreement:"לקבל ממי שההערה רשומה לטובתו מסמך הסכמה חתום לביטול, בנוסח שהלשכה או המייצג מאשרים.",
order:"לאתר עותק של הצו השיפוטי, רצוי עותק מאושר, ולוודא שהוא מתייחס להערה הרשומה.",
request:"להכין את טופס הבקשה ללשכת רישום המקרקעין ולתאם אימות חתימות.",
identity:"להכין את מסמכי הזיהוי של החותמים והמגיש, ולברר מסמכי סמכות ותאגיד לפי העניין. אין להעלות מסמכי זיהוי לכלי.",
fee:"לברר את האגרה החלה במסלול הבקשה ולשמור את אישור התשלום."
};
var DONE_ACTION={
consent:"המסמכים העיקריים בידיכם. לוודא מול הלשכה או המייצג את אופן ההגשה ואת דרישות אימות החתימות, ולהגיש את הבקשה.",
court:"המסמכים העיקריים בידיכם. לברר בלשכה מה נדרש כדי לרשום את הצו ולהגיש את הבקשה.",
dispute:"לקבוע פגישה עם עורך דין ולהביא את הנסח ואת ההתחייבות, כדי לבחון איזה הליך מתאים בנסיבות שלכם.",
unclear:"לברר אם מי שההערה רשומה לטובתו מסכים לביטול. התשובה קובעת את המסלול, וכדאי לבחון אותה עם עורך דין."
};
var STEPS={
consent:[
"לבדוק בנסח העדכני את פרטי ההערה: מספר שטר, תאריך, לטובת מי נרשמה, והאם רשומות הערות נוספות על אותה זכות.",
"לוודא שמי שנותן את ההסכמה הוא מי שההערה רשומה לטובתו לפי הנסח, או מי שמוסמך לפעול בשמו.",
"להכין מסמך הסכמה חתום לביטול, בנוסח שהלשכה או המייצג דורשים.",
"למלא את טופס הבקשה ללשכת רישום המקרקעין ולתאם אימות חתימות לפי הנדרש.",
"אם מגישים באמצעות מייצג: לצרף ייפוי כוח.",
"לברר מראש את אופן ההגשה, האם חלה אגרה ומה זמן הטיפול."
],
court:[
"לוודא שהצו מתייחס במפורש להערה הרשומה ולנכס, כפי שהם מופיעים בנסח העדכני.",
"לברר איזה עותק של הצו הלשכה דורשת, והאם נדרש אישור שהצו סופי.",
"להכין בקשה ללשכה לרישום לפי הצו, עם אימות חתימות לפי הנדרש.",
"אם מגישים באמצעות מייצג: לצרף ייפוי כוח.",
"להזמין נסח עדכני סמוך להגשה, כדי לוודא שלא נרשמו שינויים."
],
dispute:[
"לא לפעול לבד מול הנכס או מול הצד השני. מכתב או הודעה אינם מוחקים את ההערה מהמרשם.",
"לאסוף את הנסח, את ההתחייבות שבבסיס ההערה ואת כל ההתכתבות בנושא, לפי סדר תאריכים.",
"לכתוב לעצמכם סיכום קצר של העובדות והמועדים, לשימוש בפגישה עם עורך הדין.",
"לברר עם עורך דין אם בנסיבות שלכם ניתן לפנות לרשם המקרקעין, או שנדרש בירור בבית משפט.",
"לשמור את המסמכים המקוריים ולא לחתום על מסמך חדש בלי ייעוץ."
],
unclear:[
"להזמין נסח עדכני ולזהות בו את ההערה ואת מי שהיא רשומה לטובתו.",
"לאתר את ההתחייבות שבבסיס ההערה ולבדוק אם היא עדיין בתוקף לדעתכם.",
"לברר אם מי שההערה רשומה לטובתו מסכים לביטול, ולתעד את התשובה בכתב.",
"אם יש הסכמה: לחזור לכלי ולבחור את המסלול \"יש הסכמה לביטול\". אם יש מחלוקת: להתייעץ עם עורך דין לפני כל צעד."
]
};
var Q={
consent:[
["ללשכה","איזה נוסח של מסמך הסכמה מתקבל, והאם יש טופס ייעודי?"],
["ללשכה","בפני מי ניתן לאמת את החתימות, והאם נדרשת הופעה אישית?"],
["ללשכה","האם חלה אגרה, ומה זמן הטיפול המשוער?"],
["לעו״ד","האם מי שחותם על ההסכמה מוסמך לכך, למשל כשמדובר בחברה, ביורשים או במיופה כוח?"],
["לעו״ד","האם רשומות על הזכות הערות נוספות שצריך לטפל בהן במקביל?"]
],
court:[
["ללשכה","איזה עותק של הצו נדרש: מקור, עותק מאושר, או גם אישור שהצו סופי?"],
["ללשכה","האם יש לצרף לצו טופס בקשה, ומי רשאי להגיש אותו?"],
["לעו״ד","האם הצו מתאר את ההערה ואת הנכס בדיוק כפי שהם רשומים בנסח?"],
["לעו״ד","האם תלוי הליך או ערעור שמשפיעים על רישום הצו?"]
],
dispute:[
["לעו״ד","בנסיבות שלי, האם ניתן לפנות לרשם המקרקעין, או שנדרש הליך בבית משפט?"],
["לעו״ד","מה מצב ההתחייבות שבבסיס ההערה: האם היא בוטלה, קוימה או שנויה במחלוקת?"],
["לעו״ד","אילו מסמכים והתכתבויות חשוב לשמור, ומה לא לעשות בינתיים?"],
["לעו״ד","האם כדאי לפנות לצד השני בבקשה להסכמה, ובאיזה אופן?"]
],
unclear:[
["לעו״ד","על סמך הנסח וההתחייבות, איזה מסלול רלוונטי במקרה שלי?"],
["לעו״ד","את מי צריך לשאול אם הוא מסכים לביטול, ואיך לתעד את התשובה?"],
["ללשכה","אילו מסמכים הלשכה דורשת בכל מסלול?"]
]
};
var RANK={req:0,cond:1,later:2};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function pad(n){return (n<10?"0":"")+n;}
function today(){var t=new Date();return pad(t.getDate())+"."+pad(t.getMonth()+1)+"."+t.getFullYear();}
function each(list,fn){Array.prototype.forEach.call(list,fn);}

function init(root){
if(root.getAttribute("data-jt-ready"))return;
root.setAttribute("data-jt-ready","1");
var $=function(s){return root.querySelector(s);};
var app=$("[data-jt-app]"),fb=$("[data-jt-fallback]"),form=$("[data-jt-form]"),errsum=$("[data-jt-errsum]"),
routeFs=$("[data-jt-route-fs]"),routeErr=$("[data-jt-route-err]"),result=$("[data-jt-result]"),
live=$("[data-jt-live]"),stale=$("[data-jt-stale]");
app.hidden=false;fb.hidden=true;
var lastText="";

function getRoute(){var r=form.querySelector("input[name=jtwn-route]:checked");return r?r.value:"";}
function getDocs(){var o={};each(form.querySelectorAll("input[name=jtwn-doc]"),function(c){o[c.value]=c.checked;});return o;}

function clearErrors(){errsum.hidden=true;errsum.innerHTML="";routeErr.hidden=true;routeErr.textContent="";routeFs.classList.remove("jt-invalid");routeFs.setAttribute("aria-describedby","jtwn-route-hint");routeFs.removeAttribute("aria-invalid");}
function showRouteError(){
var msg="יש לבחור מסלול כדי להכין רשימה.";
routeErr.textContent=msg;routeErr.hidden=false;routeFs.classList.add("jt-invalid");
routeFs.setAttribute("aria-describedby","jtwn-route-hint jtwn-route-err");routeFs.setAttribute("aria-invalid","true");
errsum.innerHTML="<p>לא ניתן להכין רשימה עדיין</p><ul><li><a href=\"#jtwn-route-first\" data-jt-goto=\"jtwn-route-first\">"+esc(msg)+"</a></li></ul>";
errsum.hidden=false;errsum.focus();
}
errsum.addEventListener("click",function(e){var a=e.target.closest("[data-jt-goto]");if(!a)return;e.preventDefault();var el=root.querySelector("#"+a.getAttribute("data-jt-goto"));if(el)el.focus();});

function build(route,docs){
var need=NEED[route],missing=[],have=[];
DOCS.forEach(function(d){var n=need[d.id];if(docs[d.id])have.push(d);else if(n!=="na")missing.push({d:d,n:n});});
missing.sort(function(a,b){return RANK[a.n]-RANK[b.n];});
var firstReq=null;missing.some(function(m){if(m.n==="req"&&DOC_ACTION[m.d.id]){firstReq=m.d.id;return true;}return false;});
var next=firstReq?DOC_ACTION[firstReq]:DONE_ACTION[route];
var reqMissing=missing.filter(function(m){return m.n==="req";}).length;
var dispute=route==="dispute"||route==="unclear";
var date=today();
var h="";
h+="<div class=\"jt-rhead\"><p class=\"jt-kicker\">רשימת הכנה · מסלול: "+esc(ROUTE_NAME[route])+" · <span class=\"jt-mono\">"+date+"</span></p>";
h+="<h3 class=\"jt-rtitle\" tabindex=\"-1\" data-jt-rtitle>רשימת ההכנה שלכם</h3>";
h+="<p class=\"jt-printonly jt-have\">מסמך עזר לארגון מסמכים. אינו ייעוץ משפטי ואינו בקשה לביטול.</p></div>";
h+="<div class=\"jt-next\"><p class=\"jt-next-label\">הצעד הבא</p><p class=\"jt-next-text\">"+esc(next)+"</p></div>";
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">רשימת ההכנה למסלול</h4><ol class=\"jt-list\">";
STEPS[route].forEach(function(s,i){h+="<li><span class=\"jt-n\">"+pad(i+1)+"</span><span class=\"jt-c\">"+esc(s)+"</span></li>";});
h+="</ol></div>";
if(dispute){
h+="<div class=\"jt-note\" style=\"margin-top:20px;margin-bottom:20px\"><h4 class=\"jt-h\">כשאין הסכמה ברורה</h4><p>מכתב, התראה או הודעה לצד השני אינם מוחקים בעצמם את ההערה מהמרשם. האם רשם המקרקעין יכול לטפל בבקשה, או שנדרש בירור בבית משפט, תלוי בנסיבות. אל תפעלו בכוחות עצמכם מול הנכס או הצד השני לפני שבדקתם זאת עם עורך דין.</p></div>";
}
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">מסמכים חסרים <span class=\"jt-mono\">("+missing.length+")</span></h4>";
if(missing.length){h+="<ul class=\"jt-list\">";missing.forEach(function(m,i){h+="<li><span class=\"jt-n\">"+pad(i+1)+"</span><span class=\"jt-c\">"+esc(m.d.label)+"<span class=\"jt-tag"+(m.n==="req"?" jt-tag--fill":"")+"\">"+esc(NEED_TAG[m.n])+"</span></span></li>";});h+="</ul>";}
else h+="<p class=\"jt-none\">לא חסרים מסמכים מתוך הרשימה למסלול זה.</p>";
h+="<p class=\"jt-have\">כבר בידיכם: "+(have.length?esc(have.map(function(d){return d.label;}).join(" · ")):"לא סומנו מסמכים")+"</p></div>";
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">שאלות לעורך הדין או ללשכה</h4><ol class=\"jt-list\">";
Q[route].forEach(function(q,i){h+="<li><span class=\"jt-n\">"+pad(i+1)+"</span><span class=\"jt-c\"><span class=\"jt-tag\" style=\"margin:0 0 0 8px\">"+esc(q[0])+"</span>"+esc(q[1])+"</span></li>";});
h+="</ol></div>";
h+="<div class=\"jt-block jt-noprint\" style=\"border-bottom:0\"><div class=\"jt-actions\"><button type=\"button\" class=\"jt-btn\" data-jt-copy>העתקת רשימת ההכנה</button><button type=\"button\" class=\"jt-btn jt-btn--sec\" data-jt-print>הדפסה</button></div>";
h+="<p class=\"jt-status\" aria-live=\"polite\" data-jt-copystatus></p>";
h+="<div class=\"jt-manual\" data-jt-manual hidden><label for=\"jtwn-manual\">טקסט להעתקה ידנית</label><textarea id=\"jtwn-manual\" rows=\"8\" readonly></textarea></div></div>";

var t=["רשימת הכנה לביטול הערת אזהרה ("+date+")","מסלול שנבחר: "+ROUTE_NAME[route],"","הצעד הבא:",next,"","רשימת ההכנה:"];
STEPS[route].forEach(function(s,i){t.push((i+1)+". "+s);});
if(dispute){t.push("","חשוב: מכתב או הודעה לצד השני אינם מוחקים בעצמם את ההערה. האם הרשם יכול לטפל בבקשה או שנדרש בירור בבית משפט תלוי בנסיבות.");}
t.push("","מסמכים חסרים:");
if(missing.length)missing.forEach(function(m,i){t.push((i+1)+". "+m.d.label+" ("+NEED_TAG[m.n]+")");});else t.push("אין");
t.push("","כבר בידי: "+(have.length?have.map(function(d){return d.label;}).join(", "):"לא סומנו מסמכים"),"","שאלות:");
Q[route].forEach(function(q,i){t.push((i+1)+". ["+q[0]+"] "+q[1]);});
t.push("","הרשימה נועדה לארגון מסמכים בלבד. היא אינה ייעוץ משפטי ואינה בקשה לביטול ההערה.");
return {html:h,text:t.join("\n"),missing:missing.length,reqMissing:reqMissing};
}

form.addEventListener("submit",function(e){
e.preventDefault();clearErrors();
var route=getRoute();
if(!route){showRouteError();return;}
var r=build(route,getDocs());
result.innerHTML=r.html;result.hidden=false;lastText=r.text;stale.hidden=true;
live.textContent="";
setTimeout(function(){live.textContent="רשימת ההכנה מוכנה. "+(r.missing?("חסרים "+r.missing+" מסמכים."):"לא חסרים מסמכים מהרשימה.");},60);
var tt=result.querySelector("[data-jt-rtitle]");if(tt)tt.focus();
});

form.addEventListener("change",function(e){
if(e.target.name==="jtwn-route"&&!routeErr.hidden)clearErrors();
if(!result.hidden)stale.hidden=false;
});

$("[data-jt-reset]").addEventListener("click",function(){
form.reset();clearErrors();result.innerHTML="";result.hidden=true;lastText="";stale.hidden=true;
live.textContent="הבחירות אופסו.";
var f=root.querySelector("#jtwn-route-first");if(f)f.focus();
});

result.addEventListener("click",function(e){
var btn=e.target.closest("button");if(!btn)return;
if(btn.hasAttribute("data-jt-print")){window.print();return;}
if(btn.hasAttribute("data-jt-copy")){copy(lastText,btn);}
});

function copy(text,btn){
var st=result.querySelector("[data-jt-copystatus]"),man=result.querySelector("[data-jt-manual]"),ta=man.querySelector("textarea");
function ok(){man.hidden=true;st.textContent="רשימת ההכנה הועתקה ללוח.";}
function manual(){ta.value=text;man.hidden=false;ta.focus();ta.select();st.textContent="ההעתקה האוטומטית אינה זמינה בדפדפן זה. הטקסט מסומן למטה: העתיקו אותו בעזרת Ctrl+C או ⌘+C.";}
function legacy(){
var tmp=document.createElement("textarea");tmp.value=text;tmp.setAttribute("readonly","");
tmp.style.position="fixed";tmp.style.top="0";tmp.style.right="0";tmp.style.opacity="0";
root.appendChild(tmp);tmp.select();var s=false;try{s=document.execCommand("copy");}catch(x){s=false;}
root.removeChild(tmp);btn.focus();if(s)ok();else manual();
}
st.textContent="";
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(ok,legacy);}else legacy();
}
}
each(document.querySelectorAll(".jt-property-tool[data-jt-tool=\"warning-note\"]"),init);
})();
