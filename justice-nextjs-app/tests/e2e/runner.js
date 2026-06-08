const { spawn } = require('child_process');
const net = require('net');
const http = require('http');

// Helper to find a random available TCP port
function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => reject(err));
  });
}

// Helper to poll the dev server until it's responsive
function waitForServer(port, timeoutMs = 90000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server readiness check timed out after ${timeoutMs}ms`));
        return;
      }
      
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        if (res.statusCode === 200) {
          console.log(`Server responded with 200! Waiting 12 seconds to settle and compile home page...`);
          setTimeout(resolve, 12000);
        } else {
          console.log(`Server responded with status ${res.statusCode}. Retrying in 2 seconds...`);
          setTimeout(check, 2000);
        }
      });

      req.on('error', (err) => {
        console.log(`Connection error: ${err.message}. Retrying in 2 seconds...`);
        setTimeout(check, 2000);
      });
      
      req.end();
    }
    check();
  });
}


async function main() {
  console.log('🚀 Initializing JUS-TICE E2E Test Runner...');

  const fs = require('fs');
  const path = require('path');
  const nextDir = path.join(process.cwd(), '.next');
  
  // Skip cleaning up .next folder to preserve production build
  console.log('Preserving existing .next folder for production start...');

  let port;
  try {
    port = await findFreePort();
    console.log(`Port allocated: ${port}`);
  } catch (err) {
    console.error('Failed to find an open port:', err.message);
    process.exit(1);
  }

  console.log(`Starting Next.js production server on port ${port}...`);
  
  // Spawn Next.js production server
  const serverProcess = spawn('npx', ['next', 'start', '-p', port.toString()], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: port.toString(), NEXT_PUBLIC_GTM_ID: 'GTM-TEST1234' }
  });

  // Log server output to check for startup errors
  serverProcess.stdout.on('data', (data) => {
    const line = data.toString().trim();
    if (line) {
      console.log(`[Next.js Server] ${line}`);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString()}`);
  });

  // Handle sudden server exits during startup
  let serverExited = false;
  serverProcess.on('exit', (code) => {
    serverExited = true;
    console.log(`Next.js server process exited with code ${code}`);
  });

  const cleanup = () => {
    console.log('Stopping Next.js dev server...');
    if (!serverExited) {
      if (process.platform === 'win32') {
        // Under Windows, kill process tree to clean up shell wrappers
        spawn('taskkill', ['/F', '/T', '/PID', serverProcess.pid.toString()], { shell: true });
      } else {
        serverProcess.kill('SIGKILL');
      }
    }
  };

  try {
    await waitForServer(port);
    console.log('Next.js dev server is ready! Launching E2E test suite...');

    // Run tests
    const testProcess = spawn('node', ['tests/e2e/tests.js'], {
      cwd: process.cwd(),
      shell: true,
      env: { ...process.env, PORT: port.toString() },
      stdio: 'inherit'
    });

    testProcess.on('exit', (code) => {
      cleanup();
      console.log(`E2E tests finished. Exit code: ${code}`);
      process.exit(code || 0);
    });

  } catch (err) {
    console.error('Test runner failed during execution:', err.message);
    cleanup();
    process.exit(1);
  }
}

main();
