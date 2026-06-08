const { spawn } = require('child_process');
const net = require('net');
const http = require('http');

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
          console.log(`Server responded with 200! Settle delay (3s)...`);
          setTimeout(resolve, 3000);
        } else {
          setTimeout(check, 1000);
        }
      });

      req.on('error', (err) => {
        setTimeout(check, 1000);
      });
      
      req.end();
    }
    check();
  });
}

async function main() {
  console.log('🚀 Initializing JUS-TICE Adversarial SEO & E-E-A-T Test Runner...');

  let port;
  try {
    port = await findFreePort();
    console.log(`Port allocated: ${port}`);
  } catch (err) {
    console.error('Failed to find an open port:', err.message);
    process.exit(1);
  }

  console.log(`Starting Next.js production server on port ${port}...`);
  
  const serverProcess = spawn('npx', ['next', 'start', '-p', port.toString()], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: port.toString() }
  });

  serverProcess.stdout.on('data', (data) => {
    const line = data.toString().trim();
    if (line) {
      console.log(`[Next.js Server] ${line}`);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString()}`);
  });

  let serverExited = false;
  serverProcess.on('exit', (code) => {
    serverExited = true;
    console.log(`Next.js server process exited with code ${code}`);
  });

  const cleanup = () => {
    console.log('Stopping Next.js server...');
    if (!serverExited) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', serverProcess.pid.toString()], { shell: true });
      } else {
        serverProcess.kill('SIGKILL');
      }
    }
  };

  try {
    await waitForServer(port);
    console.log('Next.js server is ready! Launching E2E adversarial tests...');

    const testProcess = spawn('node', ['tests/e2e/adversarial_seo_eeat.js'], {
      cwd: process.cwd(),
      shell: true,
      env: { ...process.env, PORT: port.toString() },
      stdio: 'inherit'
    });

    testProcess.on('exit', (code) => {
      cleanup();
      console.log(`Adversarial tests finished. Exit code: ${code}`);
      process.exit(code || 0);
    });

  } catch (err) {
    console.error('Test runner failed during execution:', err.message);
    cleanup();
    process.exit(1);
  }
}

main();
