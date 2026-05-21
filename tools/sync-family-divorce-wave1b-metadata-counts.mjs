import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const TODAY = '2026-05-21';

const STATIC_QA_PATH = path.join(ROOT, 'reports/family-divorce-public-body-static-qa-2026-05-21.csv');
const METADATA_PATH = path.join(ROOT, 'project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv');
const OUT_CSV = path.join(ROOT, 'reports', `family-divorce-wave1b-metadata-word-count-sync-${TODAY}.csv`);
const PROJECT_CONTROL_CSV = path.join(ROOT, 'project-control', `family-divorce-wave1b-metadata-word-count-sync-${TODAY}.csv`);
const DRY_RUN = process.argv.includes('--dry-run');

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  if (quoted) throw new Error(`Unclosed CSV quote in line: ${line.slice(0, 80)}`);
  return values;
}

function readCsvRows(filePath) {
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`${path.relative(ROOT, filePath)}: expected ${headers.length} columns, got ${values.length}`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function csvEscape(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function toCsv(rows, columns) {
  return `${columns.join(',')}\n${rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n')}\n`;
}

function normalizePath(value) {
  if (!value) return '';
  let pathname = value;
  try {
    pathname = value.startsWith('http') ? new URL(value).pathname : new URL(value, 'https://jus-tice.co.il').pathname;
  } catch (_err) {
    pathname = value;
  }
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (!/\.[a-z0-9]{2,8}$/i.test(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function firstCommaPositions(line, count) {
  const positions = [];
  for (let index = 0; index < line.length && positions.length < count; index += 1) {
    if (line[index] === ',') positions.push(index);
  }
  return positions;
}

function main() {
  const staticRows = readCsvRows(STATIC_QA_PATH);
  const wordsByPath = new Map(staticRows.map((row) => [normalizePath(row.target), row.words]));

  const metadataText = readFileSync(METADATA_PATH, 'utf8');
  const hasTrailingNewline = /\r?\n$/.test(metadataText);
  const metadataLines = metadataText.split(/\r?\n/);
  if (hasTrailingNewline) metadataLines.pop();

  const reportRows = [];
  const updatedLines = metadataLines.map((line, index) => {
    if (index === 0 || line.trim() === '') return line;

    // The first six metadata columns are simple scalar fields. Later Hebrew text
    // columns may contain unquoted commas, so only touch the trusted early slice.
    const commas = firstCommaPositions(line, 6);
    if (commas.length < 6) {
      reportRows.push({
        page_id: '',
        path: '',
        old_words: '',
        new_words: '',
        status: 'SKIPPED_MALFORMED_PREFIX',
      });
      return line;
    }

    const pageId = line.slice(0, commas[0]);
    const rawPath = line.slice(commas[0] + 1, commas[1]);
    const normalized = normalizePath(rawPath);
    const oldWords = line.slice(commas[4] + 1, commas[5]);
    const newWords = wordsByPath.get(normalized);

    if (!newWords) {
      reportRows.push({
        page_id: pageId,
        path: normalized,
        old_words: oldWords,
        new_words: '',
        status: 'SKIPPED_NO_STATIC_QA_MATCH',
      });
      return line;
    }

    const updatedLine = `${line.slice(0, commas[4] + 1)}${newWords}${line.slice(commas[5])}`;
    reportRows.push({
      page_id: pageId,
      path: normalized,
      old_words: oldWords,
      new_words: newWords,
      status: Number(oldWords) === Number(newWords) ? 'UNCHANGED' : 'FIXED',
    });
    return updatedLine;
  });

  if (!DRY_RUN) {
    writeFileSync(METADATA_PATH, `${updatedLines.join('\n')}${hasTrailingNewline ? '\n' : ''}`, 'utf8');
    mkdirSync(path.dirname(OUT_CSV), { recursive: true });
  }
  const reportCsv = toCsv(reportRows, [
    'page_id',
    'path',
    'old_words',
    'new_words',
    'status',
  ]);
  if (!DRY_RUN) {
    writeFileSync(OUT_CSV, reportCsv, 'utf8');
    writeFileSync(PROJECT_CONTROL_CSV, reportCsv, 'utf8');
  }

  const fixedCount = reportRows.filter((row) => row.status === 'FIXED').length;
  const skippedCount = reportRows.filter((row) => row.status.startsWith('SKIPPED')).length;
  if (DRY_RUN) {
    console.log('DRY RUN: no files written');
  } else {
    console.log(`Wrote ${path.relative(ROOT, OUT_CSV)}`);
    console.log(`Wrote ${path.relative(ROOT, PROJECT_CONTROL_CSV)}`);
    console.log(`Updated ${path.relative(ROOT, METADATA_PATH)}`);
  }
  console.log(`FIXED rows: ${fixedCount}`);
  console.log(`SKIPPED rows: ${skippedCount}`);
}

main();
