'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Header from '@/app/components/Header';
import { 
  BriefcaseIcon, 
  MedicalIcon, 
  BalanceIcon, 
  HomeIcon, 
  UserIcon, 
  ChartIcon, 
  SearchIcon, 
  BookIcon, 
  BoltIcon, 
  GearIcon, 
  CourtIcon, 
  ClockIcon, 
  LockIcon, 
  StarIcon, 
  CheckIcon, 
  ArrowLeftIcon, 
  PhoneIcon, 
  MailIcon 
} from './icons';

const mockLeads = [
  {
    id: 'lead_1',
    title: 'תאונת דרכים קשה בצומת גלילות',
    type: 'personal-injury-law',
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
    type: 'labor-law',
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
    type: 'real-estate-law',
    typeLabel: '🏡 נדל״ן ומקרקעין',
    urgency: 'בינונית',
    value: '₪120,000 (פיצוי סטטוטורי)',
    description: 'איחור במסירת מפתח של 10 חודשים מעבר למועד החוזי בפרויקט מחיר למשתכן. הקבלן מסרס לשלם שכר דירה חלופי.',
    date: 'לפני שעה',
    bidPrice: 180,
    clientName: 'רמי ורד',
    clientPhone: '050-449-3381',
    clientEmail: 'rami.v@gmail.com'
  }
];

