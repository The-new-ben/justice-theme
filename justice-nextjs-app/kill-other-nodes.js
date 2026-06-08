const { execSync } = require('child_process');
const myPid = process.pid;
const parentPid = process.ppid;
console.log(`My PID: ${myPid}, Parent PID: ${parentPid}`);

const output = execSync('powershell "Get-Process node | Select-Object Id"').toString();
const pids = output.split('\r\n')
  .map(line => line.trim())
  .filter(line => /^\d+$/.test(line))
  .map(Number);

console.log('Found Node PIDs:', pids);

for (const pid of pids) {
  if (pid !== myPid && pid !== parentPid) {
    console.log(`Killing Node process ${pid}...`);
    try {
      execSync(`taskkill /F /PID ${pid}`);
    } catch (err) {
      console.log(`Failed to kill PID ${pid}:`, err.message);
    }
  }
}
