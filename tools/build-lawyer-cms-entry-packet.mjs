import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join( root, 'project-control', 'public-basic-lawyer-cms-import-candidates-2026-05-25.csv' );
const outMd = path.join( root, 'project-control', 'lawyer-cms-draft-entry-packet-2026-05-25.md' );
const outCsv = path.join( root, 'project-control', 'lawyer-cms-draft-entry-packet-2026-05-25.csv' );
const outJson = path.join( root, 'reports', 'lawyer-cms-draft-entry-packet-2026-05-25.json' );

const win1255Decoder = new TextDecoder( 'windows-1255' );
const utf8Decoder = new TextDecoder( 'utf-8', { fatal: false } );
const charToWin1255Byte = new Map();

for ( let byte = 0; byte <= 255; byte++ ) {
	const decoded = win1255Decoder.decode( Uint8Array.from( [ byte ] ) );
	if ( ! charToWin1255Byte.has( decoded ) ) {
		charToWin1255Byte.set( decoded, byte );
	}
}

function repairMojibake( value ) {
	const text = String( value ?? '' );

	if ( ! /[\u0080-\u00ff\u05f3]/.test( text ) ) {
		return text;
	}

	const bytes = [];
	for ( const char of text ) {
		if ( charToWin1255Byte.has( char ) ) {
			bytes.push( charToWin1255Byte.get( char ) );
		} else {
			bytes.push( ...new TextEncoder().encode( char ) );
		}
	}

	const repaired = utf8Decoder.decode( Uint8Array.from( bytes ) );
	return repaired.includes( '\uFFFD' ) ? text : repaired;
}

function parseCsv( text ) {
	const rows = [];
	let row = [];
	let cell = '';
	let quoted = false;

	for ( let index = 0; index < text.length; index++ ) {
		const char = text[ index ];
		const next = text[ index + 1 ];

		if ( quoted ) {
			if ( char === '"' && next === '"' ) {
				cell += '"';
				index++;
			} else if ( char === '"' ) {
				quoted = false;
			} else {
				cell += char;
			}
			continue;
		}

		if ( char === '"' ) {
			quoted = true;
		} else if ( char === ',' ) {
			row.push( cell );
			cell = '';
		} else if ( char === '\n' ) {
			row.push( cell );
			rows.push( row );
			row = [];
			cell = '';
		} else if ( char !== '\r' ) {
			cell += char;
		}
	}

	if ( cell.length || row.length ) {
		row.push( cell );
		rows.push( row );
	}

	const [ headers, ...records ] = rows.filter( ( csvRow ) => csvRow.length && csvRow.some( Boolean ) );
	return records.map( ( record ) => Object.fromEntries( headers.map( ( header, index ) => [ header, repairMojibake( record[ index ] ?? '' ) ] ) ) );
}

function csvEscape( value ) {
	const text = String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function slugifyKey( value ) {
	return String( value )
		.normalize( 'NFKD' )
		.replace( /[\u0590-\u05ff]+/g, '' )
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-+|-+$/g, '' )
		.slice( 0, 54 ) || 'public-basic-lawyer';
}

function cityDecision( city ) {
	if ( ! city.trim() ) {
		return 'Leave city empty until manually validated in wp-admin.';
	}
	return `Use existing city term if present: ${ city }. Do not create a new city term without owner approval.`;
}

function buildEntry( candidate, index ) {
	const name = candidate.full_name.trim();
	const firm = candidate.firm_name.trim() || name;
	const practice = candidate.practice_areas.trim();
	const source = candidate.source_url.trim();
	const sourceSite = candidate.source_site.trim();
	const city = candidate.city.trim();
	const phone = candidate.phone.trim();
	const slug = slugifyKey( `${ sourceSite }-${ name }-${ index + 1 }` );

	return {
		order: index + 1,
		source_site: sourceSite,
		source_url: source,
		post_type: 'justice_lawyer',
		post_title: name,
		post_slug_suggestion: slug,
		admin_entry_status: 'draft_first_do_not_publish',
		activation_after_owner_approval: 'post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified',
		lawyer_full_name: name,
		firm_name: firm,
		bio_short: `כרטיס בסיסי ציבורי להכנה פנימית: ${ name }. המידע נאסף ממקור פומבי לצורך בדיקת התאמה ותביעת כרטיס. לא מוצגות חוות דעת, דירוגים, תמונות או טענת אימות לפני אישור.`,
		profile_headline: `כרטיס בסיסי לא מאומת - ${ firm }`,
		practice_area_instruction: practice || 'Use family-law only if the public source clearly supports it.',
		city_instruction: cityDecision( city ),
		phone_instruction: phone ? `Public source lists ${ phone }. Do not publish phone until owner validates the source and policy.` : 'No phone entry in the draft packet.',
		photo_instruction: 'Do not copy competitor photos. Use the initials fallback only unless the lawyer supplies/approves media.',
		review_instruction: 'Do not copy reviews, ratings, recommendation labels or client quotes.',
		plan_type: 'free',
		subscription_status: 'inactive',
		verification_status: 'unverified',
		source_type: 'public_index',
		profile_status_draft: 'pending',
		profile_status_public_after_approval: 'public',
		admin_profile_visibility: 'hide until owner approves public activation',
		internal_notes: [
			'PUBLIC_BASIC_CARD_DRAFT',
			`source_site=${ sourceSite }`,
			`source_url=${ source }`,
			'do_not_copy_reviews_or_photos',
			'do_not_claim_verified_or_recommended',
			'activate_public_only_after_owner_approval',
		].join( ' | ' ),
	};
}

