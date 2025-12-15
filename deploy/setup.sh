#!/bin/bash
set -e

# Configuration
APP_NAME="sovereign_web"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="" # We will push via SCP/Git, so this might be empty for now or we set up a bare repo.
USER="root" # For simplicity in this initial script, but we should switch to a non-root user.

echo "Updating system..."
apt-get update && apt-get upgrade -y

echo "Installing dependencies..."
apt-get install -y python3-pip python3-venv nginx ufw fail2ban certbot python3-certbot-nginx

echo "Configuring Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "Creating application directory..."
mkdir -p $APP_DIR

echo "Installing Python dependencies..."
if [ -f "$APP_DIR/requirements.txt" ]; then
    python3 -m venv $APP_DIR/.venv
    $APP_DIR/.venv/bin/pip install -r $APP_DIR/requirements.txt
fi

echo "Configuring Nginx..."
cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/$APP_NAME
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "Configuring Systemd..."
cp $APP_DIR/deploy/gunicorn.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable gunicorn
systemctl restart gunicorn

echo "Setup complete! Site should be live at http://$(curl -s ifconfig.me)"
