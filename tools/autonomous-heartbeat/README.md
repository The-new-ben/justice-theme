# Autonomous Heartbeat Agent Framework

This is a universally adaptable, continuous-loop background agent framework designed to run independently on any "Antigravity Station" (or standard PC). It uses a "Heartbeat Pattern" to periodically wake up, gather project context, pass it to an LLM via API, and autonomously execute commands.

## Why this Architecture?
As discovered in research of modern autonomous AI patterns (e.g., MindStudio, OpenClaw), IDE extensions (like the standard Antigravity chat window) cannot natively loop forever in the background without user interaction. 

To achieve true 24/7 background automation, the industry standard is to use a detached background process (like `Node.js` + `PM2`) that provides the heartbeat, state injection, and execution context. This framework does exactly that.

## Installation & Portability

Because this is a standard Node.js package, you can copy this entire folder (`tools/autonomous-heartbeat/`) to **any PC or project**.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Install PM2 globally (for background management):**
   ```bash
   npm install pm2 -g
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in this directory with your LLM API Key:
   ```env
   AGENT_API_KEY=your_gemini_or_openai_key_here
   ```

## Configuration (`config.json`)

You can customize this agent for *any* project by simply editing `config.json`:

- `heartbeatIntervalMinutes`: How often the agent wakes up (e.g., 10 minutes).
- `targetDirectory`: The root folder of the project you want the agent to monitor.
- `stateCommand`: The command the agent runs to "look" at the project state (e.g., `git status`, or a custom Node.js script that outputs an SEO report).
- `systemPrompt`: The core directive telling the LLM what its goal is and how to output its decisions.

## How to Run

### Option A: Testing / Foreground
Run it directly in the terminal to watch it work:
```bash
npm start
```

### Option B: 24/7 Background Mode (Recommended)
Use PM2 to run the agent completely in the background, surviving terminal closures and PC reboots.
```bash
npm run pm2:start
```

To view what the autonomous agent is doing at any time:
```bash
npm run pm2:logs
```

To stop the agent:
```bash
npm run pm2:stop
```

## Security Warning
This framework parses LLM JSON output and executes it via `execSync()`. Ensure your `systemPrompt` is highly constrained and test extensively before giving the agent full write-access to production environments.
