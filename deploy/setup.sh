#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Server Setup..."

# 1. Update and Upgrade System
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Curl and Git
echo "🛠 Installing Curl and Git..."
sudo apt install -y curl git unzip

# 3. Install Node.js (LTS version - currently v20)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node installation
node -v
npm -v

# 4. Install PM2 globally
echo "📈 Installing PM2..."
sudo npm install -g pm2

# 5. Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# 6. Adjust Firewall (UFW)
echo "🛡 Configuring Firewall..."
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 7. Install Certbot for SSL
echo "🔒 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

echo "✅ Server Setup Complete!"
echo "Next steps:"
echo "1. Clone your repository: git clone <repo_url>"
echo "2. Install dependencies: npm install"
echo "3. Build app: npm run build"
echo "4. Start with PM2: pm2 start npm --name 'presentbox' -- start"
echo "5. Configure Nginx proxy."
