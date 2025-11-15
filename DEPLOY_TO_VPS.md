# 🚀 Deploy به VPS Ubuntu

## 📋 راهنمای کامل Deploy

---

## مرحله 1: آماده‌سازی VPS

### اتصال به VPS:

```bash
ssh root@YOUR_VPS_IP
```

### نصب Node.js:

```bash
# آپدیت سیستم
apt update && apt upgrade -y

# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# بررسی نصب
node --version
npm --version
```

### نصب PM2 (Process Manager):

```bash
npm install -g pm2
```

### نصب Nginx (برای proxy):

```bash
apt install -y nginx
```

---

## مرحله 2: آپلود فایل‌های پروژه

### روش 1: با Git (پیشنهادی)

```bash
# نصب Git
apt install -y git

# Clone repository
cd /var/www
git clone https://github.com/mohammadmehdi-zangarki/vpn-management-system.git
cd vpn-management-system
```

### روش 2: با SCP (از کامپیوتر شما)

```bash
# از کامپیوتر ویندوز (PowerShell):
scp -r G:\vpn\backend root@YOUR_VPS_IP:/var/www/
scp -r G:\vpn\admin-panel root@YOUR_VPS_IP:/var/www/
```

---

## مرحله 3: راه‌اندازی Backend

```bash
cd /var/www/vpn-management-system/backend

# نصب dependencies
npm install --production

# ایجاد فایل .env
cat > .env << EOF
PORT=3000
DB_PATH=/var/www/vpn-management-system/backend/database.sqlite
EOF

# تست اجرا
npm start

# اگر کار کرد، Ctrl+C بزنید
```

### اجرا با PM2 (برای اینکه همیشه در حال اجرا باشد):

```bash
# شروع با PM2
pm2 start server.js --name vpn-backend

# ذخیره برای restart خودکار
pm2 save

# فعال کردن startup
pm2 startup
```

بررسی:
```bash
pm2 status
pm2 logs vpn-backend
```

---

## مرحله 4: راه‌اندازی Admin Panel

```bash
cd /var/www/vpn-management-system/admin-panel

# نصب dependencies
npm install

# Build برای production
npm run build
```

فایل‌های build شده در `dist/` قرار می‌گیرند.

---

## مرحله 5: تنظیم Nginx

### ایجاد فایل کانفیگ Nginx:

```bash
nano /etc/nginx/sites-available/vpn-panel
```

**محتوای فایل:**

```nginx
# Backend API
server {
    listen 80;
    server_name YOUR_DOMAIN.com;  # یا IP سرور

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
    }

    # Admin Panel (Static Files)
    location / {
        root /var/www/vpn-management-system/admin-panel/dist;
        try_files $uri $uri/ /index.html;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type';
    }
}
```

**⚠️ تغییر دهید:** `YOUR_DOMAIN.com` را با domain یا IP سرور خود عوض کنید.

### فعال کردن سایت:

```bash
# لینک به sites-enabled
ln -s /etc/nginx/sites-available/vpn-panel /etc/nginx/sites-enabled/

# حذف default
rm /etc/nginx/sites-enabled/default

# تست کانفیگ
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## مرحله 6: فعال کردن Firewall

```bash
# اجازه دسترسی به پورت‌ها
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp

# فعال کردن firewall
ufw enable
```

---

## مرحله 7: تست

### تست Backend:

```bash
curl http://YOUR_VPS_IP/api/health
```

باید ببینید:
```json
{"status":"ok","message":"VPN API is running"}
```

### تست Admin Panel:

مرورگر:
```
http://YOUR_VPS_IP
```

باید پنل ادمین را ببینید!

---

## مرحله 8: تنظیم برنامه Desktop

در کامپیوتر ویندوز خودتان:

### ویرایش فایل `desktop-app/renderer.js`:

```javascript
// تغییر این خط:
const API_BASE_URL = 'http://localhost:3000/api';

// به:
const API_BASE_URL = 'http://YOUR_VPS_IP/api';
// یا اگر domain دارید:
const API_BASE_URL = 'https://YOUR_DOMAIN.com/api';
```

### دوباره package کردن:

```bash
cd G:\vpn\desktop-app
npm run package
xcopy /E /I /Y v2ray-core dist-package\VPNApp-win32-x64\resources\app\v2ray-core
```

### اجرا:

```
dist-package\VPNApp-win32-x64\VPNApp.exe
```

الان به سرور شما متصل می‌شود! ✅

---

## 🔒 امن‌سازی (اختیاری ولی توصیه می‌شود):

### نصب SSL با Let's Encrypt:

```bash
# نصب Certbot
apt install -y certbot python3-certbot-nginx

# دریافت SSL Certificate (اگر domain دارید)
certbot --nginx -d YOUR_DOMAIN.com

# Nginx خودکار تنظیم می‌شود
```

بعد در `renderer.js`:
```javascript
const API_BASE_URL = 'https://YOUR_DOMAIN.com/api';
```

---

## 📊 مدیریت با PM2:

```bash
# مشاهده status
pm2 status

# مشاهده logs
pm2 logs vpn-backend

# Restart
pm2 restart vpn-backend

# Stop
pm2 stop vpn-backend

# مانیتورینگ
pm2 monit
```

---

## 🐛 عیب‌یابی:

### Backend کار نمی‌کند:

```bash
pm2 logs vpn-backend --lines 100
```

### Nginx خطا می‌دهد:

```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### پورت در دسترس نیست:

```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :3000
```

---

## 🎯 خلاصه:

```
VPS Ubuntu:
  ├── Nginx (Port 80/443)
  │     ├── / → Admin Panel (Static)
  │     └── /api/ → Backend (Proxy to :3000)
  └── PM2
        └── Backend (Port 3000)

Windows Desktop:
  └── برنامه → http://YOUR_VPS_IP/api
```

---

موفق باشید! 🚀

