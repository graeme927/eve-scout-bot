# EvE Scout Discord Webhook

A lightweight Discord webhook service that monitors **EvE-Scout wormhole connections** and posts clean intel-style notifications directly into Discord.

Supports:

* 🟣 Thera connections
* 🔵 Turnur connections
* 🌍 Region filtering via `.env`
* 📦 Persistent duplicate prevention (`seen.json`)
* 🐳 Docker deployment
* 🚦 Discord rate-safe queue
* 🛰️ Clean Discord embeds

---

## Features

* Tracks new wormhole signatures from EvE-Scout
* Sends updates to Discord using **webhooks** (no bot required)
* Filters wormholes by destination region
* Prevents duplicate posts across restarts
* Docker-first deployment
* Configurable polling interval
* Supports multiple tracked hubs

---

## Example Discord Output

```text
New Turnur Connection to V-QXXK

Connection
Turnur → V-QXXK

Details
Wormhole Type: S199
Max Ship Size: Capital
Time Remaining: 16 hours

Region
Insmother

Signatures
Turnur: BJO-555
V-QXXK: HPK-193
```

---

# Requirements

* Docker
* Docker Compose
* Discord webhook URL

---

# Installation

## Clone

```bash
git clone https://github.com/graeme927/eve-scout-bot

cd eve-scout-discord-bot
```

---

## Configure Environment

Copy:

```bash
cp .env.example .env
```

Edit:

```bash
nano .env
```

Example:

```env
WEBHOOK_URL=https://discord.com/api/webhooks/XXX/YYY

SCAN_INTERVAL=60

FILTER_REGIONS=Scalding Pass,Insmother,Wicked Creek
```

---

# Environment Variables

| Variable       | Required | Default | Description                      |
| -------------- | -------- | ------- | -------------------------------- |
| WEBHOOK_URL    | Yes      | —       | Discord webhook URL              |
| SCAN_INTERVAL  | No       | 60      | Poll interval (seconds)          |
| FILTER_REGIONS | No       | Empty   | Comma-separated region allowlist |

---

## Region Filtering

Show only selected regions:

```env
FILTER_REGIONS=Scalding Pass,Insmother,Wicked Creek
```

Disable filtering:

```env
FILTER_REGIONS=
```

---

# Running

Build and start:

```bash
docker compose up --build -d
```

View logs:

```bash
docker logs -f eve-scout-bot
```

Stop:

```bash
docker compose down
```

---

# Updating

Pull latest code:

```bash
git pull
```

Rebuild:

```bash
docker compose up --build -d
```

---

# Data Persistence

Duplicate prevention data is stored in:

```text
data/seen.json
```

This file tracks previously posted signatures.

Delete to reset:

```bash
rm data/seen.json
```

---

# Project Structure

```text
.
├── src/
│   ├── index.js
│   ├── scanner.js
│   ├── webhook.js
│   ├── config.js
│   ├── state.js
│   └── eveScout.js
│
├── data/
│   └── seen.json
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

---

# Troubleshooting

## Webhook 401

Verify:

* webhook exists
* full webhook URL copied
* `.env` loaded correctly

Rebuild:

```bash
docker compose up --build -d
```

---

## Duplicate Posts

Check:

```text
data/seen.json
```

---

## Region Filter Not Working

Verify formatting:

```env
FILTER_REGIONS=Scalding Pass,Insmother
```

(No quotes)

---

## Docker Permission Errors

Add user:

```bash
sudo usermod -aG docker $USER
```

Then log out and back in.

---

# Credits

Built using:

* EvE Scout API
* Discord Webhooks
* Node.js
* Docker
