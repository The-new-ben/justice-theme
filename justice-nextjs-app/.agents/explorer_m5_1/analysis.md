# Technical Analysis: Leads API Payload Mapping, Defaulting, and SQL Sanitization

This document provides a detailed analysis and implementation design for the Leads API endpoint (`src/app/api/leads/route.js`). The objective is to make the API robust against alternative request payloads, automatically generate meaningful titles when missing, and ensure SQL injection attempts are safely neutralized without backend crashes or vulnerabilities.

---

## 1. Dynamic Payload Mapping

### Current Implementation
In the current code of `src/app/api/leads/route.js` (lines 13-30):
```javascript
let {
  title,
  type,
  typeLabel,
  urgency,
  value,
  description,
  clientName,
  clientPhone,
  clientEmail,
  bidPrice,
} = leadData;

// Map keys from alternative payloads (E2E test suite)
if (leadData.name) clientName = leadData.name;
    if (leadData.phone) clientPhone = leadData.phone;
if (leadData.email) clientEmail = leadData.email;
if (leadData.details) description = leadData.details;
```

### Limitations
1. **Destructuring Override**: Destructuring from `leadData` at the beginning binds variables. If `clientName` is not present, it will be `undefined`. The subsequent mapping overrides this only if `leadData.name` is truthy.
2. **Falsy Values / Empty Strings**: If `leadData.clientName` is passed as an empty string `""` or `null` but `leadData.name` has a valid value, the current structure does not fallback gracefully because it only checks if the variable was destructured.
3. **Redundant Statements**: Doing manual `if` checks for each variable is verbosely structured.

### Proposed Improvement
A more robust approach uses nullish coalescing or clean logical OR checks during assignment, prioritizing the primary keys (`clientName`, `clientPhone`, `clientEmail`, `description`) and falling back to alternative keys (`name`, `phone`, `email`, `details`):

```javascript
const clientName = (leadData.clientName && leadData.clientName.trim() !== '') ? leadData.clientName : leadData.name;
const clientPhone = (leadData.clientPhone && leadData.clientPhone.trim() !== '') ? leadData.clientPhone : leadData.phone;
const clientEmail = (leadData.clientEmail && leadData.clientEmail.trim() !== '') ? leadData.clientEmail : leadData.email;
const description = (leadData.description && leadData.description.trim() !== '') ? leadData.description : leadData.details;
```
This ensures that if the primary key is omitted, `undefined`, `null`, or empty/whitespace, it correctly maps from the alternative payload keys.

---

## 2. Title Auto-Defaulting

### Current Implementation
Currently, the route handler sets the title on line 33:
```javascript
title = title || description || 'פנייה חדשה';
```

### Problem
When `title` is not provided, it falls back to the full `description` (which could be a long text block) or the generic string `'פנייה חדשה'`. 
The requirement is to automatically default the `title` to a cleaner format containing the client name, e.g., `פנייה חדשה מאת ${clientName}`, with a safe fallback if no name is available.

### Proposed Improvement
Default the title dynamically based on the client name:
```javascript
if (!title || typeof title !== 'string' || title.trim().length === 0) {
  title = clientName ? `פנייה חדשה מאת ${clientName.trim()}` : 'פנייה חדשה';
}
```
This is executed immediately after payload mapping and before validation. This keeps the lead title concise, standardized, and easily searchable in the CRM or database.

---

## 3. SQL Sanitization & Safe Parameter Handling

### Current Implementation & E2E Behavior
1. **E2E Test Case 5**:
   The test case `POST /api/leads sanitizes case description SQL tags` sends the following SQL payload in the `details` field:
   ```javascript
   const sqlPayload = "SELECT * FROM users; DROP TABLE leads; --";
   ```
   The test asserts that the endpoint returns `200 OK` and a `success: true` JSON payload.
2. **Supabase Parameterization**:
   When the database is online, `route.js` passes `description: newLead.description` to the Supabase client wrapper (`supabase.from('leads').insert([...])`).
   Since Supabase utilizes parameterized API calls under the hood, the SQL injection attempt is stored safely as a string literal and does not execute SQL commands or crash the server.
3. **Local Simulation (Supabase Offline)**:
   If Supabase is offline, the API logs the insert error but continues execution, returning a simulated response.

### Proactive Sanitization Design
Even though parameterization handles this safely at the protocol level, explicitly sanitizing raw text inputs prevents potential down-stream vulnerabilities (e.g. if the data is exported to a raw SQL querying tool, or if custom raw SQL filters are added to the Next.js app in the future).

We design a dedicated `sanitizeSQL` helper that:
- Removes inline SQL comments (`--`).
- Removes multi-line SQL comments (`/* ... */`).
- Escapes single quotes (`'`) by doubling them (`''`), which is standard SQL escaping.

```javascript
/**
 * Safely sanitizes SQL string input to mitigate injection vectors.
 * @param {string} input 
 * @returns {string}
 */
function sanitizeSQL(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/--+/g, '')                  // Remove inline comments
    .replace(/\/\*[\s\S]*?\*\//g, '')     // Remove block comments
    .replace(/'/g, "''");                 // Escape single quotes
}
```

Applying this to the mapped `description` field:
```javascript
const description = sanitizeSQL(rawDescription);
```

---

## 4. Proposed Code Changes for `src/app/api/leads/route.js`

Here is the proposed drop-in replacement patch for the variables extraction, payload mapping, defaulting, and sanitization block in `src/app/api/leads/route.js`:

```javascript
<<<< BEFORE (Lines 13-36)
    let {
      title,
      type,
      typeLabel,
      urgency,
      value,
      description,
      clientName,
      clientPhone,
      clientEmail,
      bidPrice,
    } = leadData;

    // Map keys from alternative payloads (E2E test suite)
    if (leadData.name) clientName = leadData.name;
    if (leadData.phone) clientPhone = leadData.phone;
    if (leadData.email) clientEmail = leadData.email;
    if (leadData.details) description = leadData.details;

    // Apply defaults and fallbacks
    title = title || description || 'פנייה חדשה';
    type = type || 'general';
    typeLabel = typeLabel || 'כללי';
==== AFTER
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
    const clientName = (leadData.clientName && leadData.clientName.trim() !== '') ? leadData.clientName : (leadData.name || '');
    const clientPhone = (leadData.clientPhone && leadData.clientPhone.trim() !== '') ? leadData.clientPhone : (leadData.phone || '');
    const clientEmail = (leadData.clientEmail && leadData.clientEmail.trim() !== '') ? leadData.clientEmail : (leadData.email || '');
    
    // Extracted raw description/details
    const rawDescription = (leadData.description && leadData.description.trim() !== '') ? leadData.description : (leadData.details || '');
    
    // Apply SQL sanitization to description
    const description = sanitizeSQL(rawDescription);

    // Apply defaults and fallbacks
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      title = clientName ? `פנייה חדשה מאת ${clientName.trim()}` : 'פנייה חדשה';
    }
    type = type || 'general';
    typeLabel = typeLabel || 'כללי';
>>>>
```
