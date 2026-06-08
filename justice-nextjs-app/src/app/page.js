'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  // Global Workspace Configuration
  const [userMode, setUserMode] = useState('client'); // 'client' or 'lawyer'
  const [activeTab, setActiveTab] = useState('evaluator'); // 'evaluator', 'auditor', 'precedent'

  // Tab 1: AI Evaluator States
  const [activeStep, setActiveStep] = useState(1);
  const [caseType, setCaseType] = useState('labor'); // 'labor', 'injury', 'divorce', 'real_estate'
  const [selectedCollision, setSelectedCollision] = useState(null); // 'front', 'rear', 'left', 'right'
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [evalProgress, setEvalProgress] = useState([]);

  // Tab 2: Contract Auditor States
  const [contractText, setContractText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // Tab 3: Precedent Finder States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Lawyer Sandbox Portal States
  const [credits, setCredits] = useState(1450);
  const [selectedLead, setSelectedLead] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlockedLeads, setUnlockedLeads] = useState({});
  const swipeHandleRef = useRef(null);
  const startX = useRef(0);

  const mockLeads = [
    {
      id: 'lead_1',
      title: 'תאונת דרכים קשה בצומת גלילות',
      type: 'injury',
      typeLabel: '🏥 נזקי גוף',
      urgency: 'גבוהה',
      value: '₪150,000 - ₪220,000',
      description: 'רכב צד ג׳ נכנס באור אדום בצומת וגרם לפגיעת צד (T-bone). פגיעות מרובות בגב התחתון וצליפת שוט קשה.',
      date: 'לפני 4 דקות',
      bidPrice: 150,
      clientName: 'אלון מזרחי',
      clientPhone: '054-762-9843',
      clientEmail: 'a.mizrachi@gmail.com'
    },
    {
      id: 'lead_2',
      title: 'פיטורין בהריון ללא שימוע',
      type: 'labor',
      typeLabel: '💼 דיני עבודה',
      urgency: 'קריטית',
      value: '₪45,000 - ₪80,000',
      description: 'העסקתי בחברת הייטק מעל שנתיים. פוטרתי במייל בהיותי בחודש חמישי להריון ללא עריכת שימוע וללא היתר ממשרד העבודה.',
      date: 'לפני 18 דקות',
      bidPrice: 90,
      clientName: 'שירה חדד',
      clientPhone: '052-881-2294',
      clientEmail: 'shira.h@gmail.com'
    },
    {
      id: 'lead_3',
      title: 'אי-מסירת דירה בזמן מקבלן',
      type: 'real_estate',
      typeLabel: '🏡 נדל״ן ומקרקעין',
      urgency: 'בינונית',
      value: '₪120,000 (פיצוי סטטוטורי)',
      description: 'איחור במסירת מפתח של 10 חודשים מעבר למועד החוזי בפרויקט מחיר למשתכן. הקבלן מסרב לשלם שכר דירה חלופי.',
      date: 'לפני שעה',
      bidPrice: 180,
      clientName: 'רמי ורד',
      clientPhone: '050-449-3381',
      clientEmail: 'rami.v@gmail.com'
    }
  ];

  // Drag logic for Swipe to Claim Lead
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = startX.current - clientX;
      const maxDrag = 180;
      
      if (delta >= 0 && delta <= maxDrag) {
        setSwipeOffset(delta);
      } else if (delta > maxDrag) {
        setSwipeOffset(maxDrag);
        triggerClaimLead();
        setIsDragging(false);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (swipeOffset < 165) {
          setSwipeOffset(0);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalMouseMove);
      window.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalMouseMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, swipeOffset, selectedLead]);

  const startDrag = (e) => {
    setIsDragging(true);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const triggerClaimLead = () => {
    if (!selectedLead) return;
    if (unlockedLeads[selectedLead.id]) return;

    if (credits < selectedLead.bidPrice) {
      alert('אין מספיק קרדיטים בחשבון. אנא טען קרדיטים נוספים.');
      setSwipeOffset(0);
      return;
    }

    setCredits((prev) => prev - selectedLead.bidPrice);
    setUnlockedLeads((prev) => ({ ...prev, [selectedLead.id]: true }));
    setSwipeOffset(180);
  };

  // Pre-fill accident details from interactive vehicle hotspots
  const handleCollisionSelect = (zone) => {
    setSelectedCollision(zone);
    let autoText = '';
    
    switch (zone) {
      case 'front':
        autoText = 'תאונת דרכים חזיתית עקב אי-שמירת מרחק של הרכב הפוגע, עם נזקי פח משמעותיים בחזית ופגיעה ישירה של כריות האוויר.';
        break;
      case 'rear':
        autoText = 'תאונת דרכים מסוג פגיעה מאחור בזמן עמידה ברמזור אדום. רכב צד ג׳ פגע מאחור בעוצמה גבוהה וגרם לנזק כבד ולפגיעות מסוג צליפת שוט (Whiplash).';
        break;
      case 'left':
        autoText = 'תאונת דרכים מסוג פגיעת צד (T-bone) בצד הנהג בצומת מרומזר עקב כניסת הרכב הפוגע באור אדום, עם פגיעות מרובות וחבלות גוף.';
        break;
      case 'right':
        autoText = 'תאונת דרכים מסוג פגיעת צד בצד הנוסע (ימני) במהלך ניסיון עקיפה פראי של רכב מסחרי, שגרמה לנזק שלדתי לרכב וחבלות קלות.';
        break;
      default:
        break;
    }
    
    setDetails(autoText);
  };

  // Executing dynamic step-by-step evaluator simulation
  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsLoading(true);
    setEvalResult(null);
    setActiveStep(2);
    setEvalProgress([]);

    const timeline = [
      'מפעיל מודל אנליטי משפטי...',
      'סורק תקדימים משפטיים וחוקי יסוד...',
      'מחשב סיכויים ופיצויים משוערים...',
      'מאתר עורכי דין מוסמכים רלוונטיים...'
    ];

    timeline.forEach((msg, idx) => {
      setTimeout(() => {
        setEvalProgress((prev) => [...prev, msg]);
      }, (idx + 1) * 800);
    });

    setTimeout(() => {
      setIsLoading(false);
      let score = 94;
      let estValue = '₪45,000 - ₪75,000';
      let analysisText = 'נמצאה עילת תביעה מוצקה בגין פיטורים שלא כדין והפרת חובת השימוע (סעיף 3 לחוק הודעה מוקדמת). המעסיק לא סיפק התרעה מספקת ולא קיים תיעוד שימוע תקין.';
      let lawyers = [
        { name: 'עו״ד דניאל כהן', role: 'שותף בכיר, דיני עבודה', img: '/lawyer_male.png', exp: '14 שנות ניסיון', rating: '4.9', activeLeads: '98%' },
        { name: 'עו״ד מיטל לוי', role: 'מומחית ליטיגציה וזכויות עובדים', img: '/lawyer_female.png', exp: '9 שנות ניסיון', rating: '4.8', activeLeads: '95%' }
      ];

      if (caseType === 'injury') {
        score = 88;
        estValue = '₪120,000 - ₪250,000';
        analysisText = `ניתוח הנתונים מצביע על רשלנות מסתברת במהלך תאונת הדרכים. זוהתה עילה מוצקה לתביעה בגין כאב וסבל, אובדן כושר עבודה זמני וטיפולים אורתופדיים רלוונטיים. (${selectedCollision === 'rear' ? 'פגיעה ישירה מאחור' : 'פגיעת הדף קשה'})`;
      } else if (caseType === 'divorce') {
        score = 72;
        estValue = 'בהתאם לחלוקת הרכוש המשפחתי';
        analysisText = 'עילת גירושין מוצגת. מומלץ ליזום תביעה למזונות וחלוקת רכוש בבית המשפט למשפחה כדי למנוע את מרוץ הסמכויות מול בית הדין הרבני.';
      } else if (caseType === 'real_estate') {
        score = 91;
        estValue = 'פיצוי מוסכם של 10% משווי העסקה';
        analysisText = 'זוהתה הפרה יסודית של חוזה המכר מצד המוכר עקב אי-עמידה בלוחות זמני המסירה. עילה מלאה להפעלת סעיף הפיצוי המוסכם ללא הוכחת נזק.';
      }

      setEvalResult({
        score,
        estValue,
        analysisText,
        matchedLawyers: lawyers
      });
      setActiveStep(3);
    }, 4000);
  };

  // Executing contract audit simulation
  const handleAudit = (e) => {
    e.preventDefault();
    if (!contractText.trim()) return;

    setIsAuditing(true);
    setAuditResult(null);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        complianceScore: 78,
        issues: [
          { type: 'danger', title: 'העדר הגבלת אחריות הדדית', desc: 'סעיף האחריות מגן על הספק בלבד ויוצר חשיפה משפטית בלתי מוגבלת עבורך במקרה של נזק עקיף.' },
          { type: 'warning', title: 'תניית שיפוט זרה ומקפחת', desc: 'החוזה קובע סמכות שיפוט ייחודית בבית משפט בלונדון. מומלץ לשנות לסמכות ייחודית בבתי המשפט בתל אביב.' },
          { type: 'info', title: 'סעיף חידוש אוטומטי', desc: 'ההסכם מתחדש אוטומטית לשנה נוספת אלא אם תשלח הודעת ביטול 60 יום מראש. מומלץ להוסיף התראה יזומה.' }
        ]
      });
    }, 2500);
  };

  // Executing precedent search simulation
  const handleSearchPrecedent = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResult([
        {
          citation: 'ע״א 8573/25 פלונית נ׳ מדינת ישראל',
          court: 'בית המשפט העליון',
          summary: 'פסק דין תקדימי העוסק ברשלנות רפואית בלידה וקביעת גובה הפיצויים בגין אובדן כושר השתכרות של קטין.',
          status: 'תקדים מחייב'
        },
        {
          citation: 'סעיף 30 לחוק החוזים (חלק כללי), תשל״ג-1973',
          court: 'חקיקה ראשית',
          summary: 'הגדרה וסיווג של חוזה פסול עקב היותו בלתי חוקי, בלתי מוסרי או סותר את תקנת הציבור.',
          status: 'בתוקף'
        }
      ]);
    }, 1800);
  };

  // Translate tab keys to display values
  const getTabLabel = (id) => {
    if (id === 'evaluator') return 'מעריך תביעות AI';
    if (id === 'auditor') return 'סורק ומנתח חוזים';
    return 'מאגר תקדימים וציטוטים';
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic light leak underlays */}
      <div className="light-leak-blue" style={{ top: '-10%', left: '5%' }}></div>
      <div className="light-leak-red" style={{ top: '20%', right: '-5%' }}></div>
      <div className="light-leak-blue" style={{ bottom: '10%', left: '15%' }}></div>

      {/* 1. App Navigation Bar (Apple Frosty Glass) */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '16px 0',
        boxShadow: '0 1px 0 rgba(255,255,255,0.95)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand Logo corresponding to JUS-TICE with red dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: '900', letterSpacing: '0.5px', color: '#1d1d1f', display: 'inline-flex', alignItems: 'center' }}>
              Jus<span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d93838', margin: '0 2px', display: 'inline-block', transform: 'translateY(2px)' }}></span>Tice
            </span>
            <span className="frosty-glass" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.06)', color: '#0066cc', fontWeight: '800', marginRight: '6px' }}>
              פורטל משפטי חכם
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="#workspace" style={{ color: '#1d1d1f', fontSize: '0.95rem', fontWeight: '700', textDecoration: 'none' }}>סביבת עבודה</a>
            <a href="#features" style={{ color: '#6e6e73', fontSize: '0.95rem', textDecoration: 'none' }}>תחומי התמחות</a>
            <a href="#lawyers-directory" style={{ color: '#6e6e73', fontSize: '0.95rem', textDecoration: 'none' }}>עורכי דין מורשים</a>
            
            {/* Quick Switch user mode capsule */}
            <div className="tab-pill-container" style={{ padding: '3px', borderRadius: '10px' }}>
              <button 
                onClick={() => setUserMode('client')} 
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.8rem', 
                  borderRadius: '7px', 
                  border: 'none', 
                  cursor: 'pointer',
                  background: userMode === 'client' ? '#ffffff' : 'transparent',
                  color: userMode === 'client' ? '#1d1d1f' : '#6e6e73',
                  boxShadow: userMode === 'client' ? '0 2px 5px rgba(0,0,0,0.04)' : 'none',
                  fontWeight: '800',
                  transition: '0.3s'
                }}
              >
                👤 אזרח
              </button>
              <button 
                onClick={() => setUserMode('lawyer')} 
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.8rem', 
                  borderRadius: '7px', 
                  border: 'none', 
                  cursor: 'pointer',
                  background: userMode === 'lawyer' ? '#ffffff' : 'transparent',
                  color: userMode === 'lawyer' ? '#1d1d1f' : '#6e6e73',
                  boxShadow: userMode === 'lawyer' ? '0 2px 5px rgba(0,0,0,0.04)' : 'none',
                  fontWeight: '800',
                  transition: '0.3s'
                }}
              >
                💼 עו״ד מורשה
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Header */}
      <header className="container animate-fade-in" style={{ padding: '90px 24px 50px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ marginBottom: '24px', fontSize: '3.4rem', fontWeight: '900' }}>
          הערכה משפטית דיגיטלית.<br />בסטנדרט האפליקציות של Apple.
        </h1>
        <p style={{ color: '#6e6e73', fontSize: '1.25rem', maxWidth: '780px', margin: '0 auto 40px auto', lineHeight: '1.7' }}>
          סורק תביעות וחוזים אוטומטי מבוסס סוכנים חכמים המקשר בין מיוצגים לבין עורכי הדין המובילים בישראל, בהתאמה לתקנות האתיקה והאבטחה.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="#workspace" className="btn btn-primary" style={{ boxShadow: '0 4px 12px rgba(0, 102, 204, 0.15)' }}>
            פתח סביבת עבודה משפטית
          </a>
          <button onClick={() => setUserMode(userMode === 'client' ? 'lawyer' : 'client')} className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <span>מעבר למצב</span>
            <strong>{userMode === 'client' ? 'עורכי דין' : 'אזרחים'}</strong>
          </button>
        </div>
      </header>

      {/* 3. Core AI Workspace Frame (Apple App Shell style) */}
      <section id="workspace" className="container animate-fade-in" style={{ padding: '10px 0 100px 0', position: 'relative', zIndex: 10 }}>
        
        {/* App Frame Wrapper */}
        <div className="app-frame">
          
          {/* Simulated App Title Bar */}
          <div className="app-titlebar">
            <div className="window-dots">
              <div className="window-dot close"></div>
              <div className="window-dot minimize"></div>
              <div className="window-dot maximize"></div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1d1d1f', letterSpacing: '0.5px' }}>
                {userMode === 'client' ? `JUS-TICE CLIENT APP - ${getTabLabel(activeTab)}` : 'JUS-TICE ADVOCATE WORKSPACE - Lead Center'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>חיבור מאובטח SSL</span>
            </div>
          </div>

          <div className="app-inner">
            
            {/* App Sidebar Panel */}
            <aside className="app-sidebar">
              
              {/* User Switch Profile summary card (specular borders) */}
              <div className="frosty-glass" style={{ padding: '16px', borderRadius: '14px', border: '1px solid rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 0.75)', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                {userMode === 'client' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.4rem' }}>👤</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>פרופיל מיוצג</div>
                        <div style={{ fontSize: '0.7rem', color: '#6e6e73', fontWeight: '600' }}>אורח זמני חסוי</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6e6e73', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '8px', marginTop: '8px' }}>
                      הנתונים מוצפנים מקצה לקצה.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <Image src="/lawyer_male.png" alt="עו״ד כהן" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>עו״ד דניאל כהן</div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>משתמש פעיל מורשה</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#1d1d1f', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '8px', marginTop: '8px' }}>
                      <span>יתרת קרדיטים:</span>
                      <strong style={{ color: '#0066cc', marginRight: 'auto' }}>₪{credits}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Menu options based on Mode */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6e6e73', textTransform: 'uppercase', paddingRight: '8px', marginBottom: '4px' }}>
                  תפריט ניווט
                </span>

                {userMode === 'client' ? (
                  <>
                    {[
                      { id: 'evaluator', label: '📊 מעריך תביעות AI', desc: 'Case Evaluator' },
                      { id: 'auditor', label: '🔍 מנתח חוזים AI', desc: 'Contract Auditor' },
                      { id: 'precedent', label: '📖 מאגר תקדימים', desc: 'Precedent Search' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setEvalResult(null); setActiveStep(1); }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(0,0,0,0.02)',
                          cursor: 'pointer',
                          textAlign: 'right',
                          width: '100%',
                          background: activeTab === item.id ? '#ffffff' : 'transparent',
                          boxShadow: activeTab === item.id ? '0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
                          color: activeTab === item.id ? '#1d1d1f' : '#6e6e73',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{item.label}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: '500' }}>{item.desc}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedLead(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        textAlign: 'right',
                        width: '100%',
                        background: !selectedLead ? '#ffffff' : 'transparent',
                        boxShadow: !selectedLead ? '0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
                        color: !selectedLead ? '#1d1d1f' : '#6e6e73',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>📥</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>לוח פניות חמות</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: '500' }}>3 פניות ממתינות</span>
                      </div>
                    </button>

                    <div style={{ margin: '12px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}></div>

                    <div style={{ padding: '0 8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6e6e73', display: 'block', marginBottom: '8px', fontWeight: '800' }}>
                        סטטיסטיקת עורך דין
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="frosty-glass" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)' }}>
                          <div style={{ color: '#6e6e73', fontWeight: '600' }}>המרת לידים</div>
                          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>84.2%</div>
                        </div>
                        <div className="frosty-glass" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)' }}>
                          <div style={{ color: '#6e6e73', fontWeight: '600' }}>דירוג בפורטל</div>
                          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1d1d1f' }}>⭐ 4.93</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </aside>

            {/* App Content Panel */}
            <main className="app-content">
              {isLoading && <div className="lidar-line"></div>}

              {userMode === 'client' ? (
                // ================== CLIENT INTERFACE ==================
                <div>
                  
                  {/* Tab 1: AI Case Evaluator */}
                  {activeTab === 'evaluator' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      
                      {/* Step Wizard Container */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '12%', right: '12%', height: '2px', backgroundColor: 'rgba(0, 0, 0, 0.05)', zIndex: 1 }}>
                          <div style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%', height: '100%', backgroundColor: '#0066cc', transition: 'width 0.4s ease' }}></div>
                        </div>

                        {[
                          { step: 1, label: 'תיאור המקרה' },
                          { step: 2, label: 'ניתוח סוכני AI' },
                          { step: 3, label: 'דיאגנוסטיקה והתאמה' }
                        ].map((s) => (
                          <div key={s.step} style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: activeStep >= s.step ? '#0066cc' : 'rgba(255, 255, 255, 0.95)',
                              border: activeStep >= s.step ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.06)',
                              color: activeStep >= s.step ? '#ffffff' : '#1d1d1f',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              boxShadow: activeStep >= s.step ? '0 4px 10px rgba(0, 102, 204, 0.2)' : 'none',
                              transition: 'all 0.3s ease'
                            }}>
                              {s.step}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: activeStep >= s.step ? '#1d1d1f' : '#6e6e73' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {activeStep === 1 && (
                        <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                          <h3 style={{ textAlign: 'center', color: '#1d1d1f', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '800' }}>הערכת סיכויים משפטיים ראשונית</h3>
                          <p style={{ textAlign: 'center', color: '#6e6e73', fontSize: '0.9rem', marginBottom: '32px' }}>בחר את התחום המשפטי המתאים ומלא את פרטי המקרה.</p>
                          
                          {/* Case category selector */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                            {[
                              { id: 'labor', title: '💼 דיני עבודה', desc: 'פיטורין, זכויות שכר, שימוע' },
                              { id: 'injury', title: '🏥 נזקי גוף ותאונות', desc: 'תאונות דרכים, רשלנות' },
                              { id: 'divorce', title: '⚖️ דיני משפחה', desc: 'גירושין, רכוש, הסכמים' },
                              { id: 'real_estate', title: '🏡 מקרקעין ונדל״ן', desc: 'רכישה, איחורים, קבלן' }
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => { setCaseType(item.id); setSelectedCollision(null); setDetails(''); }}
                                style={{
                                  padding: '18px 12px',
                                  borderRadius: '16px',
                                  border: caseType === item.id ? '2px solid #0066cc' : '1px solid rgba(0, 0, 0, 0.06)',
                                  background: caseType === item.id ? 'rgba(0, 102, 204, 0.04)' : 'rgba(255, 255, 255, 0.75)',
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.01)',
                                  color: '#1d1d1f',
                                  cursor: 'pointer',
                                  transition: 'var(--transition-smooth)',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '500' }}>{item.desc}</div>
                              </button>
                            ))}
                          </div>

                          {/* Conditional render: Interactive Car Collision Scanner */}
                          {caseType === 'injury' && (
                            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', marginBottom: '32px', background: 'rgba(255,255,255,0.5)' }}>
                              <h4 style={{ textAlign: 'center', color: '#1d1d1f', marginBottom: '4px', fontSize: '1.05rem', fontWeight: '800' }}>🚗 סימולטור תאונת דרכים אינטראקטיבי</h4>
                              <p style={{ textAlign: 'center', color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>לחץ על מוקד פגיעת הרכב כדי לטעון את זווית התאונה</p>
                              
                              <div style={{ position: 'relative', width: '220px', height: '390px', margin: '0 auto' }}>
                                {/* High-contrast vector car mockup for light mode */}
                                <svg viewBox="0 0 200 400" width="200" height="400" style={{ display: 'block', margin: '0 auto' }}>
                                  <defs>
                                    <filter id="glow-light">
                                      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                                      <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                      </feMerge>
                                    </filter>
                                  </defs>
                                  {/* Wheels */}
                                  <rect x="25" y="65" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="161" y="65" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="25" y="295" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="161" y="295" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  
                                  {/* Chassis outline */}
                                  <rect x="35" y="20" width="130" height="360" rx="38" fill="rgba(255, 255, 255, 0.75)" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
                                  
                                  {/* Windshield */}
                                  <path d="M 52 125 Q 100 105 148 125 Q 140 155 60 155 Z" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.06)" />
                                  {/* Bonnet Lines */}
                                  <path d="M 60 20 L 70 85 M 140 20 L 130 85" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" />
                                  {/* Rear windshield */}
                                  <path d="M 54 290 Q 100 300 146 290 Q 142 270 58 270 Z" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.06)" />

                                  {/* Highlights active areas based on state */}
                                  <path d="M 45 35 Q 100 12 155 35" fill="none" stroke={selectedCollision === 'front' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="7" filter={selectedCollision === 'front' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 45 365 Q 100 388 155 365" fill="none" stroke={selectedCollision === 'rear' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="7" filter={selectedCollision === 'rear' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 35 110 L 35 270" stroke={selectedCollision === 'left' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="6" filter={selectedCollision === 'left' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 165 110 L 165 270" stroke={selectedCollision === 'right' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="6" filter={selectedCollision === 'right' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                </svg>

                                {/* Absolute positioned Hotspots */}
                                {/* Front Collision */}
                                <div className="radar-hotspot" style={{ top: '15px', left: '93px' }} onClick={() => handleCollisionSelect('front')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'front' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0s', display: selectedCollision === 'front' ? 'block' : 'none' }}></div>
                                </div>
                                {/* Rear Collision */}
                                <div className="radar-hotspot" style={{ top: '355px', left: '93px' }} onClick={() => handleCollisionSelect('rear')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'rear' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0.4s', display: selectedCollision === 'rear' ? 'block' : 'none' }}></div>
                                </div>
                                {/* Driver Left Side */}
                                <div className="radar-hotspot" style={{ top: '185px', left: '26px' }} onClick={() => handleCollisionSelect('left')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'left' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0.8s', display: selectedCollision === 'left' ? 'block' : 'none' }}></div>
                                </div>
                                {/* Passenger Right Side */}
                                <div className="radar-hotspot" style={{ top: '185px', left: '156px' }} onClick={() => handleCollisionSelect('right')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'right' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '1.2s', display: selectedCollision === 'right' ? 'block' : 'none' }}></div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="form-label">
                              {caseType === 'injury' ? 'תיאור נסיבות התאונה והפגיעות (הטקסט נטען אוטומטית לפי מוקד הפגיעה, באפשרותך לערוך):' : 'תאר בפירוט את נסיבות המקרה (עברית):'}
                            </label>
                            <textarea
                              className="form-control"
                              rows="5"
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              placeholder={caseType === 'injury' ? 'בחר מוקד פגיעה ברכב למעלה או הקלד תיאור חופשי...' : 'הזן תאריכים, סכומי שכר, שמות גורמים פוגעים, והשתלשלות האירועים...'}
                              style={{ background: '#ffffff', borderColor: 'rgba(0, 0, 0, 0.08)', fontSize: '0.95rem' }}
                            ></textarea>
                          </div>

                          <button onClick={handleEvaluate} className="btn btn-primary" style={{ width: '100%', fontSize: '1rem', height: '52px' }}>
                            הפעל הערכת סיכויי תביעה
                          </button>
                        </div>
                      )}

                      {activeStep === 2 && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                          <div style={{
                            display: 'inline-block',
                            width: '60px',
                            height: '60px',
                            border: '4px solid rgba(0, 102, 204, 0.1)',
                            borderTop: '4px solid #0066cc',
                            borderRadius: '50%',
                            animation: 'spin 1.2s linear infinite'
                          }}></div>
                          
                          <h4 style={{ color: '#1d1d1f', marginTop: '28px', marginBottom: '16px', fontWeight: '800' }}>סוכני AI מנתחים ומצליבים חקיקה ותקדימים</h4>
                          <div style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'right', background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            {evalProgress.map((prog, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', marginBottom: '10px', color: '#10b981', animation: 'fadeSlideIn 0.3s ease-out' }}>
                                <span>✓</span>
                                <span style={{ color: '#1d1d1f', fontWeight: '600' }}>{prog}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeStep === 3 && evalResult && (
                        <div style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                              <h3 style={{ color: '#1d1d1f', margin: 0, fontSize: '1.35rem', fontWeight: '800' }}>📊 דוח הערכה דיאגנוסטי מבוסס AI</h3>
                              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>נבדק ומבוסס על דיני מדינת ישראל והחלטות בתי המשפט</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: '#6e6e73' }}>סבירות התקבלות התביעה</span>
                                <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.3rem' }}>{evalResult.score}%</div>
                              </div>
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(0, 0, 0, 0.05)', borderTop: '3px solid #0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1d1d1f' }}>
                                {evalResult.score}%
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 10px rgba(0,0,0,0.01)' }}>
                              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>שווי מוערך משוער לתביעה</span>
                              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0066cc', marginTop: '4px' }}>{evalResult.estValue}</div>
                            </div>
                            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 10px rgba(0,0,0,0.01)' }}>
                              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>סיווג עילת תביעה</span>
                              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d1d1f', marginTop: '4px' }}>מבוססת (Prima Facie)</div>
                            </div>
                          </div>

                          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.01)', marginBottom: '32px', lineHeight: '1.8' }}>
                            <h4 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1rem', fontWeight: '800' }}>⚖️ ניתוח משפטי וחוות דעת:</h4>
                            <p style={{ color: '#1d1d1f', margin: 0, fontSize: '0.9rem', lineHeight: '1.7' }}>{evalResult.analysisText}</p>
                          </div>

                          {/* Action controls */}
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => { setDetails(''); setEvalResult(null); setActiveStep(1); }} className="btn btn-outline" style={{ flex: 1 }}>
                              ניתוח חדש
                            </button>
                            <button onClick={() => { alert('פרטי המקרה נשמרו בהצלחה והועברו ללוח הלידים של עורכי הדין בפורטל.'); }} className="btn btn-primary" style={{ flex: 2 }}>
                              העבר את התיק להתאמת עורכי דין מומחים
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Tab 2: AI Contract Auditor */}
                  {activeTab === 'auditor' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {/* Audit Input Form */}
                        <div>
                          <h3 style={{ color: '#1d1d1f', marginBottom: '12px', fontSize: '1.25rem', fontWeight: '800' }}>סריקת ואיתור סיכונים בחוזים</h3>
                          <p style={{ color: '#6e6e73', fontSize: '0.85rem', marginBottom: '20px' }}>הדבק חוזה שכירות, העסקה או שירותים לבדיקה מיידית של סעיפי חשיפה.</p>
                          
                          <form onSubmit={handleAudit}>
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                rows="10"
                                value={contractText}
                                onChange={(e) => setContractText(e.target.value)}
                                placeholder="הדבק כאן את סעיפי החוזה לביצוע הבקרה האוטומטית..."
                                style={{ background: '#ffffff', borderColor: 'rgba(0, 0, 0, 0.08)', lineHeight: '1.6', fontSize: '0.95rem' }}
                                required
                              ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={isAuditing}>
                              {isAuditing ? 'מריץ סימולציות ואיתור סעיפי חשיפה...' : 'נתח סיכונים בחוזה'}
                            </button>
                          </form>
                        </div>

                        {/* Audit Result Display */}
                        <div className="frosty-glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.01)', minHeight: '340px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', paddingBottom: '12px', fontSize: '1.05rem', fontWeight: '800' }}>
                            🔍 דוח איתור סיכוני חשיפה בחוזה
                          </h4>

                          {isAuditing && (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                              <div style={{
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '3px solid rgba(0, 102, 204, 0.1)',
                                borderTop: '3px solid #0066cc',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                              <p style={{ color: '#0066cc', marginTop: '16px', fontSize: '0.85rem', fontWeight: '600' }}>סורק ניסוחים משפטיים מקפחים...</p>
                            </div>
                          )}

                          {!isAuditing && !auditResult && (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6e6e73', fontSize: '0.9rem' }}>
                              הדבק סעיפים משמאל ולחץ על כפתור הסריקה להצגת דוח סיכונים מפורט.
                            </div>
                          )}

                          {!isAuditing && auditResult && (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#6e6e73', fontWeight: '600' }}>מדד תאימות ואבטחת החוזה:</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{auditResult.complianceScore}%</span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {auditResult.issues.map((issue, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      padding: '14px',
                                      borderRadius: '12px',
                                      borderRight: `4px solid ${issue.type === 'danger' ? '#d93838' : issue.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
                                      backgroundColor: 'rgba(244, 245, 248, 0.5)',
                                      border: '1px solid rgba(0,0,0,0.04)',
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    <div style={{ fontWeight: '800', color: '#1d1d1f', marginBottom: '4px' }}>{issue.title}</div>
                                    <div style={{ color: '#6e6e73', fontWeight: '500' }}>{issue.desc}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Precedent & Citation Finder */}
                  {activeTab === 'precedent' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '10px', fontSize: '1.25rem', textAlign: 'center', fontWeight: '800' }}>מאגר תקדימים וביסוס עובדות (Grounded Citations)</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.85rem', textAlign: 'center', marginBottom: '28px' }}>
                        חפש תקדימים מבית המשפט העליון וסעיפי חקיקה ישראלית לביסוס תביעות משפטיות.
                      </p>

                      <form onSubmit={handleSearchPrecedent} style={{ display: 'flex', gap: '12px', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px auto' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="הקלד מילות מפתח (למשל: פיטורים בהריון, פגיעה מאחור ברמזור)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ background: '#ffffff', borderColor: 'rgba(0, 0, 0, 0.08)' }}
                          required
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }} disabled={isSearching}>
                          {isSearching ? 'מחפש...' : 'חפש'}
                        </button>
                      </form>

                      {isSearching && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <div style={{
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            border: '3px solid rgba(0, 102, 204, 0.1)',
                            borderTop: '3px solid #0066cc',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                        </div>
                      )}

                      {!isSearching && searchResult && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '780px', margin: '0 auto' }}>
                          {searchResult.map((res, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 10px rgba(0,0,0,0.01)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4 style={{ color: '#1d1d1f', margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>{res.citation}</h4>
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 102, 204, 0.08)', color: '#0066cc', fontWeight: '800' }}>
                                  {res.status}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6e6e73', marginBottom: '8px', fontWeight: '500' }}>מקור משפטי: {res.court}</div>
                              <p style={{ color: '#1d1d1f', margin: 0, fontSize: '0.85rem', lineHeight: '1.7' }}>{res.summary}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                // ================== LAWYER INTERFACE ==================
                <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                  
                  {!selectedLead ? (
                    <div>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.3rem', fontWeight: '800' }}>📥 מרכז הפניות החמות (Real-Time Leads)</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.85rem', marginBottom: '24px' }}>להלן פניות של מיוצגים שסווגו על ידי ה-AI וממתינים לייצוג או ייעוץ משפטי.</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {mockLeads.map((lead) => {
                          const isClaimed = unlockedLeads[lead.id];
                          return (
                            <div 
                              key={lead.id} 
                              className="glass-panel" 
                              onClick={() => setSelectedLead(lead)}
                              style={{ 
                                padding: '20px', 
                                borderRadius: '16px', 
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                background: '#ffffff',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.01)',
                                cursor: 'pointer',
                                transition: 'var(--transition-smooth)',
                                position: 'relative'
                              }}
                            >
                              {/* Urgency Badge */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: lead.urgency === 'קריטית' ? 'rgba(217, 56, 56, 0.08)' : 'rgba(0, 0, 0, 0.03)', color: lead.urgency === 'קריטית' ? '#d93838' : '#6e6e73', fontWeight: '800' }}>
                                  דחיפות {lead.urgency}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '500' }}>{lead.date}</span>
                              </div>

                              <h4 style={{ color: '#1d1d1f', fontSize: '1.05rem', marginBottom: '8px', fontWeight: '800' }}>{lead.title}</h4>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#0066cc', fontWeight: '800', marginBottom: '12px' }}>
                                <span>{lead.typeLabel}</span>
                                <span>•</span>
                                <span>שווי: {lead.value}</span>
                              </div>

                              <p style={{ color: '#6e6e73', fontSize: '0.8rem', lineHeight: '1.6', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: '500' }}>
                                {lead.description}
                              </p>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '12px', marginTop: '16px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>עלות רכישה: <strong style={{ color: '#1d1d1f', fontWeight: '800' }}>₪{lead.bidPrice}</strong></span>
                                <span style={{ fontSize: '0.8rem', color: isClaimed ? '#10b981' : '#0066cc', fontWeight: '800' }}>
                                  {isClaimed ? '✓ נרכש' : 'פרטים מלאים ←'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // Lead details and claim workflow
                    <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                      <button onClick={() => { setSelectedLead(null); setSwipeOffset(0); }} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', marginBottom: '20px' }}>
                        ← חזרה ללוח פניות
                      </button>

                      <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', border: '1px solid rgba(0, 0, 0, 0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 20px rgba(0,0,0,0.02)', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#0066cc', fontWeight: '800' }}>{selectedLead.typeLabel}</span>
                            <h3 style={{ color: '#1d1d1f', fontSize: '1.4rem', marginTop: '4px', fontWeight: '800' }}>{selectedLead.title}</h3>
                          </div>
                          
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>עלות פנייה זו</div>
                            <strong style={{ fontSize: '1.2rem', color: '#0066cc', fontWeight: '800' }}>₪{selectedLead.bidPrice}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          <div style={{ padding: '16px', backgroundColor: 'rgba(244, 245, 248, 0.5)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.04)', boxShadow: 'inset 0 1px 0 #ffffff' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>שווי מוערך לתביעה</div>
                            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1d1d1f', marginTop: '4px' }}>{selectedLead.value}</div>
                          </div>
                          <div style={{ padding: '16px', backgroundColor: 'rgba(244, 245, 248, 0.5)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.04)', boxShadow: 'inset 0 1px 0 #ffffff' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>רמת דחיפות פנייה</div>
                            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#d93838', marginTop: '4px' }}>{selectedLead.urgency}</div>
                          </div>
                        </div>

                        <div style={{ padding: '20px', backgroundColor: 'rgba(244, 245, 248, 0.5)', borderRadius: '14px', border: '1px solid rgba(0, 0, 0, 0.04)', marginBottom: '32px' }}>
                          <h4 style={{ color: '#1d1d1f', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '800' }}>פירוט נסיבות המקרה (מסווג על ידי AI):</h4>
                          <p style={{ color: '#1d1d1f', fontSize: '0.85rem', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>{selectedLead.description}</p>
                        </div>

                        {/* Claim status / Swipe controller */}
                        {unlockedLeads[selectedLead.id] ? (
                          // Unlocked details view
                          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.03)', boxShadow: '0 4px 10px rgba(16,185,129,0.05)', animation: 'fadeSlideIn 0.4s ease-out' }}>
                            <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '800' }}>
                              <span>✓</span>
                              <span>פרטי קשר פתוחים - Lead Unlocked</span>
                            </h4>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>שם המיוצג:</span>
                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1d1d1f' }}>{selectedLead.clientName}</div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>טלפון נייד:</span>
                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0066cc' }}>{selectedLead.clientPhone}</div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>כתובת דוא״ל:</span>
                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1d1d1f' }}>{selectedLead.clientEmail}</div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                              <a href={`tel:${selectedLead.clientPhone}`} className="btn btn-primary" style={{ flex: 1, height: '42px', padding: '0 20px', fontSize: '0.85rem' }}>
                                חייג עכשיו
                              </a>
                              <a href={`mailto:${selectedLead.clientEmail}`} className="btn btn-outline" style={{ flex: 1, height: '42px', padding: '0 20px', fontSize: '0.85rem' }}>
                                שלח אימייל
                              </a>
                            </div>
                          </div>
                        ) : (
                          // Swipe track to unlock contact
                          <div>
                            <div className="swipe-track" style={{ marginBottom: '16px' }}>
                              <span className="swipe-label" style={{ opacity: isDragging ? 0.3 : 1, transition: '0.2s' }}>
                                החלק שמאלה כדי לרכוש את הפנייה
                              </span>
                              <div 
                                ref={swipeHandleRef}
                                onMouseDown={startDrag}
                                onTouchStart={startDrag}
                                className="swipe-handle" 
                                style={{ 
                                  transform: `translateX(-${swipeOffset}px)`, 
                                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                                }}
                              >
                                <span style={{ transform: 'rotate(180deg)', display: 'inline-block', color: '#ffffff', fontWeight: 'bold' }}>→</span>
                              </div>
                              <div className="swipe-bg" style={{ width: `${swipeOffset}px`, transition: isDragging ? 'none' : 'width 0.3s' }}></div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>
                              רכישת הפנייה תנכה ₪{selectedLead.bidPrice} מיתרת הקרדיטים שלך ותחשוף את פרטי המיוצג באופן מיידי.
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              )}

            </main>
          </div>
        </div>

      </section>

      {/* 4. Bento Grid Practice Areas */}
      <section id="features" className="container" style={{ padding: '40px 24px 80px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            מצוינות משפטית
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#1d1d1f', marginTop: '6px', fontWeight: '900' }}>תחומי התמחות מובילים בפורטל</h2>
        </div>

        <div className="bento-grid">
          {/* Large Bento Box Card */}
          <div className="glass-panel bento-card-large">
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>💼</span>
            <h3 style={{ color: '#1d1d1f', fontSize: '1.45rem', marginBottom: '12px', fontWeight: '800' }}>דיני עבודה וזכויות סוציאליות</h3>
            <p style={{ fontSize: '0.95rem', color: '#6e6e73', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>
              הגנה וייצוג עובדים ומעסיקים: פיטורים שלא כדין, הפרת חובת עריכת שימוע, זכויות סוציאליות, שעות נוספות, והגנה על זכויות נשים ואימהות בעבודה. מלווה בפירוק סעדים וניתוח סיכויים משפטיים.
            </p>
          </div>

          <div className="glass-panel">
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>🏡</span>
            <h3 style={{ color: '#1d1d1f', fontSize: '1.25rem', marginBottom: '12px', fontWeight: '800' }}>נדל״ן ומקרקעין</h3>
            <p style={{ fontSize: '0.85rem', color: '#6e6e73', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
              ליווי עסקאות מכר וקנייה מקבלן או יד שנייה, פרויקטים של התחדשות עירונית (תמ״א 38 ופינוי בינוי) ופתרון סכסוכי ליקויי בנייה ואיחורי מסירה.
            </p>
          </div>

          <div className="glass-panel">
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>🏥</span>
            <h3 style={{ color: '#1d1d1f', fontSize: '1.25rem', marginBottom: '12px', fontWeight: '800' }}>נזקי גוף ותאונות</h3>
            <p style={{ fontSize: '0.85rem', color: '#6e6e73', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
              ייצוג בתביעות פיצויים בגין תאונות דרכים קשות, תאונות עבודה ורשלנות רפואית. שיתוף פעולה עם רופאים מומחים לקביעת אחוזי נכות וגובה הנזק.
            </p>
          </div>

          <div className="glass-panel bento-card-large">
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>⚖️</span>
            <h3 style={{ color: '#1d1d1f', fontSize: '1.45rem', marginBottom: '12px', fontWeight: '800' }}>דיני משפחה וגירושין</h3>
            <p style={{ fontSize: '0.95rem', color: '#6e6e73', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>
              ניהול הליכי גירושין ומשמורת ילדים, הסדרת מזונות, ניסוח הסכמי ממון וחלוקת רכוש בבתי משפט לענייני משפחה ובתי דין רבניים באסטרטגיה חדה.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Verified Lawyers Directory */}
      <section id="lawyers-directory" className="container" style={{ padding: '80px 24px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            בקרה אנושית מוסמכת
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#1d1d1f', marginTop: '6px', fontWeight: '900' }}>עורכי הדין המובילים בפורטל</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Lawyer 1 Card */}
          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #cbd5e1, #0066cc)' }}></div>
            
            <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.05)' }}>
                <Image src="/lawyer_male.png" alt="עו״ד דניאל כהן" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ color: '#1d1d1f', fontSize: '1.2rem', marginBottom: '3px', fontWeight: '800' }}>עו״ד דניאל כהן</h3>
                <div style={{ fontSize: '0.85rem', color: '#0066cc', fontWeight: 'bold' }}>שותף בכיר במחלקת ליטיגציה ונדל״ן</div>
                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '500' }}>חבר לשכת עורכי הדין משנת 2012</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#6e6e73', marginBottom: '20px', lineHeight: '1.6', fontWeight: '500' }}>
              מתמחה בליטיגציה אזרחית מורכבת, עסקאות מקרקעין, הפרות חוזים ודיני עבודה. מלווה לקוחות מוסדיים ופרטיים בבתי משפט.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>⭐ 4.9 (148 חוות דעת)</span>
              <button onClick={() => alert('פנייה ישירה לעו״ד דניאל כהן')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                צור קשר
              </button>
            </div>
          </div>

          {/* Lawyer 2 Card */}
          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #cbd5e1, #0066cc)' }}></div>
            
            <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.05)' }}>
                <Image src="/lawyer_female.png" alt="עו״ד מיטל לוי" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ color: '#1d1d1f', fontSize: '1.2rem', marginBottom: '3px', fontWeight: '800' }}>עו״ד מיטל לוי</h3>
                <div style={{ fontSize: '0.85rem', color: '#0066cc', fontWeight: 'bold' }}>מומחית לדיני משפחה, גירושין וצוואות</div>
                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '500' }}>חברה בלשכת עורכי הדין משנת 2017</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#6e6e73', marginBottom: '20px', lineHeight: '1.6', fontWeight: '500' }}>
              מובילה את תחום דיני המשפחה והסכמי גירושין בפורטל. בעלת מיומנות בניהול תיקים בבתי דין רבניים, הסדרת משמורת ומאבקי רכוש מורכבים.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>⭐ 4.8 (92 חוות דעת)</span>
              <button onClick={() => alert('פנייה ישירה לעו״ד מיטל לוי')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                צור קשר
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Ethics & Security Section */}
      <section id="ethics" className="container" style={{ padding: '60px 24px', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', background: '#ffffff' }}>
          <h2 style={{ color: '#1d1d1f', marginBottom: '20px', fontSize: '1.8rem', fontWeight: '900' }}>תקנות אתיקה ואבטחה מחמירות</h2>
          <p style={{ color: '#6e6e73', fontSize: '1rem', lineHeight: '1.7', marginBottom: '32px', fontWeight: '500' }}>
            JUS-TICE פועל תחת כללי חיסיון עורך-דין לקוח מחמירים. כל הנתונים והחוזים המועלים למערכת מוצפנים מקצה לקצה ואינם משמשים לאימון מודלים ציבוריים. כל המידע נבדק ומבוסס על סעיפי החוק הישראלי ותקדימי בית המשפט העליון.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div className="frosty-glass" style={{ padding: '14px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 #ffffff' }}>
              🔒 הצפנת AES-256 מקצה לקצה
            </div>
            <div className="frosty-glass" style={{ padding: '14px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 #ffffff' }}>
              🇮🇱 מותאם לתקנות לשכת עו״ד בישראל
            </div>
          </div>
        </div>
      </section>

      {/* 7. Floating Interactive macOS Navigation Dock */}
      <div className="floating-dock">
        <div className="dock-item" title="סביבת עבודה AI" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('evaluator'); }}>
          📊
        </div>
        <div className="dock-item" title="סורק חוזים" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('auditor'); }}>
          🔍
        </div>
        <div className="dock-item" title="תקדימים משפטיים" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('precedent'); }}>
          📖
        </div>
        <div className="dock-divider"></div>
        <div className="dock-item" title="תחומי התמחות" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
          💼
        </div>
        <div className="dock-item" title="עורכי דין מומחים" onClick={() => document.getElementById('lawyers-directory')?.scrollIntoView({ behavior: 'smooth' })}>
          👤
        </div>
        <div className="dock-divider"></div>
        <div className="dock-item" title="מעבר מצב משתמש" onClick={() => setUserMode(userMode === 'client' ? 'lawyer' : 'client')}>
          ⚙️
        </div>
      </div>

      {/* 8. Apple-style Silver Footer */}
      <footer style={{ 
        padding: '80px 0 40px 0', 
        backgroundColor: '#e8eaed', 
        color: '#1d1d1f', 
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '50px' }}>
            <div style={{ maxWidth: '400px' }}>
              <h3 style={{ color: '#1d1d1f', marginBottom: '16px', display: 'inline-flex', alignItems: 'center' }}>
                Jus<span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d93838', margin: '0 2px', display: 'inline-block', transform: 'translateY(1px)' }}></span>Tice
              </h3>
              <p style={{ color: '#6e6e73', fontSize: '0.85rem', lineHeight: '1.7', fontWeight: '500' }}>
                שילוב מהפכני בין סוכני בינה מלאכותית אמינים (Fiduciary-Grade AI) וטובי עורכי הדין בישראל להנגשת פתרונות משפטיים מהירים בסטנדרט Apple Design.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1d1d1f', marginBottom: '16px', fontSize: '0.95rem', fontWeight: '800' }}>ניווט מהיר</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                <li><a href="#workspace" style={{ color: '#6e6e73', fontSize: '0.85rem', textDecoration: 'none' }}>סביבת עבודה AI</a></li>
                <li><a href="#lawyers-directory" style={{ color: '#6e6e73', fontSize: '0.85rem', textDecoration: 'none' }}>נבחרת עורכי הדין</a></li>
                <li><a href="#ethics" style={{ color: '#6e6e73', fontSize: '0.85rem', textDecoration: 'none' }}>אבטחה ואתיקה</a></li>
              </ul>
            </div>
          </div>
          
          <hr style={{ borderColor: 'rgba(0, 0, 0, 0.06)', marginBottom: '32px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#6e6e73' }}>
              © {new Date().getFullYear()} JUS-TICE. כל הזכויות שמורות.
            </div>
            <div style={{ fontSize: '0.8rem', color: '#1d1d1f', fontWeight: '600' }}>
              🛡️ נבדק ואושר על ידי עורכי דין מורשים בלשכת עורכי הדין בישראל
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
