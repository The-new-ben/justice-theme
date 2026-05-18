const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers
const configPath = path.join(__dirname, 'config.json');
const envPath = path.join(__dirname, '.env');
const logPath = path.join(__dirname, 'agent-activity.log');

// API: Get Config
app.get('/api/config', (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
        const providerMatch = envContent.match(/AGENT_API_PROVIDER=(.*)/);
        const keyMatch = envContent.match(/AGENT_API_KEY=(.*)/);
        
        res.json({
            config,
            provider: providerMatch ? providerMatch[1] : 'openrouter',
            apiKey: keyMatch ? keyMatch[1] : ''
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API: Save Config
app.post('/api/config', (req, res) => {
    try {
        const { config, provider, apiKey } = req.body;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        fs.writeFileSync(envPath, `AGENT_API_PROVIDER=${provider}\nAGENT_API_KEY=${apiKey}\n`);
        
        // Auto-restart agent on save
        execSync('cmd.exe /c pm2 restart autonomous-agent');
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API: Get Logs
app.get('/api/logs', (req, res) => {
    try {
        const logs = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : 'No logs yet...';
        // Return only last 100 lines for performance
        const logLines = logs.split('\n').slice(-100).join('\n');
        res.send(logLines);
    } catch (e) {
        res.status(500).send('Error reading logs');
    }
});

// API: PM2 Control
app.post('/api/pm2', (req, res) => {
    try {
        const { action } = req.body; // 'start', 'stop', 'restart'
        let command = '';
        if (action === 'start') command = 'cmd.exe /c pm2 start ecosystem.config.js';
        else if (action === 'stop') command = 'cmd.exe /c pm2 stop autonomous-agent';
        else if (action === 'restart') command = 'cmd.exe /c pm2 restart autonomous-agent';
        
        const output = execSync(command, { encoding: 'utf8' });
        res.json({ success: true, output });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Dashboard running at http://localhost:${PORT}`);
    execSync(`start http://localhost:${PORT}`);
});
