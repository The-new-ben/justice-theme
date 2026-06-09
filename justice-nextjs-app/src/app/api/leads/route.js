import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
      return str
        .replace(/--+/g, '')                 // Strip SQL inline comments
        .replace(/\/\*[\s\S]*?\*\//g, '')    // Strip SQL block comments
        .replace(/'/g, "''");                // Escape single quotes
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

    // Apply defaults and fallbacks
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      title = clientName ? `פנייה חדשה מאת ${clientName.trim()}` : 'פנייה חדשה';
    }
    type = type || 'general';
    typeLabel = typeLabel || 'כללי';

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

    const newLead = {
      id: `lead_${Date.now()}`,
      title,
      type,
      typeLabel,
      urgency: urgency || 'בינונית',
      value: value || 'לא צוין',
      description,
      date: 'הרגע',
      bidPrice: bidPrice || 100,
      clientName,
      clientPhone,
      clientEmail: clientEmail || '',
      payment_status: 'pending',
      lead_status: 'new'
    };

    // Supabase persistence
    let dbSaved = false;
    let createdRecord = newLead;

    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            title: newLead.title,
            legal_type: newLead.type,
            type_label: newLead.typeLabel,
            urgency: newLead.urgency,
            estimated_value: newLead.value,
            description: newLead.description,
            client_name: newLead.clientName,
            client_phone: newLead.clientPhone,
            client_email: newLead.clientEmail,
            bid_price: newLead.bidPrice,
            payment_status: newLead.payment_status,
            lead_status: newLead.lead_status
          }
        ])
        .select()
        .single();

      if (!error && data) {
        dbSaved = true;
        createdRecord = {
          ...newLead,
          id: data.id.toString(),
        };
      } else {
        console.error('Supabase insert failed, falling back to local simulation:', error);
      }
    }

    // Prepare notifications output
    const smsMessage = `פנייה חדשה התקבלה ב-Jus-Tice! נושא: ${title}. מיוצג/ת: ${clientName}. טלפון: ${clientPhone}. סוג: ${typeLabel}. שווי מוערך: ${value}. כנס לדשבורד לרכישה.`;
    
    // Simulate/send notifications
    if (newLead.clientEmail) {
      const emailHtml = `שלום ${htmlEncode(clientName)}, פנייתך התקבלה.`;
      await sendEmail(newLead.clientEmail, `פנייתך בנושא ${title} התקבלה ב-JUS-TICE`, emailHtml);
    }
    await sendSMS(clientPhone, smsMessage);

    const notifications = {
      sms: 'CONSOLE_ONLY: ' + smsMessage,
      email: newLead.clientEmail ? 'CONSOLE_ONLY: sent' : 'CONSOLE_ONLY: skipped'
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