function markdownTable( rows ) {
	return rows.map( ( row ) => `| ${ row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ) } |` ).join( '\n' );
}

const candidates = parseCsv( await fs.readFile( sourcePath, 'utf8' ) )
	.filter( ( candidate ) => candidate.proposed_status === 'ready_for_owner_review' )
	.slice( 0, 10 );

const entries = candidates.map( buildEntry );

const csvHeaders = [
	'order',
	'post_title',
	'admin_entry_status',
	'lawyer_full_name',
	'firm_name',
	'profile_headline',
	'practice_area_instruction',
	'city_instruction',
	'phone_instruction',
	'plan_type',
	'subscription_status',
	'verification_status',
	'source_type',
	'profile_status_draft',
	'profile_status_public_after_approval',
	'internal_notes',
	'source_url',
];

const csv = [
	csvHeaders.join( ',' ),
	...entries.map( ( entry ) => csvHeaders.map( ( header ) => csvEscape( entry[ header ] ) ).join( ',' ) ),
].join( '\n' ) + '\n';

const markdown = `# Lawyer CMS Draft Entry Packet - 2026-05-25

## Purpose
This packet converts the reviewed public-index lawyer candidates into a draft-first wp-admin entry plan.

It is designed for fast manual CMS work after WordPress admin access is available, without accidentally publishing public cards or copying competitor assets.

## Non-Negotiable Safety Rules
- Create these as drafts/private preparation first.
- Do not publish public cards until the owner explicitly approves activation.
- Do not copy competitor photos, reviews, ratings, recommendation badges or client quotes.
- Do not claim the lawyer is verified, recommended, paid or connected to Jus-Tice.
- Do not create new taxonomy terms unless the owner approves taxonomy work.
- Use the initials fallback for visuals unless the lawyer supplies or approves media.

## First 10 Draft Entries
${ markdownTable( [
	[ 'Order', 'Name', 'Source', 'Practice/City Instruction', 'Activation Boundary' ],
	[ '---', '---', '---', '---', '---' ],
	...entries.map( ( entry ) => [
		entry.order,
		entry.post_title,
		entry.source_site,
		`${ entry.practice_area_instruction } / ${ entry.city_instruction }`,
		entry.activation_after_owner_approval,
	] ),
] ) }

## Required Meta Defaults
- post_type: \`justice_lawyer\`
- initial post status: draft/private preparation only
- \`plan_type=free\`
- \`subscription_status=inactive\`
- \`verification_status=unverified\`
- \`source_type=public_index\`
- draft \`profile_status=pending\`
- public activation, only after explicit owner approval: \`post_status=publish\`, \`profile_status=public\`, \`admin_profile_visibility=auto\`

## Generated Files
- CSV entry sheet: \`project-control/lawyer-cms-draft-entry-packet-2026-05-25.csv\`
- JSON report: \`reports/lawyer-cms-draft-entry-packet-2026-05-25.json\`

## Completion View
- Prepared draft-entry packet: ${ entries.length } lawyer candidates.
- Live CMS records created in this run: 0.
- Public cards activated in this run: 0.
`;

await fs.mkdir( path.dirname( outJson ), { recursive: true } );
await fs.writeFile( outCsv, csv );
await fs.writeFile( outMd, markdown );
await fs.writeFile( outJson, JSON.stringify( { generatedAt: new Date().toISOString(), sourcePath, entries }, null, 2 ) + '\n' );

console.log( JSON.stringify( { status: 'PASS', entries: entries.length, outMd, outCsv, outJson }, null, 2 ) );
