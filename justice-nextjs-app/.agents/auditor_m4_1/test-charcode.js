const fs = require('fs');
const path = require('path');

const testsPath = path.resolve(__dirname, '../../tests/e2e/tests.js');
const lines = fs.readFileSync(testsPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Trust banner not visible')) {
    console.log(`Line ${i + 1}: "${lines[i]}"`);
    console.log(`Codes: ${lines[i].split('').map(c => `${c}:${c.charCodeAt(0)}`).join(', ')}`);
  }
}
