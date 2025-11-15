# 🚀 Deploy مستقیم به VPS

## 📦 IP سرور شما: 89.44.241.83

---

## مرحله 1: آپلود فایل‌ها از ویندوز

در **PowerShell** ویندوز (کامپیوتر خودتان):

```powershell
# رفتن به پوشه پروژه
cd G:\vpn

# آپلود Backend
scp -r backend root@89.44.241.83:/var/www/

# آپلود Admin Panel
scp -r admin-panel root@89.44.241.83:/var/www/
```

**رمز عبور root VPS را وارد کنید.**

---

## مرحله 2: روی VPS - نصب Node.js و ابزارها

در **SSH VPS** (جایی که الان هستید):

```bash
# آپدیت سیستم
apt update && apt upgrade -y

# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# نصب PM2
npm install -g pm2

# نصب Nginx
apt install -y nginx

# بررسی
node --version
npm --version
```

---

## مرحله 3: راه‌اندازی Backend

```bash
cd /var/www/backend

# نصب dependencies
npm install --production

# ایجاد .env
cat > .env << EOF
PORT=3000
DB_PATH=/var/www/backend/database.sqlite
EOF

# تست
node server.js
# اگر کار کرد: Ctrl+C

# اجرا با PM2 (همیشه در حال اجرا)
pm2 start server.js --name vpn-backend
pm2 save
pm2 startup
```

---

## مرحله 4: راه‌اندازی Admin Panel

```bash
cd /var/www/admin-panel

# نصب dependencies
npm install

# Build برای production
npm run build
```

---

## مرحله 5: تنظیم Nginx

```bash
cat > /etc/nginx/sites-available/vpn-panel << 'EOF'
server {
    listen 80;
    server_name _;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # CORS
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Admin Panel
    location / {
        root /var/www/admin-panel/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}
EOF

# فعال کردن
ln -sf /etc/nginx/sites-available/vpn-panel /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# تست و restart
nginx -t
systemctl restart nginx
systemctl enable nginx
```

---

## مرحله 6: Firewall

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable
```

---

## ✅ تست:

### تست Backend:

```bash
curl http://89.44.241.83/api/health
```

باید ببینید:
```json
{"status":"ok","message":"VPN API is running"}
```

### تست Admin Panel:

در مرورگر:
```
http://89.44.241.83
```

باید پنل ادمین را ببینید!

---

## 🖥️ تنظیم برنامه Desktop ویندوز:

روی **کامپیوتر ویندوز**:

### 1. ویرایش فایل API:

فایل `G:\vpn\desktop-app\renderer.js` خط 5:

```javascript
// تغییر از:
const API_BASE_URL = 'http://localhost:3000/api';

// به:
const API_BASE_URL = 'http://89.44.241.83/api';
```

### 2. Package مجدد:

```powershell
cd G:\vpn\desktop-app
npm run package
xcopy /E /I /Y v2ray-core dist-package\VPNApp-win32-x64\resources\app\v2ray-core
```

### 3. اجرا:

```
dist-package\VPNApp-win32-x64\VPNApp.exe
```

الان برنامه به **سرور شما** متصل می‌شود! ✅

---

## 📊 مدیریت:

### مشاهده وضعیت:

```bash
pm2 status
pm2 logs vpn-backend
```

### Restart:

```bash
pm2 restart vpn-backend
systemctl restart nginx
```

### توقف:

```bash
pm2 stop vpn-backend
```

---

## 🎯 خلاصه:

```
VPS (89.44.241.83):
  ├── Backend: Port 3000 (PM2)
  ├── Nginx: Port 80
  │     ├── / → Admin Panel
  │     └── /api → Backend
  
Desktop App (Windows):
  └── API: http://89.44.241.83/api
```

---

**دستورات را روی VPS اجرا کنید!** 🚀

