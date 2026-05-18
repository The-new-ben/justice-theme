module.exports = {
  apps: [{
    name: "autonomous-agent",
    script: "./agent.js",
    watch: ["config.json"],
    max_memory_restart: "500M",
    autorestart: true,
    env: {
      NODE_ENV: "production"
    }
  }]
}
