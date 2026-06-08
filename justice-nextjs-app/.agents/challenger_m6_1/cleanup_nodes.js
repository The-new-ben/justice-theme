const { execSync } = require('child_process');

function getProcessTree() {
  const pids = new Set();
  let currentPid = process.pid;
  while (currentPid) {
    pids.add(currentPid);
    // Get parent PID using powershell
    try {
      const parentOutput = execSync(`powershell "(Get-Process -Id ${currentPid}).Parent.Id"`, { encoding: 'utf8' }).trim();
      const parentPid = parseInt(parentOutput, 10);
      if (parentPid && !pids.has(parentPid)) {
        currentPid = parentPid;
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }
  return pids;
}

const safePids = getProcessTree();
console.log('Safe PIDs (our process tree):', Array.from(safePids));

// Get all Node PIDs
const output = execSync('powershell "Get-Process node | Select-Object Id"', { encoding: 'utf8' }).toString();
const nodePids = output.split('\r\n')
  .map(line => line.trim())
  .filter(line => /^\d+$/.test(line))
  .map(Number);

console.log('All Node PIDs:', nodePids);

for (const pid of nodePids) {
  if (!safePids.has(pid)) {
    console.log(`Killing Node process ${pid}...`);
    try {
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Successfully killed ${pid}`);
    } catch (err) {
      console.log(`Failed to kill PID ${pid}:`, err.message);
    }
  } else {
    console.log(`Skipping safe Node process ${pid}`);
  }
}
