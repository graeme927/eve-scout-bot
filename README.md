# EvE Scout Wormhole Bot

## Install

### 1. Clone repo
git clone https://github.com/graeme927/eve-scout-bot.git

cd eve-scout-bot

### 2. Configure env and provide your own discords webhook
cp .env.example .env

nano .env

### 3. Run with Docker
docker compose up -d

### 4. View logs
docker logs -f eve-scout-bot

### 5. Stop
docker compose down
