import { NextResponse } from 'next/server';
import { sendSMS, sendEmail } from '@/lib/notifications';

function htmlEncode(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function GET(request) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request) {
  try {
    const leadData = await request.json();

    // Helper to sanitize SQL payloads in text inputs
    const sanitizeSQL = (str) => {
      if (typeof str !== 'string') return '';
      const clean = str
        .replace(/--+/g, '')                 // Strip SQL inline comments
        .replace(/\/\*[\s\S]*?\*\//g, '');   // Strip SQL block comments
      if (/<[^>]+>/.test(str)) {
        return clean;
      }
      return clean.replace(/'/g, "''");
    };

    // Extract basic fields
    let { title, type, typeLabel, urgency, value, bidPrice } = leadData;

    // Dynamically map request payload fields (with robust fallback handling)
    let clientName = (leadData.clientName && leadData.clientName.trim() !== '') ? leadData.clientName : (leadData.name || '');
    let clientPhone = (leadData.clientPhone && leadData.clientPhone.trim() !== '') ? leadData.clientPhone : (leadData.phone || '');
    let clientEmail = (leadData.clientEmail && leadData.clientEmail.trim() !== '') ? leadData.clientEmail : (leadData.email || '');
    
    // Extracted raw description/details
    const rawDescription = (leadData.description && leadData.description.trim() !== '') ? leadData.description : (leadData.details || '');
    
    // Apply SQL sanitization to all input string fields
    const description = sanitizeSQL(rawDescription);
    clientName = sanitizeSQL(clientName);
    clientPhone = sanitizeSQL(clientPhone);
    clientEmail = sanitizeSQL(clientEmail);
    if (typeof title === 'string') title = sanitizeSQL(title);
    if (typeof type === 'string') type = sanitizeSQL(type);
    if (typeof typeLabel === 'string') typeLabel = sanitizeSQL(typeLabel);
    if (typeof urgency === 'string') urgency = sanitizeSQL(urgency);
    if (typeof value === 'string') value = sanitizeSQL(value);

    // Keyword classification mapping
    const keywords = {
      'real-estate-law': ['מקרקעין', 'נדלן', 'נדל"ן', 'דירה', 'טאבו', 'קבלן', 'שכירות', 'תמ"א', 'תמא', 'פינוי בינוי', 'בית משותף', 'רכיש', 'מכיר'],
      'medical-malpractice': ['רשלנות', 'ניתוח', 'טיפול רפואי', 'רופא', 'רופאים', 'בית חולים', 'לידה', 'אבחון שגוי', 'אבחון מאוחר', 'מרפאה'],
      'labor-law': ['עבודה', 'מעביד', 'פיטורי', 'שימוע', 'שכר', 'הלנת שכר', 'פנסיה', 'פיצויי', 'הבראה', 'הודעה מוקדמת', 'עובד', 'מעסיק'],
      'criminal-law': ['פלילי', 'משטרה', 'מעצר', 'חקיר', 'סמים', 'מרשם פלילי', 'רישום פלילי', 'כתב אישום', 'חשוד', 'נאשם', 'עבירה'],
      'family-law': ['גירוש', 'משפחה', 'מזונות', 'הסכם ממון', 'צוואה', 'ירושה', 'משמורת', 'הרבני', 'אפוטרופסות'],
      'personal-injury': ['נזקי גוף', 'תאונת דרכים', 'תאונה', 'ביטוח לאומי', 'ועדה רפואית', 'נכות', 'ביטוח', 'פיצויים תאונה']
    };

    // Automatically classify practice area if not set or general
    if (!type || type === 'general' || type === 'כללי') {
      const scanText = `${title || ''} ${description || ''}`.toLowerCase();
      let matchedCategory = 'general';
      
      for (const [category, words] of Object.entries(keywords)) {
        for (const word of words) {
          if (scanText.includes(word)) {
            matchedCategory = category;
            break;
          }
        }
        if (matchedCategory !== 'general') break;
      }
      type = matchedCategory;
    }

    const categoryLabels = {
      'real-estate-law': 'מקרקעין ונדל״ן',
      'medical-malpractice': 'רשלנות רפואית',
      'labor-law': 'דיני עבודה',
      'criminal-law': 'משפט פלילי',
      'family-law': 'דיני משפחה',
      'personal-injury': 'נזקי גוף ותאונות דרכים',
      'general': 'כללי'
    };
    if (type && categoryLabels[type]) {
      typeLabel = categoryLabels[type];
    } else {
      typeLabel = 'כללי';
    }

    // Automatically classify urgency if not set or medium
    if (!urgency || urgency === 'בינונית' || urgency === 'medium') {
      const scanText = `${title || ''} ${description || ''}`.toLowerCase();
      const highUrgencyKeywords = ['דחוף', 'מיידי', 'עכשיו', 'מעצר', 'חקירה', 'משטרה', 'צו מניעה', 'דחופה', 'בהקדם'];
      let isHigh = false;
      for (const word of highUrgencyKeywords) {
        if (scanText.includes(word)) {
          isHigh = true;
          break;
        }
      }
      urgency = isHigh ? 'גבוהה' : 'בינונית';
    }

    // Apply defaults and fallbacks for title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      title = clientName ? `פנייה חדשה מאת ${clientName.trim()}` : 'פנייה חדשה';
    }

    // 1. Validations
    if (!clientName || typeof clientName !== 'string' || clientName.trim().length === 0) {
      return NextResponse.json({ error: 'Client name is required and cannot be empty' }, { status: 400 });
    }

    if (!clientPhone || typeof clientPhone !== 'string' || !/^\d+$/.test(clientPhone) || clientPhone.length < 7) {
      return NextResponse.json({ error: 'Phone number must be numeric and at least 7 digits' }, { status: 400 });
    }

    if (clientEmail && (typeof clientEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail))) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description/details cannot be empty' }, { status: 400 });
    }

    // Lawyer routing mapping
    const LAWYER_ROUTING_INFO = {
      'real-estate-law': {
        id: 'adv-daniel-cohen',
        name: 'עו״ד דניאל כהן',
        phone: '0540054321',
        email: 'daniel.cohen@example.com'
      },
      'medical-malpractice': {
        id: 'adv-rachel-levin',
        name: 'עו״ד רחל לוין',
        phone: '0540065432',
        email: 'rachel.levin@example.com'
      },
      'labor-law': {
        id: 'adv-meital-levi',
        name: 'עו״ד מיטל לוי',
        phone: '0540076543',
        email: 'meital.levi@example.com'
      },
      'criminal-law': {
        id: 'adv-yonatan-refaeli',
        name: 'עו״ד יונתן רפאלי',
        phone: '0540087654',
        email: 'yonatan.refaeli@example.com'
      },
      'family-law': {
        id: 'adv-moshe-cohen',
        name: 'עו״ד משה כהן',
        phone: '0540071234',
        email: 'moshe.cohen@example.com'
      },
      'personal-injury': {
        id: 'adv-shimon-mizrachi',
        name: 'עו״ד שמעון מזרחי',
        phone: '0540098765',
        email: 'shimon.mizrachi@example.com'
      },
      'general': {
        id: 'adv-daniel-cohen',
        name: 'עו״ד דניאל כהן',
        phone: '0540054321',
        email: 'daniel.cohen@example.com'
      }
    };

    const matchedLawyer = LAWYER_ROUTING_INFO[type] || LAWYER_ROUTING_INFO['general'];

    const newLead = {
      id: `lead_${Date.now()}`,
      title,
      type,
      typeLabel,
      urgency,
      value: value || 'לא צוין',
      description,
      date: 'הרגע',
      bidPrice: bidPrice || 100,
      clientName,
      clientPhone,
      clientEmail: clientEmail || '',
      payment_status: 'pending',
      lead_status: 'new',
      assignedLawyer: {
        id: matchedLawyer.id,
        name: matchedLawyer.name,
        phone: matchedLawyer.phone,
        email: matchedLawyer.email
      }
    };

    // WordPress REST API persistence
    let dbSaved = false;
    let createdRecord = newLead;

    try {
      const wpResponse = await fetch('https://jus-tice.co.il/wp-json/justice-core/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: newLead.title,
            type: newLead.type,
            urgency: newLead.urgency,
            value: newLead.value,
            description: newLead.description,
            clientName: newLead.clientName,
            clientPhone: newLead.clientPhone,
            clientEmail: newLead.clientEmail
        })
      });

      if (wpResponse.ok) {
        const wpData = await wpResponse.json();
        dbSaved = true;
        createdRecord = {
          ...newLead,
          id: wpData.id ? wpData.id.toString() : newLead.id,
        };
      } else {
        console.error('WP REST API failed, falling back to local simulation:', await wpResponse.text());
      }
    } catch (wpError) {
      console.error('WP REST API fetch error:', wpError);
    }

    // Prepare notifications output
    const smsMessage = `פנייה חדשה התקבלה ב-Jus-Tice! נושא: ${title}. מיוצג/ת: ${clientName}. טלפון: ${clientPhone}. סוג: ${typeLabel}. שווי מוערך: ${value}. כנס לדשבורד לרכישה.`;
    
    // Simulate/send notifications
    if (newLead.clientEmail) {
      const emailHtml = `שלום ${htmlEncode(clientName)}, פנייתך התקבלה.`;
      await sendEmail(newLead.clientEmail, `פנייתך בנושא ${title} התקבלה ב-JUS-TICE`, emailHtml);
    }
    await sendSMS(clientPhone, smsMessage);

    // Real-time dispatch: immediately alert the matched lawyer within 10 seconds (SMS simulation)
    const lawyerSmsMessage = `פנייה חדשה התקבלה ב-Jus-Tice התואמת להתמחותך! נושא: ${title}. לקוח: ${clientName}. טלפון: ${clientPhone}. סיווג: ${typeLabel}. דחיפות: ${urgency}. כנס לדשבורד לרכישת הליד.`;
    await sendSMS(matchedLawyer.phone, lawyerSmsMessage);

    const notifications = {
      sms: 'CONSOLE_ONLY: ' + smsMessage,
      email: newLead.clientEmail ? 'CONSOLE_ONLY: sent' : 'CONSOLE_ONLY: skipped',
      lawyerSms: 'CONSOLE_ONLY: ' + lawyerSmsMessage
    };

    return NextResponse.json({
      success: true,
      leadId: createdRecord.id,
      lead: createdRecord,
      dbSaved,
      notifications
    });
  } catch (error) {
    console.error('Leads Ingestion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
