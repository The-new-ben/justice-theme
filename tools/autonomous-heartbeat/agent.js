const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Load Config
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Setup Logger
const log = (message) => {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${message}\n`;
    console.log(formatted.trim());
    fs.appendFileSync(path.join(__dirname, config.logFile), formatted);
};

// Generic API Caller Function (supports OpenAI, OpenRouter, LMS, Gemini)
const fetchLLMResponse = async (stateOutput) => {
    const provider = config.apiProvider.toLowerCase();
    const apiKey = process.env.AGENT_API_KEY || '';
    
    if (provider !== 'lms' && (!apiKey || apiKey === 'YOUR_API_KEY_HERE')) {
        throw new Error('API Key missing for remote provider.');
    }

    const promptText = `${config.systemPrompt}\n\nCURRENT STATE:\n${stateOutput}`;
    
    // Gemini API Format
    if (provider === 'gemini') {
        const response = await fetch(`${config.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
        if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    
    // OpenAI Compatible Format (OpenAI, OpenRouter, LM Studio Local Server)
    if (['openai', 'openrouter', 'lms'].includes(provider)) {
        const headers = { 'Content-Type': 'application/json' };
        if (provider !== 'lms') headers['Authorization'] = `Bearer ${apiKey}`;
        if (provider === 'openrouter') headers['HTTP-Referer'] = 'http://localhost';

        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: config.model,
                messages: [
                    { role: 'system', content: config.systemPrompt },
                    { role: 'user', content: `CURRENT STATE:\n${stateOutput}` }
                ]
            })
        });
        
        if (!response.ok) throw new Error(`${provider} API Error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    throw new Error('Unsupported apiProvider in config.json');
};

// Execution Core
const performHeartbeatTask = async () => {
    log('--- HEARTBEAT INITIATED ---');
    try {
        log(`Checking state in ${config.targetDirectory} using command: ${config.stateCommand}`);
        let stateOutput = '';
        try {
            stateOutput = execSync(config.stateCommand, { cwd: config.targetDirectory, encoding: 'utf8' });
        } catch (e) {
            stateOutput = `Error running state command: ${e.message}`;
        }
        
        log(`Current State Snippet: ${stateOutput.substring(0, 150)}...`);

        log(`Sending state to ${config.apiProvider.toUpperCase()} API for reasoning...`);
        const llmResponse = await fetchLLMResponse(stateOutput);
        log(`LLM Response: ${llmResponse}`);
        
        try {
            // Extract JSON from response
            const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const decision = JSON.parse(jsonMatch[0]);
                if (decision.action === 'execute' && decision.script) {
                    log(`Executing autonomous script: ${decision.script}`);
                    const result = execSync(decision.script, { cwd: config.targetDirectory, encoding: 'utf8' });
                    log(`Execution Result: ${result}`);
                } else {
                    log('LLM decided to sleep/take no action.');
                }
            } else {
                log('No JSON action block found in LLM response.');
            }
        } catch (err) {
            log(`Failed to parse/execute LLM action: ${err.message}`);
        }

        log('Heartbeat cycle complete.');

    } catch (error) {
        log(`HEARTBEAT ERROR: ${error.message}`);
    }
};

// Scheduling Loop
const intervalMs = config.heartbeatIntervalMinutes * 60 * 1000;
log(`Agent framework started. Heartbeat set to every ${config.heartbeatIntervalMinutes} minutes.`);
performHeartbeatTask();
setInterval(performHeartbeatTask, intervalMs);
