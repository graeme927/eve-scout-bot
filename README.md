# EvE Scout Wormhole Bot

## Install

### 1. Clone repo
git clone https://github.com/graeme927/eve-scout-bot

cd eve-scout-bot

### 2. Configure env
cp .env.example .env

nano .env

Add your webhook

Add regions you wish to watch, or leave blank to see all

### 3. Run with Docker
docker compose up --build -d

### 4. View logs
docker logs -f eve-scout-bot

### 5. Stop
docker compose down