export default function Home() {
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'evaluator': return 'מעריך סיכויים AI';
      case 'national_insurance': return 'ביטוח לאומי - בדיקת ערעור';
      case 'severance': return 'מחשבון פיצויי פיטורין ומיסוי';
      case 'auditor': return 'בקרת חוזים וחשיפות';
      case 'precedent': return 'מנוע חיפוש תקדימים';
      case 'legal_tech_hub': return 'כלים משפטיים דיגיטליים';
      default: return '';
    }
  };

  // Global Workspace Configuration
  const [userMode, setUserMode] = useState('client'); // 'client' or 'lawyer'
  const [activeTab, setActiveTab] = useState('evaluator'); // 'evaluator', 'national_insurance', 'severance', 'auditor', 'precedent', 'legal_tech_hub'

  // Tab 1: AI Evaluator States
  const [activeStep, setActiveStep] = useState(1);
  const [caseType, setCaseType] = useState('labor-law'); // 'labor-law', 'personal-injury-law', 'family-law', 'real-estate-law', 'criminal-law', 'medical-malpractice-law'
  const [selectedCollision, setSelectedCollision] = useState(null); // 'front', 'rear', 'left', 'right'
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [evalProgress, setEvalProgress] = useState([]);

  // Tab 2: Bituach Leumi appeal calculator state
  const [blCategory, setBlCategory] = useState('general_invalidity'); 
  const [blIncome, setBlIncome] = useState(6000);
  const [blAge, setBlAge] = useState(30);
  const [blConditions, setBlConditions] = useState([]); 
  const [blResult, setBlResult] = useState(null);
  const [blLoading, setBlLoading] = useState(false);
  const [blName, setBlName] = useState('');
  const [blPhone, setBlPhone] = useState('');
  const [blEmail, setBlEmail] = useState('');
  const [blLeadSubmitted, setBlLeadSubmitted] = useState(false);

  // Tab 3: Severance Pay & Tax-Back Calculator state
  const [sevStartDate, setSevStartDate] = useState('2023-01-01');
  const [sevEndDate, setSevEndDate] = useState('2026-01-01');
  const [sevSalary, setSevSalary] = useState(10000);
  const [sevReason, setSevReason] = useState('dismissal'); 
  const [sevPensionRate, setSevPensionRate] = useState(6); 
  const [sevSection14, setSevSection14] = useState(true);
  const [sevResult, setSevResult] = useState(null);
  const [sevLoading, setSevLoading] = useState(false);
  const [sevName, setSevName] = useState('');
  const [sevPhone, setSevPhone] = useState('');
  const [sevEmail, setSevEmail] = useState('');
  const [sevLeadSubmitted, setSevLeadSubmitted] = useState(false);

  // Tab 4: Contract Auditor States
  const [contractText, setContractText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // Tab 5: Precedent Finder States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Tab 6: Legal Tech Embed Showcase & Hub state
  const [activeEmbedTool, setActiveEmbedTool] = useState('court_tracker'); 
  // 1. Net HaMishpat tracker
  const [caseSearchNum, setCaseSearchNum] = useState('');
  const [caseSearchLoading, setCaseSearchLoading] = useState(false);
  const [caseSearchResult, setCaseSearchResult] = useState(null);
  // 2. Notary Digital Signer
  const [notarySignName, setNotarySignName] = useState('');
  const [notarySignRole, setNotarySignRole] = useState('declarant');
  const [notarySigned, setNotarySigned] = useState(false);
  const [notaryLoading, setNotaryLoading] = useState(false);
  const [notaryDocId, setNotaryDocId] = useState('');
  const [signaturePaths, setSignaturePaths] = useState([]);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const signatureCanvasRef = useRef(null);
  // 3. Small Claims Claim Form Generator
  const [scClaimant, setScClaimant] = useState('');
  const [scDefendant, setScDefendant] = useState('');
  const [scAmount, setScAmount] = useState(10000);
  const [scSubject, setScSubject] = useState('goods_service'); 
  const [scDetails, setScDetails] = useState('');
  const [scResultDoc, setScResultDoc] = useState(null);
  const [scLoading, setScLoading] = useState(false);
  const [scLeadSubmitted, setScLeadSubmitted] = useState(false);
  // 4. Land Registry (Tabu) search simulator
  const [tabuBlock, setTabuBlock] = useState('');
  const [tabuParcel, setTabuParcel] = useState('');
  const [tabuLoading, setTabuLoading] = useState(false);
  const [tabuResult, setTabuResult] = useState(null);

  // Lawyer Sandbox Portal States
  const [credits, setCredits] = useState(1450);
  const [selectedLead, setSelectedLead] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlockedLeads, setUnlockedLeads] = useState({});
  const swipeHandleRef = useRef(null);
  const startX = useRef(0);

  // Checkout alerts
  const [checkoutNotice, setCheckoutNotice] = useState(null);

  // Persistent Lead Database
  const [leads, setLeads] = useState([]);

  // Load leads from localStorage on mount, seed if empty
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('justice_leads');
      setTimeout(() => {
        if (stored) {
          try {
            setLeads(JSON.parse(stored));
          } catch (e) {
            setLeads(mockLeads);
          }
        } else {
          setLeads(mockLeads);
          localStorage.setItem('justice_leads', JSON.stringify(mockLeads));
        }
      }, 0);
    }
  }, []);


  // Check for successful Stripe redirect session parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const mockAmount = params.get('mock_amount');
      const mockType = params.get('mock_type');

      if (sessionId) {
        // Trigger simulated database update
        if (mockAmount) {
          const added = Number(mockAmount);
          setTimeout(() => {
            if (mockType === 'credits') {
              setCredits(prev => prev + added);
              setCheckoutNotice({
                type: 'success',
                title: 'הטעינה הושלמה בהצלחה',
                message: `₪${added} נוספו ליתרת הקרדיטים של חשבון עורך הדין שלך. (מזהה: ${sessionId.slice(0, 15)})`
              });
            } else if (mockType === 'document_review') {
              setCheckoutNotice({
                type: 'success',
                title: 'התשלום התקבל בהצלחה',
                message: 'מכתב הדרישה נשלח לסקירת עורך דין מוסמך. תקבל עדכון במייל בתוך 24 שעות.'
              });
            }
          }, 0);
        }
        
        // Clean URL params to prevent repeated triggers
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  const saveLeadsToStorage = (updatedLeads) => {
    setLeads(updatedLeads);
    if (typeof window !== 'undefined') {
      localStorage.setItem('justice_leads', JSON.stringify(updatedLeads));
    }
  };

  const handleLeadSubmit = async (leadData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const updated = [data.lead, ...leads];
        saveLeadsToStorage(updated);
      } else {
        // Fallback local persistence if API error
        const localLead = {
          id: `lead_${Date.now()}`,
          ...leadData,
          date: 'הרגע',
          payment_status: 'pending',
          lead_status: 'new'
        };
        const updated = [localLead, ...leads];
        saveLeadsToStorage(updated);
      }
    } catch (e) {
      console.warn('Leads API offline, falling back to storage:', e);
      const localLead = {
        id: `lead_${Date.now()}`,
        ...leadData,
        date: 'הרגע',
        payment_status: 'pending',
        lead_status: 'new'
      };
      const updated = [localLead, ...leads];
      saveLeadsToStorage(updated);
    }
  };

  // Payment checkout trigger
  const triggerPayment = async (amount, name, type, meta = {}) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          name,
          successUrl: window.location.origin + window.location.pathname,
          cancelUrl: window.location.href,
          metadata: {
            ...meta,
            type,
            amount
          }
        })
      });
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirect to checkout (real Stripe or local sandbox success path)
        window.location.href = data.url;
      } else {
        alert('שגיאה ביצירת תהליך תשלום.');
      }
    } catch (e) {
      alert('חיבור השרת לתשלומים נכשל.');
    }
  };

  const triggerClaimLead = useCallback(() => {
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
  }, [selectedLead, unlockedLeads, credits]);

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
  }, [isDragging, swipeOffset, selectedLead, triggerClaimLead]);

  const startDrag = (e) => {
    setIsDragging(true);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
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
        { name: 'עו״ד דניאל כהן', role: 'שותף בכיר, דיני עבודה', img: '/lawyer_male_premium.png', exp: '14 שנות ניסיון', rating: '4.9', activeLeads: '98%' },
        { name: 'עו״ד מיטל לוי', role: 'מומחית ליטיגציה וזכויות עובדים', img: '/lawyer_female_premium.png', exp: '9 שנות ניסיון', rating: '4.8', activeLeads: '95%' }
      ];

      if (caseType === 'personal-injury-law') {
        score = 88;
        estValue = '₪120,000 - ₪250,000';
        analysisText = `ניתוח הנתונים מצביע על רשלנות מסתברת במהלך תאונת הדרכים. זוהתה עילה מוצקה לתביעה בגין כאב וסבל, אובדן כושר עבודה זמני וטיפולים אורתופדיים רלוונטיים. (${selectedCollision === 'rear' ? 'פגיעה ישירה מאחור' : 'פגיעת הדף קשה'})`;
      } else if (caseType === 'family-law') {
        score = 72;
        estValue = 'בהתאם לחלוקת הרכוש המשפחתי';
        analysisText = 'עילת גירושין מוצגת. מומלץ ליזום תביעה למזונות וחלוקת רכוש בבית המשפט למשפחה כדי למנוע את מרוץ הסמכויות מול בית הדין הרבני.';
      } else if (caseType === 'real-estate-law') {
        score = 91;
        estValue = 'פיצוי מוסכם של 10% משווי העסקה';
        analysisText = 'זוהתה הפרה יסודית של חוזה המכר מצד המוכר עקב אי-עמידה בלוחות זמני המסירה. עילה מלאה להפעלת סעיף הפיצוי המוסכם ללא הוכחת נזק.';
      } else if (caseType === 'criminal-law') {
        score = 95;
        estValue = 'ייעוץ וייצוג פלילי מיידי';
        analysisText = 'זוהה חשד לעבירה פלילית או זימון לחקירה באזהרה. מומלץ לפנות מיידית לעורך דין פלילי מומחה טרם מסירת גרסה ראשונית במשטרה. זכות השתיקה מחייבת התייעצות.';
      } else if (caseType === 'medical-malpractice-law') {
        score = 85;
        estValue = '₪350,000 - ₪800,000 (בכפוף לחוות דעת רופא)';
        analysisText = 'נמצאה עילה לכאורה לרשלנות רפואית עקב חריגה מסטנדרט הטיפול הסביר. יש להזמין חוות דעת מרופא מומחה להוכחת הקשר הסיבתי והנזק.';
      }

      setEvalResult({
        score,
        estValue,
        analysisText,
        matchedLawyers: lawyers
      });
      setActiveStep(3);

      // Map dynamic label
      let label = '💼 דיני עבודה';
      if (caseType === 'personal-injury-law') label = '🏥 נזקי גוף';
      else if (caseType === 'family-law') label = '⚖️ דיני משפחה';
      else if (caseType === 'real-estate-law') label = '🏡 נדל״ן';
      else if (caseType === 'criminal-law') label = '🛡️ פלילי';
      else if (caseType === 'medical-malpractice-law') label = '🩺 רשלנות רפואית';

      // Create new lead in queue
      handleLeadSubmit({
        title: `הערכת AI - ${label.split(' ')[1]}`,
        type: caseType,
        typeLabel: label,
        urgency: score > 80 ? 'גבוהה' : 'בינונית',
        value: estValue,
        description: `נסיבות המקרה: ${details}. ניתוח AI מראה הסתברות הצלחה של ${score}%. הופק דוח מלא.`,
        clientName: 'משתמש אנונימי',
        clientPhone: '054-000-0000',
        clientEmail: 'client-ai@justice.co.il',
        bidPrice: score > 90 ? 120 : 80
      });
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

  // Bituach Leumi Calculator Logic
  const handleConditionsChange = (cond) => {
    if (blConditions.includes(cond)) {
      setBlConditions(blConditions.filter(c => c !== cond));
    } else {
      setBlConditions([...blConditions, cond]);
    }
  };

  const calculateBituachLeumi = (e) => {
    e.preventDefault();
    if (!blName || !blPhone || !blEmail) {
      alert('נא למלא שם, טלפון ואימייל כדי לקבל את הדוח המלא.');
      return;
    }
    setBlLoading(true);
    setBlResult(null);

    setTimeout(() => {
      let percentages = [];
      if (blConditions.includes('orthopedic')) percentages.push(20);
      if (blConditions.includes('neurological')) percentages.push(30);
      if (blConditions.includes('cardiac')) percentages.push(25);
      if (blConditions.includes('respiratory')) percentages.push(20);
      if (blConditions.includes('mental')) percentages.push(20);
      if (blConditions.includes('diabetes')) percentages.push(10);
      if (blConditions.includes('sensory')) percentages.push(15);

      percentages.sort((a, b) => b - a);

      let currentWeight = 100;
      let totalPercentage = 0;
      percentages.forEach(p => {
        let added = (currentWeight * p) / 100;
        totalPercentage += added;
        currentWeight -= added;
      });

      const medicalPercent = Math.round(totalPercentage);

      let qualifying = false;
      let capacityLoss = 0;
      let monthlyAllowance = 0;

      if (blCategory === 'general_invalidity') {
        const hasMajorCondition = percentages.some(p => p >= 25);
        if (medicalPercent >= 60 || (medicalPercent >= 40 && hasMajorCondition)) {
          if (blIncome < 6700) {
            qualifying = true;
            capacityLoss = 100;
            monthlyAllowance = 4291; 
          }
        }
      } else if (blCategory === 'work_injury') {
        qualifying = medicalPercent >= 9;
        if (medicalPercent >= 20) {
          monthlyAllowance = Math.round(blIncome * 0.75 * (medicalPercent / 100));
        } else if (medicalPercent >= 9) {
          monthlyAllowance = Math.round(blIncome * 0.75 * 43 * (medicalPercent / 100));
        }
      } else {
        qualifying = medicalPercent >= 50;
        if (qualifying) {
          monthlyAllowance = blCategory === 'child' ? 3400 : 2500;
        }
      }

      const expectedLawyerFee = qualifying 
        ? Math.round(blCategory === 'work_injury' && medicalPercent < 20 ? monthlyAllowance * 0.15 : monthlyAllowance * 12 * 0.13)
        : 0;

      const result = {
        medicalPercent,
        qualifying,
        capacityLoss,
        monthlyAllowance,
        expectedLawyerFee,
        category: blCategory,
        conditionsCount: percentages.length
      };

      setBlResult(result);
      setBlLoading(false);

      handleLeadSubmit({
        title: `תביעת ביטוח לאומי - ${blCategory === 'general_invalidity' ? 'נכות כללית' : blCategory === 'work_injury' ? 'נפגעי עבודה' : 'ילד נכה/ניידות'}`,
        type: 'national_insurance',
        typeLabel: '🏛️ ביטוח לאומי',
        urgency: result.medicalPercent > 50 ? 'גבוהה' : 'בינונית',
        value: qualifying 
          ? (blCategory === 'work_injury' && medicalPercent < 20 
              ? `מענק חד פעמי: ₪${monthlyAllowance.toLocaleString()}` 
              : `קצבה חודשית: ₪${monthlyAllowance.toLocaleString()}/חודש`)
          : 'לבדיקה נוספת',
        description: `תובע/ת בגיל ${blAge} עם הכנסה חודשית של ₪${blIncome.toLocaleString()}. נבחרו ${result.conditionsCount} ליקויים רפואיים. הערכת נכות רפואית: ${result.medicalPercent}%. ${qualifying ? 'נמצאה זכאות לקצבה' : 'דרוש סיוע משפטי לעמידה בסף הזכאות'}.`,
        clientName: blName,
        clientPhone: blPhone,
        clientEmail: blEmail,
        bidPrice: blCategory === 'work_injury' ? 140 : 100
      });

      setBlLeadSubmitted(true);
    }, 2000);
  };

  // Severance Pay & Tax-Back Calculator Logic
  const calculateSeverance = (e) => {
    e.preventDefault();
    if (!sevName || !sevPhone || !sevEmail) {
      alert('נא למלא שם, טלפון ואימייל כדי לקבל את הדוח המלא.');
      return;
    }
    setSevLoading(true);
    setSevResult(null);

    setTimeout(() => {
      const start = new Date(sevStartDate);
      const end = new Date(sevEndDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = diffDays / 365.25;

      const grossSeverance = Math.round(sevSalary * years);
      let pensionOffset = 0;
      let additionalEmployerPayout = grossSeverance;

      if (sevSection14) {
        pensionOffset = Math.round(grossSeverance * (sevPensionRate / 8.33));
        if (pensionOffset > grossSeverance) pensionOffset = grossSeverance;
        additionalEmployerPayout = Math.max(0, grossSeverance - pensionOffset);
      }

      const taxExemptLimit = Math.round(13750 * years);
      const taxableAmount = Math.max(0, grossSeverance - taxExemptLimit);
      const estimatedTax = Math.round(taxableAmount * 0.20); 

      const letterText = `לכבוד:
[שם המעסיק/החברה]
[כתובת המעסיק]

הנדון: דרישה לתשלום פיצויי פיטורין והפרשי שכר עבור מר/גב' ${sevName}

1. הריני לפנות אליך בשם מר/גב' ${sevName} (להלן: "מרשי/מרשתי") בעניין סיום העסקתו/ה במשרדכם.
2. מרשי/מרשתי הועסק/ה במשרדכם החל מיום ${new Date(sevStartDate).toLocaleDateString('he-IL')} ועד ליום ${new Date(sevEndDate).toLocaleDateString('he-IL')}, תקופה של כ-${years.toFixed(2)} שנים.
3. בגין תקופה זו, זכאי/ת מרשי/מרשתי לפיצויי פיטורין מלאים לפי חוק פיצויי פיטורים, תשכ"ג-1963, בסך של ₪${grossSeverance.toLocaleString()} ברוטו (מבוסס על שכר אחרון בסך ₪${sevSalary.toLocaleString()}).
4. ${sevSection14 ? `על פי סעיף 14 לחוק, הופקדו כספים בקופת הפיצויים בסך ₪${pensionOffset.toLocaleString()} (שיעור הפקדה של ${sevPensionRate}%), ועל כן נותרת יתרת חוב לתשלום ישיר בסך ₪${additionalEmployerPayout.toLocaleString()} ברוטו.` : 'היות ולא חל סעיף 14 על ההעסקה, הנכם נדרשים לשלם את מלוא פיצויי הפיטורין בסך ₪' + grossSeverance.toLocaleString() + ' ברוטו.'}
5. לאור האמור לעיל, הנכם נדרשים להסדיר את תשלום יתרת הפיצויים ולמסור טופס 161 חתום ואישור שחרור כספי פיצויים בתוך 15 ימים ממועד מכתבי זה.
6. ככל שלא יוסדר התשלום האמור, יאלץ מרשי/מרשתי לפנות לערכאות המשפטיות המוסמכות (בית הדין האזורי לעבודה) לתביעת פיצויי פיטורים, פיצויי הלנת פיצויים והוצאות משפט.

בכבוד רב,
${sevName}
`;

      const result = {
        years,
        grossSeverance,
        pensionOffset,
        additionalEmployerPayout,
        taxExemptLimit,
        taxableAmount,
        estimatedTax,
        letterText
      };

      setSevResult(result);
      setSevLoading(false);

      handleLeadSubmit({
        title: `חישוב פיצויי פיטורין - ${sevReason === 'dismissal' ? 'פיטורים' : 'התפטרות מזכה'}`,
        type: 'labor',
        typeLabel: '💼 דיני עבודה',
        urgency: 'גבוהה',
        value: `סכום פיצויים: ₪${grossSeverance.toLocaleString()}`,
        description: `עובד/ת עם שכר של ₪${sevSalary.toLocaleString()} הועסק/ה כ-${years.toFixed(2)} שנים. סיבת סיום: ${sevReason}. יתרת פיצויים ישירה מהמעסיק: ₪${additionalEmployerPayout.toLocaleString()}. נוצר מכתב התראה מקדים.`,
        clientName: sevName,
        clientPhone: sevPhone,
        clientEmail: sevEmail,
        bidPrice: 110
      });

      setSevLeadSubmitted(true);
    }, 2000);
  };

  // Case search Net HaMishpat simulator
  const handleCaseSearch = (e) => {
    e.preventDefault();
    if (!caseSearchNum.trim()) return;
    caseSearchLoading(true);
    caseSearchNum(null);

    setTimeout(() => {
      setCaseSearchLoading(false);
      setCaseSearchResult({
        caseNum: caseSearchNum,
        court: 'בית הדין האזורי לעבודה תל אביב',
        judge: 'כבוד השופטת מיכל לוי-שרון',
        plaintiff: 'אלון מזרחי',
        defendant: 'אקמי טכנולוגיות בע״מ',
        subject: 'פיצויי פיטורין והלנת שכר',
        status: 'תיק פעיל - בשמיעה',
        lastAction: 'הוגשו תצהירי עדות ראשית מטעם התובע',
        nextHearing: '14/09/2026 10:00 (הוכחות)'
      });
    }, 1500);
  };

  // Notary Digital Signer drawing functions
  const startDrawing = (e) => {
    setIsDrawingSignature(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setSignaturePaths([[x, y]]);
  };

  const draw = (e) => {
    if (!isDrawingSignature) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const lastPoint = signaturePaths[signaturePaths.length - 1];
    if (lastPoint) {
      ctx.moveTo(lastPoint[0], lastPoint[1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    setSignaturePaths([...signaturePaths, [x, y]]);
  };

  const stopDrawing = () => {
    setIsDrawingSignature(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignaturePaths([]);
    setNotarySigned(false);
  };

  const handleNotarySign = (e) => {
    e.preventDefault();
    if (!notarySignName.trim()) {
      alert('נא להזין שם מלא לחתימה.');
      return;
    }
    setNotaryLoading(true);
    setNotarySigned(false);

    setTimeout(() => {
      setNotaryLoading(false);
      setNotarySigned(true);
      setNotaryDocId(`NOTARY-POA-${Math.floor(100000 + Math.random() * 900000)}-IL`);
    }, 2000);
  };

  // Small Claims Form Generator Logic
  const handleSmallClaimsGenerate = (e) => {
    e.preventDefault();
    if (!scClaimant || !scDefendant || !scDetails) {
      alert('נא למלא את כל השדות החיוניים.');
      return;
    }
    if (scAmount > 38900) {
      alert('סכום התביעה המקסימלי בבית המשפט לתביעות קטנות הוא ₪38,900 (לשנת 2025/2026). נא לעדכן את הסכום.');
      return;
    }
    setScLoading(true);
    setScResultDoc(null);

    setTimeout(() => {
      const docId = `SC-${Math.floor(10000 + Math.random() * 90000)}`;
      const docContent = `בבית משפט לתביעות קטנות ב- [שם עיר מגורי התובע]

תיק מספר: ______________

התובע/ת: ${scClaimant}
הנתבע/ת: ${scDefendant}

כתב תביעה

סכום התביעה: ₪${scAmount.toLocaleString()}

1. התובע/ת הינו/ה אדם פרטי אשר התקשר בעסקה עם הנתבע/ת בעניין ${scSubject === 'goods_service' ? 'מוצרים/שירותים' : scSubject === 'apartment_rental' ? 'שכירות דירה' : scSubject === 'vehicle_damage' ? 'נזק לרכב' : 'אחר'}.
2. נסיבות המקרה כפי שמתאר התובע/ת:
   ${scDetails}
3. הנתבע/ת הפר/ה את התחייבויותיו/ה כלפי התובע/ת וגרם/ה לנזקים כספיים ועוגמת נפש רבה.
4. למרות פניות חוזרות ונשנות של התובע/ת, סירב/ה הנתבע/ת לפצותו/ה.
5. לאור האמור לעיל, מבוקש מבית המשפט הנכבד לחייב את הנתבע/ת לשלם לתובע/ת את סכום התביעה בסך ₪${scAmount.toLocaleString()} בתוספת ריבית והצמדה והוצאות משפט.

תאריך: ${new Date().toLocaleDateString('he-IL')}                         חתימת התובע: ________________
`;
      setScResultDoc({ docId, docContent });
      setScLoading(false);

      handleLeadSubmit({
        title: `תביעה קטנה - ${scSubject === 'goods_service' ? 'מוצרים ושירותים' : 'נזקים וחוזים'}`,
        type: 'small_claims',
        typeLabel: '⚖️ תביעות קטנות',
        urgency: 'בינונית',
        value: `סכום: ₪${scAmount.toLocaleString()}`,
        description: `תובע: ${scClaimant} נגד נתבע: ${scDefendant}. סכום תביעה מבוקש: ₪${scAmount.toLocaleString()}. סיווג: ${scSubject}. הופק כתב תביעה טיוטה.`,
        clientName: scClaimant,
        clientPhone: '052-111-2222', 
        clientEmail: `${scClaimant.replace(/\s+/g, '')}@gmail.com`,
        bidPrice: 75
      });
      setScLeadSubmitted(true);
    }, 2000);
  };

  // Land Registry (Tabu) search simulator
  const handleTabuSearch = (e) => {
    e.preventDefault();
    if (!tabuBlock || !tabuParcel) return;
    setTabuLoading(true);
    setTabuResult(null);

    setTimeout(() => {
      setTabuLoading(false);
      setTabuResult({
        block: tabuBlock,
        parcel: tabuParcel,
        address: 'רחוב רוטשילד 48, תל אביב-יפו',
        owner: 'מיינדספייס נדל״ן בע״מ (בעלות מלאה 100%)',
        rightsType: 'בעלות רשמית רשומה',
        area: '124 מ״ר',
        caveats: 'רשומה הערת אזהרה לטובת בנק לאומי לישראל בע״מ בגין משכנתא בסך ₪1,850,000.',
        dateGenerated: new Date().toLocaleDateString('he-IL')
      });
    }, 1800);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic light leak underlays */}
      <div className="light-leak-blue" style={{ top: '-10%', left: '5%' }}></div>
      <div className="light-leak-red" style={{ top: '20%', right: '-5%' }}></div>
      <div className="light-leak-blue" style={{ bottom: '10%', left: '15%' }}></div>

      {/* Checkout simulated alert */}
      {checkoutNotice && (
        <div className="container animate-fade-in" style={{ padding: '20px 24px 0 24px', position: 'relative', zIndex: 1000 }}>
          <div className="glass-panel" style={{ background: '#ffffff', borderColor: '#10b981', display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px' }}>
            <span style={{ fontSize: '1.6rem', color: '#10b981' }}><CheckIcon /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '900', color: '#1d1d1f' }}>{checkoutNotice.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#6e6e73', marginTop: '2px' }}>{checkoutNotice.message}</div>
            </div>
            <button onClick={() => setCheckoutNotice(null)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>סגור</button>
          </div>
        </div>
      )}

      {/* 1. App Navigation Bar */}
      <Header />

      {/* 2. Hero Header */}
      <header className="container animate-fade-in" style={{ padding: '90px 24px 50px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ marginBottom: '24px', fontSize: '3.8rem', fontWeight: '900', letterSpacing: '-1.8px' }}>
          הכוח המשפטי שלך.<br />מהיר, שקוף ומדויק.
        </h1>
        <p style={{ color: '#6e6e73', fontSize: '1.25rem', maxWidth: '840px', margin: '0 auto 40px auto', lineHeight: '1.75', fontWeight: '500' }}>
          טכנולוגיית AI מהפכנית להערכת סיכויי תביעה, ניתוח חוזים ואימות מסמכים. ללא סימני שאלה. ללא עיכובים. חיבור ישיר לנבחרת עורכי הדין המובילה בישראל.
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

      {/* 2.5 Customer Intake Strip (Original WordPress Vibe) */}
      <section className="container animate-fade-in" style={{ padding: '20px 24px 40px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0066cc', opacity: 0.15 }}>01</span>
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,102,204,0.05)', color: '#0066cc', fontSize: '0.72rem', fontWeight: '800' }}>אפיון AI מהיר</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1d1d1f' }}>אני צריך עורך דין עכשיו</h3>
              <p style={{ fontSize: '0.85rem', color: '#6e6e73', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
                השאירו פרטים ותיאור מקרה. המערכת תבצע אבחון AI ראשוני ותכוון את פנייתכם בצורה מסודרת לעורך הדין המתאים ביותר.
              </p>
            </div>
            <button onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('evaluator'); setUserMode('client'); }} className="btn btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px', width: '100%' }}>
              שליחת פנייה משפטית ←
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0066cc', opacity: 0.15 }}>02</span>
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,102,204,0.05)', color: '#0066cc', fontSize: '0.72rem', fontWeight: '800' }}>מדריכים ותקדימים</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1d1d1f' }}>אני רוצה להבין את התחום</h3>
              <p style={{ fontSize: '0.85rem', color: '#6e6e73', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
                עברו למאגר המידע המקצועי ותקדימי בתי המשפט לפני פנייה לעו״ד: זכויות עובדים, ביטוח לאומי, נזיקין, משפחה ונדל״ן.
              </p>
            </div>
            <button onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('precedent'); setUserMode('client'); }} className="btn btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px', width: '100%' }}>
              קריאת מדריכים ותקדימים ←
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0066cc', opacity: 0.15 }}>03</span>
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,102,204,0.05)', color: '#0066cc', fontSize: '0.72rem', fontWeight: '800' }}>השוואת מומחים</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1d1d1f' }}>אני רוצה להשוות עורכי דין</h3>
              <p style={{ fontSize: '0.85rem', color: '#6e6e73', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
                חפשו במאגר הפרופילים, בדקו תחומי התמחות, ניסיון מקצועי ודירוג של עורכי דין מורשים, ופנו ישירות למי שמתאים לכם.
              </p>
            </div>
            <a href="#lawyers-directory" className="btn btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px', width: '100%', textDecoration: 'none', textAlign: 'center' }}>
              חיפוש עורכי דין ←
            </a>
          </div>

        </div>
      </section>

      {/* 3. Core Workspace Shell */}
      <section id="workspace" className="container animate-fade-in" style={{ padding: '10px 0 100px 0', position: 'relative', zIndex: 10 }}>
        
        <div className="app-frame">
          
          <div className="app-titlebar">
            <div className="window-dots">
              <div className="window-dot close"></div>
              <div className="window-dot minimize"></div>
              <div className="window-dot maximize"></div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1d1d1f', letterSpacing: '0.5px' }}>
                {userMode === 'client' ? `JUS-TICE FrontDesk - ${getTabLabel(activeTab)}` : 'JUS-TICE Advocate Terminal - Lead Ingestion'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>SSL SECURED CONNECTION</span>
            </div>
          </div>

          <div className="app-inner">
            
            <aside className="app-sidebar">
              
              <div className="frosty-glass" style={{ padding: '16px', borderRadius: '14px', border: '1px solid rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 0.75)', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                {userMode === 'client' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <UserIcon style={{ color: '#0066cc', width: '22px', height: '22px' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>פרופיל אזרח</div>
                        <div style={{ fontSize: '0.7rem', color: '#6e6e73', fontWeight: '600' }}>זמני חסוי</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6e6e73', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '8px', marginTop: '8px' }}>
                      מידע מוגן AES-256.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <Image src="/lawyer_male_premium.png" alt="עו״ד כהן" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>עו״ד דניאל כהן</div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>חיבור מורשה לשכת עו״ד</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '8px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#1d1d1f' }}>
                        <span>יתרת קרדיטים:</span>
                        <strong style={{ color: '#0066cc' }}>₪{credits}</strong>
                      </div>
                      <button 
                        onClick={() => triggerPayment(150, 'טעינת 100 קרדיטים - פורטל Jus-Tice', 'credits', { lawyerId: 'lawyer_daniel' })}
                        className="btn btn-primary" 
                        style={{ padding: '6px 0', fontSize: '0.75rem', height: '28px', borderRadius: '6px', width: '100%', marginTop: '4px' }}
                      >
                        טען קרדיטים
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6e6e73', textTransform: 'uppercase', paddingRight: '8px', marginBottom: '4px' }}>
                  כלים זמינים
                </span>

                {userMode === 'client' ? (
                  <>
                    {[
                      { id: 'evaluator', label: 'מעריך תביעות AI', desc: 'Case Evaluation', icon: <ChartIcon /> },
                      { id: 'national_insurance', label: 'מחשבון ביטוח לאומי', desc: 'Disability Appeals', icon: <CourtIcon /> },
                      { id: 'severance', label: 'פיצויים ומכתבי התראה', desc: 'Labor Severance', icon: <BriefcaseIcon /> },
                      { id: 'auditor', label: 'סורק ומנתח חוזים', desc: 'Contract Audit', icon: <SearchIcon /> },
                      { id: 'precedent', label: 'מאגר תקדימים', desc: 'Citations Search', icon: <BookIcon /> },
                      { id: 'legal_tech_hub', label: 'שער LegalTech', desc: 'Government API Gateway', icon: <BoltIcon /> }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
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
                        <span style={{ color: activeTab === item.id ? '#0066cc' : '#86868b' }}>{item.icon}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{item.label}</span>
                          <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: '500' }}>{item.desc}</span>
                        </div>
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
                        gap: '12px',
                        padding: '12px 14px',
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
                      <BoltIcon style={{ color: !selectedLead ? '#0066cc' : '#86868b' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>לוח פניות חמות</span>
                        <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: '500' }}>{leads.length} פניות ממתינות</span>
                      </div>
                    </button>

                    <div style={{ margin: '12px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}></div>

                    <div style={{ padding: '0 8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6e6e73', display: 'block', marginBottom: '8px', fontWeight: '800' }}>
                        סטטיסטיקות עורכי דין
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="frosty-glass" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)' }}>
                          <div style={{ color: '#6e6e73', fontWeight: '600' }}>המרת פניות</div>
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

            <main className="app-content">
              {(isLoading || blLoading || sevLoading || caseSearchLoading || notaryLoading || scLoading || tabuLoading) && <div className="lidar-line"></div>}

              {userMode === 'client' ? (
                // ================== CLIENT INTERFACE ==================
                <div>
                  
                  {/* Tab 1: AI Case Evaluator */}
                  {activeTab === 'evaluator' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      
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
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                            {[
                              { id: 'labor-law', title: 'דיני עבודה', desc: 'פיטורין, זכויות שכר, שימוע', icon: <BriefcaseIcon /> },
                              { id: 'personal-injury-law', title: 'נזקי גוף ותאונות', desc: 'תאונות דרכים, רשלנות', icon: <MedicalIcon /> },
                              { id: 'family-law', title: 'דיני משפחה', desc: 'גירושין, רכוש, הסכמים', icon: <BalanceIcon /> },
                              { id: 'real-estate-law', title: 'מקרקעין ונדל״ן', desc: 'רכישה, איחורים, קבלן', icon: <HomeIcon /> },
                              { id: 'criminal-law', title: 'דין פלילי', desc: 'חקירות, מעצרים, רישום פלילי', icon: <LockIcon /> },
                              { id: 'medical-malpractice-law', title: 'רשלנות רפואית', desc: 'אבחון, ניתוחים, לידה', icon: <CourtIcon /> }
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
                                <span style={{ color: caseType === item.id ? '#0066cc' : '#86868b', marginBottom: '8px', display: 'block' }}>{item.icon}</span>
                                <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '500' }}>{item.desc}</div>
                              </button>
                            ))}
                          </div>

                          {caseType === 'personal-injury-law' && (
                            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', marginBottom: '32px', background: 'rgba(255,255,255,0.5)' }}>
                              <h4 style={{ textAlign: 'center', color: '#1d1d1f', marginBottom: '4px', fontSize: '1.05rem', fontWeight: '800' }}>🚗 סימולטור תאונת דרכים אינטראקטיבי</h4>
                              <p style={{ textAlign: 'center', color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>לחץ על מוקד פגיעת הרכב כדי לטעון את זווית התאונה</p>
                              
                              <div style={{ position: 'relative', width: '220px', height: '390px', margin: '0 auto' }}>
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
                                  <rect x="25" y="65" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="161" y="65" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="25" y="295" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  <rect x="161" y="295" width="14" height="38" rx="6" fill="#1d1d1f" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                                  
                                  <rect x="35" y="20" width="130" height="360" rx="38" fill="rgba(255, 255, 255, 0.75)" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
                                  
                                  <path d="M 52 125 Q 100 105 148 125 Q 140 155 60 155 Z" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.06)" />
                                  <path d="M 60 20 L 70 85 M 140 20 L 130 85" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" />
                                  <path d="M 54 290 Q 100 300 146 290 Q 142 270 58 270 Z" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.06)" />

                                  <path d="M 45 35 Q 100 12 155 35" fill="none" stroke={selectedCollision === 'front' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="7" filter={selectedCollision === 'front' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 45 365 Q 100 388 155 365" fill="none" stroke={selectedCollision === 'rear' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="7" filter={selectedCollision === 'rear' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 35 110 L 35 270" stroke={selectedCollision === 'left' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="6" filter={selectedCollision === 'left' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                  <path d="M 165 110 L 165 270" stroke={selectedCollision === 'right' ? '#d93838' : 'rgba(0,0,0,0.06)'} strokeWidth="6" filter={selectedCollision === 'right' ? 'url(#glow-light)' : ''} style={{ transition: '0.3s' }} />
                                </svg>

                                <div className="radar-hotspot" style={{ top: '15px', left: '93px' }} onClick={() => handleCollisionSelect('front')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'front' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0s', display: selectedCollision === 'front' ? 'block' : 'none' }}></div>
                                </div>
                                <div className="radar-hotspot" style={{ top: '355px', left: '93px' }} onClick={() => handleCollisionSelect('rear')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'rear' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0.4s', display: selectedCollision === 'rear' ? 'block' : 'none' }}></div>
                                </div>
                                <div className="radar-hotspot" style={{ top: '185px', left: '26px' }} onClick={() => handleCollisionSelect('left')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'left' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '0.8s', display: selectedCollision === 'left' ? 'block' : 'none' }}></div>
                                </div>
                                <div className="radar-hotspot" style={{ top: '185px', left: '156px' }} onClick={() => handleCollisionSelect('right')}>
                                  <div className="radar-dot" style={{ backgroundColor: selectedCollision === 'right' ? '#d93838' : '#cbd5e1' }}></div>
                                  <div className="radar-pulse" style={{ animationDelay: '1.2s', display: selectedCollision === 'right' ? 'block' : 'none' }}></div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="form-label">
                              {caseType === 'injury' ? 'תיאור נסיבות התאונה והפגיעות (נטען אוטומטית לפי מוקד פגיעת הרכב, באפשרותך לערוך):' : 'תאר בפירוט את נסיבות המקרה (עברית):'}
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
                            הפעל הערכת סיכויי תביעה מבוססת AI
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
                              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '600' }}>נבדק ומבוסס על דיני ישראל והחלטות בתי המשפט</span>
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

                          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', marginBottom: '32px' }}>
                            <h4 style={{ color: '#1d1d1f', fontWeight: '800', fontSize: '1rem', marginBottom: '10px' }}>חוות דעת ראשונית של סוכן ה-AI:</h4>
                            <p style={{ fontSize: '0.9rem', color: '#1d1d1f', lineHeight: '1.7', fontWeight: '500' }}>{evalResult.analysisText}</p>
                          </div>

                          <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '28px' }}>
                            <h4 style={{ color: '#1d1d1f', marginBottom: '16px', fontSize: '1.1rem', fontWeight: '800' }}>עורכי דין מורשים מומלצים למקרה זה:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                              {evalResult.matchedLawyers.map((law, idx) => (
                                <div key={idx} className="frosty-glass" style={{ padding: '20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255, 255, 255, 0.8)' }}>
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                                    <div style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                                      <Image src={law.img} alt={law.name} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{law.name}</div>
                                      <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: '600' }}>{law.role}</div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6e6e73', marginBottom: '14px', fontWeight: '600' }}>
                                    <span>{law.exp}</span>
                                    <span>⭐ {law.rating}</span>
                                  </div>
                                  <button onClick={() => alert(`פנייה נשלחה לעו״ד ${law.name.split(' ')[1]}`)} className="btn btn-outline" style={{ width: '100%', padding: '10px 0', fontSize: '0.8rem', borderRadius: '8px' }}>
                                    שילוב עורך דין לליווי
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button onClick={() => { setActiveStep(1); setEvalResult(null); }} className="btn btn-primary" style={{ width: '100%', marginTop: '32px', height: '48px', fontSize: '0.9rem' }}>
                            פתח הערכה חדשה
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Bituach Leumi appeal calculator */}
                  {activeTab === 'national_insurance' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: '900' }}>מחשבון ביטוח לאומי. דע כמה מגיע לך.</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px' }}>
                        בדוק את אחוזי הנכות הרפואית המשוערים ואת גובה הקצבה החודשית המגיעה לך, כולל הגבלת שכר הטרחה החוקי של עורכי דין.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: blResult ? '1.1fr 0.9fr' : '1fr', gap: '32px', alignItems: 'start' }}>
                        
                        <form onSubmit={calculateBituachLeumi} className="glass-panel" style={{ background: '#ffffff', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '20px', fontWeight: '800', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>פרטי הגשת התביעה</h4>
                          
                          <div className="form-group">
                            <label className="form-label">סוג התביעה:</label>
                            <select value={blCategory} onChange={(e) => setBlCategory(e.target.value)} className="form-control" style={{ background: '#fcfcfd' }}>
                              <option value="general_invalidity">נכות כללית (אובדן כושר עבודה כללי)</option>
                              <option value="work_injury">נפגעי עבודה (תאונת עבודה / מחלת מקצוע)</option>
                              <option value="child">קצבת ילד נכה (עד גיל 18)</option>
                              <option value="mobility">קצבת ניידות (ליקויים ברגליים)</option>
                            </select>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                              <label className="form-label">גיל התובע/ת:</label>
                              <input type="number" value={blAge} onChange={(e) => setBlAge(e.target.value)} className="form-control" min="1" max="120" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">הכנסה חודשית ברוטו (שכר ממוצע):</label>
                              <input type="number" value={blIncome} onChange={(e) => setBlIncome(e.target.value)} className="form-control" min="0" required />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">בחר את הליקויים הרפואיים הקיימים (לפי תיעוד רפואי):</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(244,245,248,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
                              {[
                                { id: 'orthopedic', label: 'בעיות אורתופדיות (גב, מפרקים)', weight: '20%' },
                                { id: 'neurological', label: 'בעיות נוירולוגיות (נשירת עצב)', weight: '30%' },
                                { id: 'cardiac', label: 'מחלות לב וכלי דם', weight: '25%' },
                                { id: 'respiratory', label: 'בעיות נשימה / אסתמה', weight: '20%' },
                                { id: 'mental', label: 'נפשי, חרדה ופוסט טראומה', weight: '20%' },
                                { id: 'diabetes', label: 'סוכרת (עם או בלי סיבוכים)', weight: '10%' },
                                { id: 'sensory', label: 'לקויי שמיעה / ראייה', weight: '15%' }
                              ].map(item => (
                                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700' }}>
                                  <input type="checkbox" checked={blConditions.includes(item.id)} onChange={() => handleConditionsChange(item.id)} style={{ width: '16px', height: '16px', accentColor: '#0066cc' }} />
                                  <span>{item.label} <small style={{ color: '#0066cc' }}>({item.weight})</small></span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <h4 style={{ color: '#1d1d1f', margin: '24px 0 16px 0', fontWeight: '800', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>פרטי קשר לשליחת הדוח</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                            <div className="form-group">
                              <label className="form-label">שם מלא:</label>
                              <input type="text" value={blName} onChange={(e) => setBlName(e.target.value)} className="form-control" placeholder="ישראל ישראלי" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">טלפון נייד:</label>
                              <input type="tel" value={blPhone} onChange={(e) => setBlPhone(e.target.value)} className="form-control" placeholder="050-1234567" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">כתובת אימייל:</label>
                              <input type="email" value={blEmail} onChange={(e) => setBlEmail(e.target.value)} className="form-control" placeholder="israel@gmail.com" required />
                            </div>
                          </div>

                          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: '10px' }}>
                            {blLoading ? 'מחשב זכאות...' : 'חשב אחוזי נכות וגובה קצבה'}
                          </button>
                        </form>

                        {/* Calculator output report */}
                        {blResult && (
                          <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', padding: '30px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                              <CourtIcon style={{ width: '48px', height: '48px', color: '#0066cc' }} />
                              <h4 style={{ color: '#1d1d1f', fontSize: '1.25rem', fontWeight: '900', marginTop: '10px' }}>דוח זכאות משוער - ביטוח לאומי</h4>
                              <span style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '700' }}>תאריך: {new Date().toLocaleDateString('he-IL')}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: '700', color: '#6e6e73' }}>נכות רפואית משוקללת:</span>
                                <strong style={{ color: '#1d1d1f', fontSize: '1.1rem' }}>{blResult.medicalPercent}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: '700', color: '#6e6e73' }}>סף זכאות רפואי (כללי):</span>
                                <strong style={{ color: blResult.medicalPercent >= 60 ? '#10b981' : '#d93838' }}>
                                  {blResult.medicalPercent >= 60 ? '✓ עובר סף (מינימום 60%)' : '✗ מתחת לסף הכללי'}
                                </strong>
                              </div>
                              
                              {blCategory === 'general_invalidity' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                                  <span style={{ fontWeight: '700', color: '#6e6e73' }}>מגבלת הכנסה להגשה:</span>
                                  <strong style={{ color: blIncome < 6700 ? '#10b981' : '#d93838' }}>
                                    {blIncome < 6700 ? `✓ תקין (₪${blIncome} מתחת ל-₪6,700)` : `✗ שכר גבוה מהסף המותר (₪${blIncome})`}
                                  </strong>
                                </div>
                              )}

                              <div style={{ padding: '16px', background: 'rgba(0,102,204,0.03)', borderRadius: '12px', border: '1px solid rgba(0,102,204,0.08)', margin: '10px 0' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '800' }}>גובה קצבה חודשית משוערת:</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0066cc', marginTop: '4px' }}>
                                  ₪{blResult.monthlyAllowance.toLocaleString()}
                                  <small style={{ fontSize: '0.85rem', fontWeight: '500', color: '#6e6e73' }}> / לחודש</small>
                                </div>
                              </div>

                              <div style={{ padding: '16px', background: 'rgba(217,56,56,0.03)', borderRadius: '12px', border: '1px solid rgba(217,56,56,0.08)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6e6e73', fontWeight: '800' }}>שכ״ט עורכי דין מירבי (חוק הגבלת שכר טרחה):</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#d93838', marginTop: '4px' }}>
                                  ₪{blResult.expectedLawyerFee.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#6e6e73', marginTop: '6px', lineHeight: '1.4' }}>
                                  * שכר הטרחה מוגבל בחוק ביטוח לאומי (תיקון 161) ונקבע כנגזרת קבועה של קצבאות העתיד. אין לשלם מעבר לתקרות הקבועות.
                                </div>
                              </div>
                            </div>

                            <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                              <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>✓ פנייתך נשלחה ישירות לעורכי דין המתמחים בביטוח לאומי.</p>
                              <p style={{ fontSize: '0.75rem', color: '#6e6e73', marginTop: '4px' }}>עורך דין מטעמנו יצור עמך קשר טלפוני בהקדם האפשרי להמשך ייצוג בוועדות הרפואיות.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Severance Pay & Demand Letter */}
                  {activeTab === 'severance' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: '900' }}>זכויות עבודה. בקרת פיצויים ומכתבי התראה.</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px' }}>
                        חשב את גובה הפיצויים המגיעים לך, פנסיה משוקללת לפי סעיף 14, פטור ממס הכנסה, והפק מכתב התראה רשמי למעסיק להורדה והדפסה.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: sevResult ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
                        
                        <form onSubmit={calculateSeverance} className="glass-panel" style={{ background: '#ffffff', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '20px', fontWeight: '800', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>פרטי העסקה וסיום עבודה</h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                              <label className="form-label">תאריך תחילת עבודה:</label>
                              <input type="date" value={sevStartDate} onChange={(e) => setSevStartDate(e.target.value)} className="form-control" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">תאריך סיום עבודה:</label>
                              <input type="date" value={sevEndDate} onChange={(e) => setSevEndDate(e.target.value)} className="form-control" required />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '16px' }}>
                            <div className="form-group">
                              <label className="form-label">שכר חודשי אחרון ברוטו (₪):</label>
                              <input type="number" value={sevSalary} onChange={(e) => setSevSalary(Number(e.target.value))} className="form-control" min="0" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">סיבת הפסקת העבודה:</label>
                              <select value={sevReason} onChange={(e) => setSevReason(e.target.value)} className="form-control" style={{ background: '#fcfcfd' }}>
                                <option value="dismissal">פיטורים על ידי המעסיק</option>
                                <option value="resignation_health">התפטרות עקב מצב בריאותי לקוי</option>
                                <option value="resignation_childbirth">התפטרות לצורך טיפול בילד (לאחר לידה)</option>
                                <option value="resignation_worse">התפטרות עקב הרעה מוחשית בתנאים</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '20px', background: 'rgba(244,245,248,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', marginBottom: '24px', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={sevSection14} onChange={(e) => setSevSection14(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#0066cc' }} />
                              <span>חל סעיף 14 לחוק פיצויי פיטורים</span>
                            </label>
                            {sevSection14 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#6e6e73' }}>שיעור הפקדת פיצויים בקופה:</span>
                                <select value={sevPensionRate} onChange={(e) => setSevPensionRate(Number(e.target.value))} className="form-control" style={{ width: '90px', padding: '4px 10px', fontSize: '0.8rem' }}>
                                  <option value={6}>6.0%</option>
                                  <option value={8.33}>8.33% (מלא)</option>
                                </select>
                              </div>
                            )}
                          </div>

                          <h4 style={{ color: '#1d1d1f', margin: '10px 0 16px 0', fontWeight: '800', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>פרטי קשר לשליחת מכתב ההתראה</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                            <div className="form-group">
                              <label className="form-label">שם מלא:</label>
                              <input type="text" value={sevName} onChange={(e) => setSevName(e.target.value)} className="form-control" placeholder="ישראל ישראלי" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">טלפון נייד:</label>
                              <input type="tel" value={sevPhone} onChange={(e) => setSevPhone(e.target.value)} className="form-control" placeholder="050-1234567" required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">כתובת אימייל:</label>
                              <input type="email" value={sevEmail} onChange={(e) => setSevEmail(e.target.value)} className="form-control" placeholder="israel@gmail.com" required />
                            </div>
                          </div>

                          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: '10px' }}>
                            {sevLoading ? 'מחשב פיצויים...' : 'חשב פיצויי פיטורין ומס הכנסה'}
                          </button>
                        </form>

                        {/* Output report and printable demand letter */}
                        {sevResult && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', padding: '24px' }}>
                              <h4 style={{ color: '#1d1d1f', fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>פירוט חישוב פיצויים ומיסוי</h4>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#6e6e73' }}>תקופת עבודה מצטברת:</span>
                                  <strong>{sevResult.years.toFixed(2)} שנים</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#6e6e73' }}>ברוטו פיצויי פיטורין:</span>
                                  <strong>₪{sevResult.grossSeverance.toLocaleString()}</strong>
                                </div>
                                {sevSection14 && (
                                  <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ color: '#6e6e73' }}>כספים צבורים בקופת הפיצויים:</span>
                                      <strong style={{ color: '#0066cc' }}>₪{sevResult.pensionOffset.toLocaleString()}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                                      <span style={{ color: '#6e6e73' }}>יתרת תשלום ישיר מהמעסיק:</span>
                                      <strong style={{ color: '#d93838', fontSize: '1rem' }}>₪{sevResult.additionalEmployerPayout.toLocaleString()}</strong>
                                    </div>
                                  </>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#6e6e73' }}>תקרת פטור ממס (₪13,750 לשנה):</span>
                                  <strong>₪{sevResult.taxExemptLimit.toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#6e6e73' }}>חלק הפיצויים החייב במס:</span>
                                  <strong style={{ color: sevResult.taxableAmount > 0 ? '#d93838' : '#10b981' }}>₪{sevResult.taxableAmount.toLocaleString()}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="document-preview-container animate-fade-in" id="printable-demand-letter">
                              <div className="document-header">
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#000000' }}>מכתב דרישה והתראה לפני נקיטת הליכים משפטיים</h3>
                                <span style={{ fontSize: '0.85rem' }}>הודעה רשמית לפי חוק הגנת השכר וחוק פיצויי פיטורים</span>
                              </div>
                              <pre style={{ 
                                whiteSpace: 'pre-wrap', 
                                fontFamily: 'Times New Roman, Times, serif', 
                                fontSize: '0.95rem',
                                color: '#000000',
                                lineHeight: '1.6',
                                direction: 'rtl',
                                unicodeBidi: 'embed'
                              }}>{sevResult.letterText}</pre>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}>
                                🖨️ הדפס מכתב התראה
                              </button>
                              <button 
                                type="button"
                                onClick={() => triggerPayment(399, 'סקירת מכתב התראה על ידי עורך דין', 'document_review', { leadId: `lead_sev_${Date.now()}` })}
                                className="btn btn-primary" 
                                style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}
                              >
                                ⚖️ סקירת עורך דין (₪399)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: AI Contract Auditor */}
                  {activeTab === 'auditor' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }}>
                        
                        <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                          <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.25rem', fontWeight: '800' }}>סורק חוזים AI. הגנה מובנית מפני סעיפים מקפחים.</h3>
                          <p style={{ color: '#6e6e73', fontSize: '0.85rem', marginBottom: '20px' }}>
                            הדבק סעיפים מתוך חוזה שכירות, הסכם העסקה או הסכם ספק. סוכני ה-AI שלנו יסרקו את הניסוח ויזהו סעיפים מקפחים, תניות שיפוט בעייתיות וחשיפות משפטיות.
                          </p>

                          <form onSubmit={handleAudit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                rows="10"
                                value={contractText}
                                onChange={(e) => setContractText(e.target.value)}
                                placeholder="הדבק כאן את סעיפי החוזה לניתוח..."
                                style={{ background: '#ffffff', borderColor: 'rgba(0, 0, 0, 0.08)' }}
                                required
                              ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={isAuditing}>
                              {isAuditing ? 'סורק חוזה...' : 'הפעל סורק אבטחת חוזה'}
                            </button>
                          </form>
                        </div>

                        <div className="glass-panel" style={{ minHeight: '340px', background: '#ffffff', padding: '24px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>דוח סקירת סיכונים משפטיים</h4>

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

                  {/* Tab 5: Precedent & Citation Finder */}
                  {activeTab === 'precedent' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '10px', fontSize: '1.25rem', textAlign: 'center', fontWeight: '800' }}>מאגר תקדימים. ביסוס חוקי מוחלט.</h3>
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

                  {/* Tab 6: Legal Tech Embed Showcase & Hub */}
                  {activeTab === 'legal_tech_hub' && (
                    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
                      <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: '900' }}>שער האינטגרציות. שירותי הממשל המשפטיים, במקום אחד.</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px' }}>
                        פורטל ריכוז ושימוש בכל פרויקטי ה-LegalTech בישראל. בצע פניות לתיקים בנט המשפט, חתום דיגיטלית מול נוטריון, והפק כתבי תביעה.
                      </p>

                      <div className="tab-pill-container" style={{ maxWidth: '720px', margin: '0 auto 30px auto' }}>
                        {[
                          { id: 'court_tracker', label: 'נט המשפט' },
                          { id: 'notary_signer', label: 'חתימת נוטריון דיגיטלית' },
                          { id: 'small_claims', label: 'תביעות קטנות' },
                          { id: 'tabu_registry', label: 'נסח טאבו' }
                        ].map(tool => (
                          <button 
                            key={tool.id} 
                            onClick={() => setActiveEmbedTool(tool.id)}
                            className={`tab-pill-button ${activeEmbedTool === tool.id ? 'active' : ''}`}
                            style={{ fontSize: '0.85rem' }}
                          >
                            {tool.label}
                          </button>
                        ))}
                      </div>

                      {/* Tool Sub-views */}
                      {activeEmbedTool === 'court_tracker' && (
                        <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '12px', fontWeight: '800' }}>מעקב תיק בבתי המשפט (נט המשפט API)</h4>
                          <p style={{ color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>הזן מספר תיק (למשל: סס״ק-12345-06-26) לשאילתת מידע רשמית.</p>
                          
                          <form onSubmit={handleCaseSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                            <input type="text" value={caseSearchNum} onChange={(e) => setCaseSearchNum(e.target.value)} className="form-control" placeholder="לדוגמה: 42356-02-25" required />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>חיפוש בתיק</button>
                          </form>

                          {caseSearchResult && (
                            <div style={{ background: 'rgba(244, 245, 248, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.85rem' }}>
                              <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0066cc', marginBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '6px' }}>
                                סטטוס תיק: {caseSearchResult.caseNum}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div><strong>ערכאה:</strong> {caseSearchResult.court}</div>
                                <div><strong>שופט/ת:</strong> {caseSearchResult.judge}</div>
                                <div><strong>תובע/ת:</strong> {caseSearchResult.plaintiff}</div>
                                <div><strong>נתבע/ת:</strong> {caseSearchResult.defendant}</div>
                              </div>
                              <div style={{ marginBottom: '8px' }}><strong>מהות התיק:</strong> {caseSearchResult.subject}</div>
                              <div style={{ marginBottom: '8px' }}><strong>סטטוס:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{caseSearchResult.status}</span></div>
                              <div style={{ marginBottom: '8px' }}><strong>פעילות אחרונה:</strong> {caseSearchResult.lastAction}</div>
                              <div><strong>מועד דיון קרוב:</strong> <span style={{ color: '#d93838', fontWeight: 'bold' }}>{caseSearchResult.nextHearing}</span></div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeEmbedTool === 'notary_signer' && (
                        <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '12px', fontWeight: '800' }}>אימות וחתימת נוטריון דיגיטלית מוצפנת</h4>
                          <p style={{ color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>חתום דיגיטלית על הצהרת ייפוי כוח נוטריוני לקבלת אישור אלקטרוני רשמי מוגן hash.</p>
                          
                          <form onSubmit={handleNotarySign}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                              <div className="form-group">
                                <label className="form-label">שם המצהיר/ה:</label>
                                <input type="text" value={notarySignName} onChange={(e) => setNotarySignName(e.target.value)} className="form-control" placeholder="שם מלא" required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">תפקיד/סמכות:</label>
                                <select value={notarySignRole} onChange={(e) => setNotarySignRole(e.target.value)} className="form-control" style={{ background: '#fcfcfd' }}>
                                  <option value="declarant">מצהיר פרטי</option>
                                  <option value="director">מנהל תאגיד מורשה</option>
                                  <option value="guardian">אפוטרופוס חוקי</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">חתום בתוך התיבה (שימוש בעכבר או מגע):</label>
                              <canvas 
                                ref={signatureCanvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="signature-canvas"
                                width="580"
                                height="150"
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>הפק אישור וחתימה נוטריונית</button>
                              <button type="button" onClick={clearSignature} className="btn btn-outline" style={{ width: '120px' }}>נקה חתימה</button>
                            </div>
                          </form>

                          {notarySigned && (
                            <div style={{ background: 'rgba(16,185,129,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid #10b981', textAlign: 'center' }}>
                              <LockIcon style={{ width: '32px', height: '32px', color: '#10b981', margin: '0 auto 10px auto', display: 'block' }} />
                              <div style={{ fontWeight: '800', fontSize: '1rem', color: '#10b981', margin: '6px 0' }}>מסמך נחתם ואומת נוטריונית בהצלחה</div>
                              <div style={{ fontSize: '0.8rem', color: '#6e6e73', fontFamily: 'monospace' }}>מזהה אימות: {notaryDocId}</div>
                              <div style={{ fontSize: '0.72rem', color: '#6e6e73', marginTop: '6px' }}>
                                חותמת דיגיטלית המאשרת כי המצהיר {notarySignName} חתם בנוכחות אמצעי זיהוי דיגיטלי מאובטח.
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeEmbedTool === 'small_claims' && (
                        <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', maxWidth: '680px', margin: '0 auto', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '12px', fontWeight: '800' }}>מחולל כתב תביעה - תביעות קטנות</h4>
                          <p style={{ color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>הפק כתב תביעה מבוסס תבנית רשמית של בתי המשפט (עד לתקרה החוקית של ₪38,900).</p>
                          
                          <form onSubmit={handleSmallClaimsGenerate}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                              <div className="form-group">
                                <label className="form-label">שם התובע/ת:</label>
                                <input type="text" value={scClaimant} onChange={(e) => setScClaimant(e.target.value)} className="form-control" placeholder="ישראל ישראלי" required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">שם הנתבע/ת:</label>
                                <input type="text" value={scDefendant} onChange={(e) => setScDefendant(e.target.value)} className="form-control" placeholder="חברת תקשורת בע״מ" required />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                              <div className="form-group">
                                <label className="form-label">סכום תביעה מבוקש (₪):</label>
                                <input type="number" value={scAmount} onChange={(e) => setScAmount(Number(e.target.value))} className="form-control" max="38900" required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">סיווג התביעה:</label>
                                <select value={scSubject} onChange={(e) => setScSubject(e.target.value)} className="form-control" style={{ background: '#fcfcfd' }}>
                                  <option value="goods_service">אספקת מוצר או שירות פגום</option>
                                  <option value="apartment_rental">שכירות והחזר פיקדון</option>
                                  <option value="vehicle_damage">נזק רכוש לרכב בתאונה</option>
                                  <option value="other">אחר</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">פרט את השתלשלות האירועים בקצרה:</label>
                              <textarea value={scDetails} onChange={(e) => setScDetails(e.target.value)} className="form-control" rows="4" placeholder="תאר מה קרה, מתי, ואיזה נזק כספי נגרם לך במדויק..." required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }}>הפק מסמך תביעה ושלח לעו״ד לבדיקה</button>
                          </form>

                          {scResultDoc && (
                            <div className="animate-fade-in" style={{ marginTop: '24px' }}>
                              <div className="document-preview-container" style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                {scResultDoc.docContent}
                              </div>
                              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
                                ✓ טיוטת כתב התביעה הופקה ונשלחה למזכירות עורכי הדין של הפורטל.
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeEmbedTool === 'tabu_registry' && (
                        <div className="glass-panel animate-fade-in" style={{ background: '#ffffff', maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
                          <h4 style={{ color: '#1d1d1f', marginBottom: '12px', fontWeight: '800' }}>שאילתת נסח טאבו (לשכת רישום המקרקעין)</h4>
                          <p style={{ color: '#6e6e73', fontSize: '0.8rem', marginBottom: '20px' }}>הזן מספר גוש ומספר חלקה לביצוע חיפוש ורישום זכויות בנכס מקרקעין.</p>
                          
                          <form onSubmit={handleTabuSearch}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                              <div className="form-group">
                                <label className="form-label">מספר גוש (Block):</label>
                                <input type="text" value={tabuBlock} onChange={(e) => setTabuBlock(e.target.value)} className="form-control" placeholder="למשל: 6104" required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">מספר חלקה (Parcel):</label>
                                <input type="text" value={tabuParcel} onChange={(e) => setTabuParcel(e.target.value)} className="form-control" placeholder="למשל: 12" required />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>שלוף נסח טאבו</button>
                          </form>

                          {tabuResult && (
                            <div style={{ background: 'rgba(244, 245, 248, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.85rem', marginTop: '24px' }}>
                              <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0066cc', marginBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '6px' }}>
                                נסח רישום מקרקעין רשמי (Block {tabuResult.block} / Parcel {tabuResult.parcel})
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div><strong>כתובת הנכס:</strong> {tabuResult.address}</div>
                                <div><strong>בעלים רשום:</strong> {tabuResult.owner}</div>
                                <div><strong>סוג הזכות:</strong> {tabuResult.rightsType}</div>
                                <div><strong>שטח רשום:</strong> {tabuResult.area}</div>
                                <div><strong>הערות אזהרה ושיעבודים:</strong> <span style={{ color: '#d93838' }}>{tabuResult.caveats}</span></div>
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '6px', fontSize: '0.75rem', color: '#6e6e73' }}>נסח שהופק בתאריך {tabuResult.dateGenerated}.</div>
                              </div>
                            </div>
                          )}
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
                      <h3 style={{ color: '#1d1d1f', marginBottom: '8px', fontSize: '1.3rem', fontWeight: '800' }}>📥 מרכז הפניות החמות (Real-Time Leads Queue)</h3>
                      <p style={{ color: '#6e6e73', fontSize: '0.85rem', marginBottom: '24px' }}>להלן פניות של מיוצגים שסווגו על ידי ה-AI וממתינים לייצוג או ייעוץ משפטי.</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {leads.map((lead) => {
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

                        {unlockedLeads[selectedLead.id] ? (
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
                                <PhoneIcon style={{ width: '14px', height: '14px', marginLeft: '6px' }} />
                                חייג עכשיו
                              </a>
                              <a href={`mailto:${selectedLead.clientEmail}`} className="btn btn-outline" style={{ flex: 1, height: '42px', padding: '0 20px', fontSize: '0.85rem' }}>
                                <MailIcon style={{ width: '14px', height: '14px', marginLeft: '6px' }} />
                                שלח אימייל
                              </a>
                            </div>
                          </div>
                        ) : (
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

      {/* 4. Bento Grid Practice Areas (Intent Pyramid) */}
      <section id="features" className="container" style={{ padding: '60px 24px 100px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            חיפוש משפטי לפי כוונה
          </span>
          <h2 style={{ fontSize: '2.5rem', color: '#1d1d1f', marginTop: '6px', fontWeight: '900' }}>התחילו מהבעיה המשפטית, ועברו למסלול פעולה</h2>
          <p style={{ color: '#6e6e73', maxWidth: '680px', margin: '12px auto 0 auto', fontSize: '1rem', fontWeight: '500' }}>
            העמוד הראשי מחבר בין מונחי החיפוש המשפטיים לבין פתרונות AI ומאגר עורכי הדין המורשים. לחצו על אחד התחומים להפעלה מהירה בסביבת העבודה.
          </p>
        </div>

        <div className="bento-grid">
          
          {[
            {
              id: 'labor-law',
              slug: 'labor-law',
              title: 'דיני עבודה וזכויות עובדים',
              desc: 'פיטורים שלא כדין, שימוע לפני פיטורין, הלנת שכר, ימי חופשה, פנסיה והסכמי העסקה.',
              icon: <BriefcaseIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'severance',
              badge: 'פיצויים וסעדים',
              topics: ['פיצויי פיטורין', 'שימוע בהריון', 'הפרשה לפנסיה', 'הרעת תנאים']
            },
            {
              id: 'personal-injury-law',
              slug: 'personal-injury-law',
              title: 'נזקי גוף, תאונות וביטוחים',
              desc: 'תאונות דרכים קשות, נפילות במרחב הציבורי, תאונות עבודה, פוליסות ביטוח ופיצויים סטטוטוריים.',
              icon: <MedicalIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'evaluator',
              badge: 'נזקי גוף',
              topics: ['תאונות דרכים', 'תאונות עבודה', 'פוליסות תאונות אישיות']
            },
            {
              id: 'family-law',
              slug: 'family-law',
              title: 'דיני משפחה, גירושין וירושות',
              desc: 'הסכמי גירושין, משמורת ילדים, מזונות ילדים, חלוקת רכוש משפחתי, צוואות והסכמי ממון.',
              icon: <BalanceIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'evaluator',
              badge: 'דיני משפחה',
              topics: ['מחשבון מזונות', 'הסכם ממון', 'צוואות וירושות']
            },
            {
              id: 'real-estate-law',
              slug: 'real-estate-law',
              title: 'מקרקעין, נדל״ן וחוזים',
              desc: 'ליווי חוזה קניית/מכירת דירה, איחורים במסירת מפתח מקבלן, רישום בטאבו וליקויי בנייה.',
              icon: <HomeIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'auditor',
              badge: 'נדל״ן ומקרקעין',
              topics: ['חוזה מכר דירה', 'רישום בטאבו', 'ליקויי בנייה']
            },
            {
              id: 'criminal-law',
              slug: 'criminal-law',
              title: 'דין פלילי, חקירות ומעצרים',
              desc: 'חקירה משטרתית באזהרה, ייצוג במעצרים, הגשת כתב אישום, שימוע פלילי ומחיקת רישום פלילי.',
              icon: <LockIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'evaluator',
              badge: 'פלילי ומעצרים',
              topics: ['חקירה באזהרה', 'מחיקת רישום', 'ייצוג במעצרים']
            },
            {
              id: 'medical-malpractice-law',
              slug: 'medical-malpractice-law',
              title: 'רשלנות רפואית ונזקים',
              desc: 'רשלנות במעקב הריון ולידה, אבחון שגוי או מאוחר של מחלות, רשלנות בניתוחים וטיפול לא זהיר.',
              icon: <CourtIcon style={{ width: '28px', height: '28px' }} />,
              tab: 'evaluator',
              badge: 'רשלנות רפואית',
              topics: ['רשלנות בלידה', 'אבחון שגוי', 'רשלנות בניתוח']
            }
          ].map((item) => (
            <a
              key={item.id}
              href={`/${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab(item.tab);
                setCaseType(item.slug);
                setUserMode('client');
              }}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                textAlign: 'right',
                background: '#ffffff',
                padding: '28px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(0,102,204,0.04)', padding: '10px', borderRadius: '10px', color: '#0066cc' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6e6e73', fontWeight: '800', backgroundColor: '#f5f5f7', padding: '3px 8px', borderRadius: '6px' }}>
                    {item.badge}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#1d1d1f' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6e6e73', lineHeight: '1.6', marginBottom: '16px', fontWeight: '500' }}>{item.desc}</p>
              </div>

              <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '0.7rem', color: '#6e6e73', display: 'block', marginBottom: '6px', fontWeight: '800' }}>נושאים חמים:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {item.topics.map((topic, index) => (
                    <span key={index} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: '#f5f5f7', color: '#1d1d1f', fontWeight: '700' }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}

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
          
          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#cbd5e1' }}></div>
            
            <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.05)' }}>
                <Image src="/lawyer_male_premium.png" alt="עו״ד דניאל כהן" fill style={{ objectFit: 'cover' }} />
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

          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#cbd5e1' }}></div>
            
            <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.05)' }}>
                <Image src="/lawyer_female_premium.png" alt="עו״ד מיטל לוי" fill style={{ objectFit: 'cover' }} />
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
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#1d1d1f', marginBottom: '20px', fontSize: '1.8rem', fontWeight: '900' }}>אבטחה והצפנה בסטנדרט בנקאי</h2>
          <p style={{ color: '#6e6e73', fontSize: '1rem', lineHeight: '1.7', marginBottom: '32px', fontWeight: '500' }}>
            JUS-TICE פועל תחת כללי חיסיון עורך-דין לקוח מחמירים. כל הנתונים והחוזים המועלים למערכת מוצפנים מקצה לקצה ואינם משמשים לאימון מודלים ציבוריים. כל המידע נבדק ומבוסס על סעיפי החוק הישראלי ותקדימי בית המשפט העליון.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div className="frosty-glass" style={{ padding: '14px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LockIcon style={{ width: '16px', height: '16px', color: '#0066cc' }} />
              הצפנת AES-256 מקצה לקצה
            </div>
            <div className="frosty-glass" style={{ padding: '14px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckIcon style={{ width: '16px', height: '16px', color: '#0066cc' }} />
              מותאם לתקנות לשכת עו״ד בישראל
            </div>
          </div>
        </div>
      </section>

      {/* 7. Floating Interactive macOS Navigation Dock */}
      <div className="floating-dock">
        <div className="dock-item" title="סביבת עבודה AI" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('evaluator'); }}>
          <ChartIcon />
        </div>
        <div className="dock-item" title="מחשבון ביטוח לאומי" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('national_insurance'); }}>
          <CourtIcon />
        </div>
        <div className="dock-item" title="פיצויים ומכתבים" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('severance'); }}>
          <BriefcaseIcon />
        </div>
        <div className="dock-item" title="סורק חוזים" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('auditor'); }}>
          <SearchIcon />
        </div>
        <div className="dock-divider"></div>
        <div className="dock-item" title="תקדימים משפטיים" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('precedent'); }}>
          <BookIcon />
        </div>
        <div className="dock-item" title="שער LegalTech" onClick={() => { document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('legal_tech_hub'); }}>
          <BoltIcon />
        </div>
        <div className="dock-divider"></div>
        <div className="dock-item" title="מעבר מצב משתמש" onClick={() => setUserMode(userMode === 'client' ? 'lawyer' : 'client')}>
          <GearIcon />
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
