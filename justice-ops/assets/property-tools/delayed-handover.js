
(function(){
"use strict";
var DOCS=[
{id:"contract",label:"חוזה המכר החתום ונספחיו",sub:"כולל המפרט וכל תוספת שנחתמה."},
{id:"clause",label:"הסעיף בחוזה שקובע את מועד המסירה",sub:"כולל תנאים או הארכות שנכתבו בו, אם יש."},
{id:"notices",label:"הודעות על דחייה במסירה והנימוקים שנמסרו",sub:"מכתבים, דוא״ל או הודעות מהחברה."},
{id:"changes",label:"שינויים ותוספות שביקש הקונה",sub:"בקשות שינוי, הצעות מחיר ואישורים."},
{id:"corr",label:"התכתבות עם החברה",sub:"בכל ערוץ, לפי סדר תאריכים."},
{id:"protocol",label:"פרוטוקול מסירה",sub:"רלוונטי אם הדירה נמסרה."},
{id:"rent",label:"ראיות לשכר דירה של דירה דומה",sub:"מודעות, חוזה שכירות או הערכה."},
{id:"receipts",label:"קבלות על דיור חלופי או אחסון",sub:"שכירות, אחסון ציוד, הובלות."},
{id:"paid",label:"תשלומי פיצוי שכבר התקבלו",sub:"אסמכתאות על סכומים ששולמו, אם שולמו."},
{id:"waiver",label:"בקשה לוויתור או מסמך ויתור שהוצג לחתימה",sub:"גם אם לא נחתם."}
];
var ST={have:"יש בידי",missing:"חסר",na:"לא רלוונטי"};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function pad(n){return (n<10?"0":"")+n;}
function each(l,f){Array.prototype.forEach.call(l,f);}
function civil(y,m,d){return {y:y,m:m,d:d,n:Math.round(Date.UTC(y,m-1,d)/864e5)};}
function todayCivil(){var t=new Date();return civil(t.getFullYear(),t.getMonth()+1,t.getDate());}
function parseDate(s){
s=(s||"").trim();if(!s)return {empty:true};
var y,m,d,r=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
if(r){y=+r[1];m=+r[2];d=+r[3];}
else{r=/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s);if(!r)return {invalid:true};d=+r[1];m=+r[2];y=+r[3];}
if(y<1950||y>2100||m<1||m>12||d<1)return {invalid:true};
if(d>new Date(y,m,0).getDate())return {invalid:true};
return civil(y,m,d);
}
function fmt(c){return pad(c.d)+"."+pad(c.m)+"."+c.y;}

function init(root){
if(root.getAttribute("data-jt-ready"))return;
root.setAttribute("data-jt-ready","1");
var $=function(s){return root.querySelector(s);};
var app=$("[data-jt-app]"),fb=$("[data-jt-fallback]"),form=$("[data-jt-form]"),errsum=$("[data-jt-errsum]"),
result=$("[data-jt-result]"),live=$("[data-jt-live]"),stale=$("[data-jt-stale]"),docsBox=$("[data-jt-docs]"),
actualWrap=$("[data-jt-actual]"),statusFs=$("[data-jt-status-fs]");
var inp={contract:$("#jtdh-contract"),promised:$("#jtdh-promised"),actual:$("#jtdh-actual")};
var dossierText="";

var h="";
DOCS.forEach(function(d,i){
var gid="jtdh-doc-"+d.id;
h+="<div class=\"jt-doc3\" role=\"radiogroup\" aria-labelledby=\""+gid+"-l\" aria-describedby=\""+gid+"-s\"><span class=\"jt-n\" aria-hidden=\"true\">"+pad(i+1)+"</span><div><p><strong id=\""+gid+"-l\">"+esc(d.label)+"</strong><span class=\"jt-sub\" id=\""+gid+"-s\">"+esc(d.sub)+"</span></p><div class=\"jt-seg\">";
["have","missing","na"].forEach(function(k){h+="<label><input type=\"radio\" name=\""+gid+"\" value=\""+k+"\">"+ST[k]+"</label>";});
h+="</div></div></div>";
});
docsBox.innerHTML=h;
app.hidden=false;fb.hidden=true;

function status(){var r=form.querySelector("input[name=jtdh-status]:checked");return r?r.value:"";}
function docState(id){var r=form.querySelector("input[name=jtdh-doc-"+id+"]:checked");return r?r.value:"";}
function syncActual(){actualWrap.hidden=status()!=="delivered";}

function setErr(key,msg){
var el=key==="status"?statusFs:inp[key],e=$("#jtdh-"+key+"-err"),base="jtdh-"+key+"-hint";
if(msg){e.textContent=msg;e.hidden=false;el.setAttribute("aria-invalid","true");el.setAttribute("aria-describedby",base+" jtdh-"+key+"-err");if(key==="status")statusFs.classList.add("jt-invalid");}
else{e.textContent="";e.hidden=true;el.removeAttribute("aria-invalid");el.setAttribute("aria-describedby",base);if(key==="status")statusFs.classList.remove("jt-invalid");}
}
function clearAll(){["contract","promised","status","actual"].forEach(function(k){setErr(k,"");});errsum.hidden=true;errsum.innerHTML="";}

function validate(){
var errs=[],today=todayCivil(),st=status();
var c=parseDate(inp.contract.value),p=parseDate(inp.promised.value),a=null;
var bad="התאריך אינו תקין. הזינו יום, חודש ושנה קיימים (בין 1950 ל-2100).";
if(c.empty)errs.push(["contract","יש להזין את תאריך חתימת החוזה."]);
else if(c.invalid)errs.push(["contract",bad]);
else if(c.n>today.n)errs.push(["contract","תאריך חתימת החוזה הוא בעתיד. בדקו את התאריך."]);
if(p.empty)errs.push(["promised","יש להזין את מועד המסירה שנקבע בחוזה."]);
else if(p.invalid)errs.push(["promised",bad]);
else if(c.n!=null&&p.n<c.n)errs.push(["promised","מועד המסירה שנקבע מוקדם מתאריך חתימת החוזה. בדקו את שני התאריכים."]);
if(!st)errs.push(["status","יש לבחור אם הדירה נמסרה."]);
if(st==="delivered"){
a=parseDate(inp.actual.value);
if(a.empty)errs.push(["actual","יש להזין את תאריך המסירה בפועל."]);
else if(a.invalid)errs.push(["actual",bad]);
else if(a.n>today.n)errs.push(["actual","תאריך המסירה בפועל הוא בעתיד. בדקו את התאריך."]);
else if(c.n!=null&&a.n<c.n)errs.push(["actual","תאריך המסירה בפועל מוקדם מתאריך חתימת החוזה."]);
}
return {errs:errs,c:c,p:p,a:a,st:st,today:today};
}

function showErrors(errs){
var li="";
errs.forEach(function(e){setErr(e[0],e[1]);var target=e[0]==="status"?"jtdh-status-first":"jtdh-"+e[0];li+="<li><a href=\"#"+target+"\" data-jt-goto=\""+target+"\">"+esc(e[1])+"</a></li>";});
errsum.innerHTML="<p>יש לתקן "+(errs.length===1?"שדה אחד":errs.length+" שדות")+" לפני הכנת התיק</p><ul>"+li+"</ul>";
errsum.hidden=false;errsum.focus();
}
errsum.addEventListener("click",function(e){var a=e.target.closest("[data-jt-goto]");if(!a)return;e.preventDefault();var el=root.querySelector("#"+a.getAttribute("data-jt-goto"));if(el)el.focus();});

function build(v){
var delivered=v.st==="delivered",gen=fmt(v.today);
var rows=[{c:v.c,t:"חתימת חוזה המכר",o:0},{c:v.p,t:"מועד המסירה שנקבע בחוזה",o:1}];
if(delivered)rows.push({c:v.a,t:"מסירת הדירה בפועל",o:2});
else rows.push({c:v.today,t:"מועד הפקת התיק - הדירה טרם נמסרה",o:3});
rows.sort(function(x,y){return x.c.n-y.c.n||x.o-y.o;});
var gap;
if(delivered){var g=v.a.n-v.p.n;gap=g>0?"המסירה בפועל מאוחרת ב-"+g+" ימים קלנדריים מהמועד שנקבע בחוזה.":"המסירה בוצעה במועד שנקבע בחוזה או לפניו.";}
else{var g2=v.today.n-v.p.n;gap=g2>0?"חלפו "+g2+" ימים קלנדריים מהמועד שנקבע בחוזה, והדירה טרם נמסרה.":g2===0?"מועד המסירה שנקבע בחוזה הוא היום.":"המועד שנקבע בחוזה טרם הגיע.";}
var have=[],missing=[],unmarked=[],na=[],states={};
DOCS.forEach(function(d){
var s=docState(d.id);
if(!s&&d.id==="protocol"&&!delivered)s="na_auto";
states[d.id]=s;
if(s==="have")have.push(d);else if(s==="missing")missing.push(d);else if(s==="na"||s==="na_auto")na.push(d);else unmarked.push(d);
});
var gaps=missing.concat(unmarked);
var next=gaps.length?"לאתר את: "+gaps[0].label+".":"להביא את הכרונולוגיה, המסמכים והסיכום לפגישה עם עורך דין לבדיקה.";
function stLabel(s){return s==="have"?"יש בידי":s==="missing"?"חסר":s==="na"?"לא רלוונטי":s==="na_auto"?"לא רלוונטי עדיין":"לא סומן";}

var h="<div class=\"jt-rhead\"><p class=\"jt-kicker\">תיק מסמכים · הופק <span class=\"jt-mono\">"+gen+"</span></p>";
h+="<h3 class=\"jt-rtitle\" tabindex=\"-1\" data-jt-rtitle>כרונולוגיה ורשימת מסמכים</h3>";
h+="<p class=\"jt-printonly jt-gap\">מסמך עזר לארגון ראיות. אינו ייעוץ משפטי, אינו חישוב פיצוי ואינו קובע זכויות.</p></div>";
h+="<div class=\"jt-next\"><p class=\"jt-next-label\">הצעד הבא</p><p class=\"jt-next-text\">"+esc(next)+"</p></div>";
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">כרונולוגיה</h4><table class=\"jt-table\"><caption class=\"jt-vh\">כרונולוגיית המועדים שהוזנו</caption><thead><tr><th class=\"jt-n\" scope=\"col\">מס׳</th><th scope=\"col\">תאריך</th><th scope=\"col\">אירוע</th></tr></thead><tbody>";
rows.forEach(function(r,i){h+="<tr><td class=\"jt-n jt-mono\">"+pad(i+1)+"</td><td class=\"jt-mono\">"+fmt(r.c)+"</td><td>"+esc(r.t)+"</td></tr>";});
h+="</tbody></table><p class=\"jt-gap\">"+esc(gap)+" זו ספירת ימים בלבד: היא אינה מביאה בחשבון תנאים בחוזה, דחיות או חישוב פיצוי.</p></div>";
h+="<div class=\"jt-block\"><div class=\"jt-note\"><h4 class=\"jt-h\">מה קובע תאריך החוזה</h4><p>החוזה נחתם ב-<span class=\"jt-mono\">"+fmt(v.c)+"</span>. לפי מועד החתימה בודקים איזו מסגרת חוקית ואיזה נוסח של הוראות הפיצוי חלים. הכלי אינו קובע זאת. <a href=\"#compensation-rules\">ההסבר על כללי הפיצוי לפי מועד החוזה</a> מופיע במאמר.</p></div></div>";
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">מידע שעדיין חסר <span class=\"jt-mono\">("+gaps.length+")</span></h4>";
if(gaps.length){h+="<ul class=\"jt-list\">";gaps.forEach(function(d,i){h+="<li><span class=\"jt-n\">"+pad(i+1)+"</span><span class=\"jt-c\">"+esc(d.label)+"<span class=\"jt-tag"+(states[d.id]==="missing"?" jt-tag--fill":"")+"\">"+stLabel(states[d.id])+"</span></span></li>";});h+="</ul>";}
else h+="<p class=\"jt-none\">כל השורות ברשימה סומנו כקיימות או כלא רלוונטיות.</p>";
h+="</div>";
h+="<div class=\"jt-block\"><h4 class=\"jt-h\">רשימת המסמכים המלאה</h4><ol class=\"jt-list\">";
DOCS.forEach(function(d,i){h+="<li><span class=\"jt-n\">"+pad(i+1)+"</span><span class=\"jt-c\">"+esc(d.label)+"<span class=\"jt-tag"+(states[d.id]==="have"?" jt-tag--fill":"")+"\">"+stLabel(states[d.id])+"</span></span></li>";});
h+="</ol></div>";

var memo=["סיכום עובדתי לקראת התייעצות עם עורך דין - איחור במסירת דירה","טיוטה לעריכה. אינה מכתב דרישה ואינה קובעת זכויות.","","מועדים:"];
rows.forEach(function(r,i){memo.push((i+1)+". "+fmt(r.c)+" - "+r.t);});
memo.push("",gap,"","מסמכים שבידי:",have.length?have.map(function(d){return "- "+d.label;}).join("\n"):"- טרם סומנו","","מסמכים חסרים או שטרם בדקתי:",gaps.length?gaps.map(function(d){return "- "+d.label+" ("+stLabel(states[d.id])+")";}).join("\n"):"- אין");
memo.push("","שאלות לפגישה:","- לפי מועד חתימת החוזה, איזו מסגרת חוקית חלה ומה צריך לבדוק בהתאם?","- האם הודעות הדחייה והנימוקים שנמסרו משפיעים על המועד הקובע?","- האם שינויים שביקשתי משפיעים על מועד המסירה?","- האם תשלומים שקיבלתי או מסמך ויתור שהוצג לי משפיעים על המשך הבירור?","- אילו ראיות נוספות כדאי לאסוף, ובאיזו צורה?","","הערות שלי:","");
var memoText=memo.join("\n");
h+="<div class=\"jt-block\"><h4 class=\"jt-h\"><label for=\"jtdh-memo\">סיכום לפגישה עם עורך דין</label></h4><p class=\"jt-hint jt-noprint\" id=\"jtdh-memo-hint\">טקסט ניטרלי לעריכה חופשית. הוסיפו פרטים משלכם בסוף. שינויים נשמרים רק עד לרענון הדף או להכנה מחדש.</p>";
h+="<textarea id=\"jtdh-memo\" rows=\"18\" aria-describedby=\"jtdh-memo-hint\" data-jt-memo></textarea><pre class=\"jt-memo-print\" data-jt-memo-print aria-hidden=\"true\"></pre></div>";
h+="<div class=\"jt-block jt-noprint\" style=\"border-bottom:0\"><div class=\"jt-actions\"><button type=\"button\" class=\"jt-btn\" data-jt-copy=\"memo\">העתקת הסיכום</button><button type=\"button\" class=\"jt-btn jt-btn--sec\" data-jt-copy=\"dossier\">העתקת הכרונולוגיה והרשימה</button><button type=\"button\" class=\"jt-btn jt-btn--sec\" data-jt-print>הדפסה</button></div><p class=\"jt-status\" aria-live=\"polite\" data-jt-copystatus></p><div data-jt-manual hidden><label class=\"jt-label\" for=\"jtdh-manual\" style=\"margin-top:12px\">טקסט להעתקה ידנית</label><textarea id=\"jtdh-manual\" rows=\"8\" readonly></textarea></div></div>";

var t=["תיק מסמכים - איחור במסירת דירה (הופק "+gen+")","","כרונולוגיה:"];
rows.forEach(function(r,i){t.push((i+1)+". "+fmt(r.c)+" - "+r.t);});
t.push(gap,"","מועד חתימת החוזה קובע איזו מסגרת חוקית יש לבדוק. הכלי אינו קובע זאת.","","מסמכים:");
DOCS.forEach(function(d,i){t.push(pad(i+1)+". "+d.label+" - "+stLabel(states[d.id]));});
t.push("","מידע שעדיין חסר: "+(gaps.length?gaps.map(function(d){return d.label;}).join(", "):"אין"));
return {html:h,memo:memoText,text:t.join("\n"),gaps:gaps.length};
}

form.addEventListener("submit",function(e){
e.preventDefault();clearAll();
var v=validate();
if(v.errs.length){showErrors(v.errs);return;}
var r=build(v);
result.innerHTML=r.html;result.hidden=false;dossierText=r.text;stale.hidden=true;
var ta=result.querySelector("[data-jt-memo]"),pr=result.querySelector("[data-jt-memo-print]");
ta.value=r.memo;pr.textContent=r.memo;
ta.addEventListener("input",function(){pr.textContent=ta.value;});
live.textContent="";
setTimeout(function(){live.textContent="התיק מוכן. "+(r.gaps?("חסר מידע ב-"+r.gaps+" שורות."):"לא חסר מידע ברשימה.");},60);
var tt=result.querySelector("[data-jt-rtitle]");if(tt)tt.focus();
});

form.addEventListener("change",function(e){
if(e.target.name==="jtdh-status"){syncActual();setErr("status","");}
if(e.target.id&&inp[e.target.name]===e.target&&e.target.getAttribute("aria-invalid"))setErr(e.target.name,"");
if(!result.hidden)stale.hidden=false;
});

$("[data-jt-reset]").addEventListener("click",function(){
form.reset();
each(form.querySelectorAll("input"),function(i){if(i.type==="radio"||i.type==="checkbox")i.checked=false;else i.value="";});
clearAll();syncActual();result.innerHTML="";result.hidden=true;dossierText="";stale.hidden=true;
live.textContent="כל הנתונים אופסו.";inp.contract.focus();
});

result.addEventListener("click",function(e){
var b=e.target.closest("button");if(!b)return;
if(b.hasAttribute("data-jt-print")){window.print();return;}
var kind=b.getAttribute("data-jt-copy");if(!kind)return;
var ta=result.querySelector("[data-jt-memo]");
copy(kind==="memo"?ta.value:dossierText,b,kind==="memo"?"הסיכום הועתק ללוח.":"הכרונולוגיה והרשימה הועתקו ללוח.",kind==="memo"?ta:null);
});

function copy(text,btn,okMsg,selectEl){
var st=result.querySelector("[data-jt-copystatus]");
function ok(){result.querySelector("[data-jt-manual]").hidden=true;st.textContent=okMsg;}
function manual(){
var man=result.querySelector("[data-jt-manual]"),ta=selectEl;
if(!ta){ta=man.querySelector("textarea");ta.value=text;man.hidden=false;}
ta.focus();ta.select();
st.textContent="ההעתקה האוטומטית אינה זמינה בדפדפן זה. הטקסט מסומן: העתיקו אותו בעזרת Ctrl+C או ⌘+C.";
}
function legacy(){
var tmp=document.createElement("textarea");tmp.value=text;tmp.setAttribute("readonly","");
tmp.style.position="fixed";tmp.style.top="0";tmp.style.right="0";tmp.style.opacity="0";
root.appendChild(tmp);tmp.select();var s=false;try{s=document.execCommand("copy");}catch(x){s=false;}
root.removeChild(tmp);btn.focus();if(s)ok();else manual();
}
st.textContent="";
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(ok,legacy);}else legacy();
}
syncActual();
}
each(document.querySelectorAll(".jt-property-tool[data-jt-tool=\"delayed-handover\"]"),init);
})();
