#!/bin/bash

# اسکریپت خودکار Deploy برای VPS Ubuntu
# اجرا: bash DEPLOY_COMMANDS.sh

echo "=========================================="
echo "  VPN Management System - Auto Deploy"
echo "=========================================="
echo ""

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# چک root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}لطفاً با root اجرا کنید: sudo bash DEPLOY_COMMANDS.sh${NC}"
  exit 1
fi

echo -e "${YELLOW}[1/8] آپدیت سیستم...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ آپدیت کامل شد${NC}"
echo ""

echo -e "${YELLOW}[2/8] نصب Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✓ Node.js نصب شد: $(node --version)${NC}"
echo ""

echo -e "${YELLOW}[3/8] نصب PM2...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 نصب شد${NC}"
echo ""

echo -e "${YELLOW}[4/8] نصب Nginx...${NC}"
apt install -y nginx
echo -e "${GREEN}✓ Nginx نصب شد${NC}"
echo ""

echo -e "${YELLOW}[5/8] نصب Git...${NC}"
apt install -y git
echo -e "${GREEN}✓ Git نصب شد${NC}"
echo ""

echo -e "${YELLOW}[6/8] Clone repository...${NC}"
cd /var/www
if [ -d "vpn-management-system" ]; then
    echo "پوشه موجود است، در حال pull..."
    cd vpn-management-system
    git pull
else
    echo "در حال clone..."
    git clone https://github.com/mohammadmehdi-zangarki/vpn-management-system.git
    cd vpn-management-system
fi
echo -e "${GREEN}✓ Repository آماده است${NC}"
echo ""

echo -e "${YELLOW}[7/8] راه‌اندازی Backend...${NC}"
cd /var/www/vpn-management-system/backend

# نصب dependencies
npm install --production

# ایجاد .env
cat > .env << EOF
PORT=3000
DB_PATH=/var/www/vpn-management-system/backend/database.sqlite
EOF

# شروع با PM2
pm2 delete vpn-backend 2>/dev/null
pm2 start server.js --name vpn-backend
pm2 save
echo -e "${GREEN}✓ Backend اجرا شد${NC}"
echo ""

echo -e "${YELLOW}[8/8] راه‌اندازی Admin Panel...${NC}"
cd /var/www/vpn-management-system/admin-panel

# نصب dependencies
npm install

# Build
npm run build

# تنظیم Nginx
cat > /etc/nginx/sites-available/vpn-panel << 'EOF'
server {
    listen 80;
    server_name _;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type' always;
    }

    # Admin Panel
    location / {
        root /var/www/vpn-management-system/admin-panel/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}
EOF

# فعال کردن سایت
ln -sf /etc/nginx/sites-available/vpn-panel /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# تست و restart Nginx
nginx -t && systemctl restart nginx
echo -e "${GREEN}✓ Nginx تنظیم شد${NC}"
echo ""

# فعال کردن PM2 startup
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

echo ""
echo "=========================================="
echo -e "${GREEN}  ✓ Deploy کامل شد!${NC}"
echo "=========================================="
echo ""
echo -e "Backend API: ${YELLOW}http://$(hostname -I | awk '{print $1}')/api/health${NC}"
echo -e "Admin Panel: ${YELLOW}http://$(hostname -I | awk '{print $1}')${NC}"
echo ""
echo "دستورات مفید:"
echo "  pm2 status          - وضعیت سرویس‌ها"
echo "  pm2 logs            - مشاهده logs"
echo "  pm2 restart all     - restart همه"
echo ""

