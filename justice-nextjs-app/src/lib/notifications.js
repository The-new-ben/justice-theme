/**
 * Notifications Client - Twilio SMS & Resend Email Helper
 * Zero-dependency client utilizing standard HTTP fetch.
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

/**
 * Send an SMS message using Twilio's REST API.
 * @param {string} to Israel international phone format (e.g. +972501234567)
 * @param {string} body Message content in Hebrew or English
 */
export async function sendSMS(to, body) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.warn('[SMS Simulated Dispatch] No Twilio credentials. Message payload:');
    console.warn(`TO: ${to}`);
    console.warn(`BODY: ${body}`);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const basicAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', TWILIO_FROM_NUMBER);
    params.append('Body', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to dispatch Twilio message');
    }

    console.log(`Successfully sent SMS to ${to}. Message SID: ${data.sid}`);
    return { success: true, sid: data.sid };
  } catch (error) {
    console.error('Twilio SMS delivery failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send an email using Resend API.
 * @param {string} to Client/Recipient email address
 * @param {string} subject Email subject line
 * @param {string} html HTML body content
 */
export async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.warn('[Email Simulated Dispatch] No Resend API Key. Message payload:');
    console.warn(`TO: ${to}`);
    console.warn(`SUBJECT: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jus-Tice Legal Portal <info@jus-tice.co.il>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to dispatch Resend email');
    }

    console.log(`Successfully sent email to ${to}. Email ID: ${data.id}`);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Resend email delivery failed:', error);
    return { success: false, error: error.message };
  }
}
