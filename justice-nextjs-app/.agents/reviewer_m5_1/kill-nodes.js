const { execSync } = require('child_process');
const currentPid = process.pid;
const ppid = process.ppid;

console.log(`Current PID: ${currentPid}, Parent PID: ${ppid}`);

try {
  const output = execSync('powershell -Command "Get-Process node | Select-Object -ExpandProperty Id"').toString().trim();
  if (!output) {
    console.log('No node processes found.');
    process.exit(0);
  }
  
  const pids = output.split(/\r?\n/).map(p => parseInt(p.trim(), 10)).filter(p => !isNaN(p));
  pids.forEach(pid => {
    if (pid && pid !== currentPid && pid !== ppid) {
      console.log(`Killing process ${pid}...`);
      try {
        process.kill(pid, 'SIGKILL');
        console.log(`Successfully killed process ${pid}.`);
      } catch (e) {
        console.log(`Failed to kill process ${pid}: ${e.message}`);
      }
    }
  });
} catch (err) {
  console.error('Error during execution:', err.message);
}
