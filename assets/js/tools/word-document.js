/** Small, dependency-free OOXML writer. All bytes stay in the browser; no HTML disguised as Word. */
const WORD_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const WORD_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/';
const WORD_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
export const WORD_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function wordEscape(value) {
	return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
		.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wordCrc32(bytes) {
	let crc = 0xffffffff;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit += 1) { crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
	}
	return (crc ^ 0xffffffff) >>> 0;
}

/** ZIP STORE: these small text documents need neither compression nor an external library. */
function wordZip(files) {
	const encoder = new TextEncoder();
	const locals = []; const central = [];
	let offset = 0;
	for (const [name, text] of Object.entries(files)) {
		const path = encoder.encode(name); const bytes = encoder.encode(text); const crc = wordCrc32(bytes);
		const local = new Uint8Array(30 + path.length + bytes.length); const lv = new DataView(local.buffer);
		lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
		lv.setUint16(12, 33, true); // 1980-01-01; deterministic, no user or creation metadata.
		lv.setUint32(14, crc, true); lv.setUint32(18, bytes.length, true); lv.setUint32(22, bytes.length, true);
		lv.setUint16(26, path.length, true); local.set(path, 30); local.set(bytes, 30 + path.length);
		const entry = new Uint8Array(46 + path.length); const cv = new DataView(entry.buffer);
		cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
		cv.setUint16(8, 0x0800, true); cv.setUint16(14, 33, true); cv.setUint32(16, crc, true);
		cv.setUint32(20, bytes.length, true); cv.setUint32(24, bytes.length, true); cv.setUint16(28, path.length, true);
		cv.setUint32(42, offset, true); entry.set(path, 46);
		locals.push(local); central.push(entry); offset += local.length;
	}
	const centralSize = central.reduce((sum, part) => sum + part.length, 0);
	const end = new Uint8Array(22); const ev = new DataView(end.buffer);
	ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, locals.length, true); ev.setUint16(10, locals.length, true);
	ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
	const archive = new Uint8Array(offset + centralSize + end.length);
	let cursor = 0;
	for (const part of [...locals, ...central, end]) { archive.set(part, cursor); cursor += part.length; }
	return archive;
}

/** Plain editable paragraphs, black Arial, RTL, Letter. Layout follows the HAD-552 Claude Design brief. */
export function wordDocument(paragraphs) {
	const body = paragraphs.map(({ text, style = 'Normal', keepNext = false, keepLines = false }) => {
		const safeStyle = ['Title', 'Heading1', 'Notice', 'Normal'].includes(style) ? style : 'Normal';
		const runs = String(text).split(/(\n|\t)/).map((part) => part === '\n' ? '<w:r><w:br/></w:r>' : part === '\t' ? '<w:r><w:tab/></w:r>' : `<w:r><w:t xml:space="preserve">${wordEscape(part)}</w:t></w:r>`).join('');
		// Bidi paragraphs use their start edge (right). Explicit "right" is mirrored by Word/LibreOffice.
		return `<w:p><w:pPr><w:pStyle w:val="${safeStyle}"/>${keepNext ? '<w:keepNext/>' : ''}${keepLines ? '<w:keepLines/>' : ''}<w:bidi/></w:pPr>${runs}</w:p>`;
	}).join('');
	const styles = `<w:styles xmlns:w="${WORD_NS}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:color w:val="000000"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="he-IL" w:bidi="he-IL"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:widowControl/><w:bidi/><w:spacing w:after="120" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>`
		+ '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>'
		+ '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>'
		+ '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="100"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>'
		+ '<w:style w:type="paragraph" w:styleId="Notice"><w:name w:val="Notice"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:after="240"/></w:pPr></w:style></w:styles>';
	return wordZip({
		'[Content_Types].xml': WORD_XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>',
		'_rels/.rels': WORD_XML + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${WORD_REL}officeDocument" Target="word/document.xml"/></Relationships>`,
		'word/document.xml': WORD_XML + `<w:document xmlns:w="${WORD_NS}"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1152" w:right="1152" w:bottom="1152" w:left="1152" w:header="0" w:footer="0" w:gutter="0"/><w:bidi/></w:sectPr></w:body></w:document>`,
		'word/styles.xml': WORD_XML + styles,
		'word/_rels/document.xml.rels': WORD_XML + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${WORD_REL}styles" Target="styles.xml"/></Relationships>`,
	});
}
