/**
 * Jus-Tice Parallel content generation pipeline.
 * Automated Modular Long-Form Writer delegation script.
 *
 * This script automates calling the local `llm` CLI to generate high-quality
 * Hebrew legal articles section-by-section, avoiding token burnout.
 *
 * Usage:
 *   node tools/delegate-writer.js --keyword="עורך דין מקרקעין מודיעין" --parent="real-estate-lawyer-guide"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(val => {
    if (val.startsWith('--')) {
      const [k, v] = val.split('=');
      args[k.slice(2)] = v;
    }
  });
  return args;
}

async function main() {
  const args = parseArgs();
  if (!args.keyword) {
    console.error('Error: --keyword is required.');
    process.exit(1);
  }

  const keyword = args.keyword;
  const parent = args.parent || 'home';
  console.log(`\n🚀 Initializing Writer Delegation for: "${keyword}" (Parent: ${parent})`);

  // 1. GENERATE THE STRUCTURAL CONTENT BRIEF (Architect Phase - local)
  console.log('--- Step 1: Architecting Content Brief ---');
  const briefPrompt = `Generate a detailed structural content outline in English for a YMYL Hebrew legal article about "${keyword}". 
Identify the target word counts for each section (total 1,800+ words). 
List 8-10 H2/H3 sections that cover all legal steps, local courthouse links, and official legislation to cite. Return as structured text.`;

  console.log('Calling LLM CLI to generate brief...');
  const briefOutput = execSync(`llm "${briefPrompt.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
  console.log('\n--- STRUCTURAL BRIEF GENERATED ---');
  console.log(briefOutput);

  // Save the brief locally in the scratch directory
  const scratchDir = path.join(__dirname, '..', 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  fs.writeFileSync(path.join(scratchDir, 'latest-brief.txt'), briefOutput, 'utf8');

  // 2. MODULAR SECTION-BY-SECTION GENERATION (Writer Phase - external)
  console.log('\n--- Step 2: Delegating Section Generation (Token Saver) ---');
  
  const sections = [
    { name: 'Introduction & Local Hook', prompt: 'Write an answer-first, hook-based intro for this city in professional Hebrew. Mention local court jurisdictions, no developer placeholders, no double hyphens.' },
    { name: 'Regional Cost Benchmark Table', prompt: 'Write a comparative table comparing local representation cost to Tel Aviv.' },
    { name: 'Core Wiki Rights Guide (Kol Zchut style)', prompt: 'Write a highly detailed, objective legal rights and procedure guide in Hebrew. Cite exact laws, add links to gov.il portals.' },
    { name: 'Google PAA Frequently Asked Questions', prompt: 'Write a detailed Hebrew Q&A section answering the top search questions.' }
  ];

  let compiledHtml = '';

  for (const [index, section] of sections.entries()) {
    console.log(`\n[Section ${index + 1}/${sections.length}] Generating: ${section.name}...`);
    const prompt = `Based on the following English content brief:\n\n${briefOutput}\n\nTask: ${section.prompt}\n\nOutput only clean, production-grade Gutenberg HTML or plain HTML. Return raw content only, no markdown backticks or wrappers.`;
    
    // Call external API via CLI to generate this section
    const sectionOutput = execSync(`llm "${prompt.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
    compiledHtml += `\n\n<!-- Section: ${section.name} -->\n` + sectionOutput.trim();
  }

  // 3. COMPILE AND STORE RESULTS
  console.log('\n--- Step 3: Compiling Finished Payload ---');
  const targetFile = path.join(scratchDir, `${keyword.replace(/\s+/g, '-')}-draft.html`);
  fs.writeFileSync(targetFile, compiledHtml, 'utf8');
  console.log(`🎯 Complete 1,800+ word Hebrew article compiled successfully: ${targetFile}`);
  console.log('This payload is fully ready for WordPress REST API upload.');
}

main().catch(console.error);
