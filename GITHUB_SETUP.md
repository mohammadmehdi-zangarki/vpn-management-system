# 🚀 راهنمای آپلود به GitHub

## ✅ Git Repository ایجاد شد!

تمام کدها commit شدند و آماده push به GitHub هستند.

---

## 📋 مراحل آپلود به GitHub:

### مرحله 1: ایجاد Repository در GitHub

1. برو به: https://github.com/new
2. Repository name: `vpn-management-system` (یا هر اسمی که می‌خواهید)
3. Description: `VPN Management System with Backend API, Web Admin Panel, and Windows Desktop Client`
4. Public یا Private: انتخاب کنید
5. ⚠️ **هیچکدام از گزینه‌های پایین را تیک نزنید** (README, .gitignore, license)
6. Create repository

### مرحله 2: اتصال به GitHub

بعد از ایجاد repository، GitHub یک صفحه با دستورات نشان می‌دهد.

**در پروژه خودتان این دستورات را اجرا کنید:**

```bash
cd G:\vpn

# اضافه کردن remote
git remote add origin https://github.com/YOUR-USERNAME/vpn-management-system.git

# تغییر نام branch به main
git branch -M main

# Push کردن
git push -u origin main
```

**⚠️ توجه:** `YOUR-USERNAME` را با username GitHub خودتان جایگزین کنید!

### مرحله 3: تایید

بعد از push، برو به:
```
https://github.com/YOUR-USERNAME/vpn-management-system
```

باید تمام کدها را ببینید! ✅

---

## 🔑 اگر نیاز به Authentication داشتید:

### روش 1: Personal Access Token (پیشنهادی)

1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (تمام)
4. Generate token
5. کپی کنید (فقط یکبار نشان داده می‌شود!)

وقتی push می‌کنید:
- Username: GitHub username شما
- Password: Personal access token (نه رمز عبور!)

### روش 2: SSH Key

```bash
# ایجاد SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# کپی کردن public key
cat ~/.ssh/id_ed25519.pub

# اضافه کردن به GitHub:
# Settings > SSH and GPG keys > New SSH key
```

سپس از URL SSH استفاده کنید:
```bash
git remote set-url origin git@github.com:YOUR-USERNAME/vpn-management-system.git
```

---

## 📦 فایل‌هایی که آپلود می‌شوند:

```
✅ backend/              - Backend API
✅ admin-panel/          - پنل ادمین
✅ desktop-app/          - برنامه Desktop
✅ mobile-app/           - برنامه موبایل (کد)
✅ README.md             - مستندات اصلی
✅ LICENSE               - لایسنس MIT
✅ .gitignore            - فایل‌های ignore شده
✅ تمام مستندات         - راهنماها
```

### ❌ فایل‌هایی که آپلود نمی‌شوند (.gitignore):

```
❌ node_modules/         - وابستگی‌ها (دوباره نصب می‌شوند)
❌ dist/                 - فایل‌های build
❌ .env                  - تنظیمات محلی
❌ v2ray-core/           - دانلود خودکار می‌شود
❌ *.exe, *.zip          - فایل‌های نصبی
❌ database.sqlite       - دیتابیس محلی
```

---

## 🎯 بعد از Push:

### Repository شما شامل:

```
✅ کد کامل Backend
✅ کد کامل Admin Panel  
✅ کد کامل Desktop App
✅ مستندات جامع
✅ راهنماهای نصب
✅ LICENSE
✅ README زیبا
```

### کاربران می‌توانند:

```bash
git clone https://github.com/YOUR-USERNAME/vpn-management-system.git
cd vpn-management-system

# نصب و اجرا
cd backend && npm install && npm start
cd admin-panel && npm install && npm run dev
cd desktop-app && npm install && npm start
```

---

## 📝 Commit های بعدی:

برای تغییرات بعدی:

```bash
# مشاهده تغییرات
git status

# اضافه کردن فایل‌های تغییر یافته
git add .

# Commit
git commit -m "توضیح تغییرات"

# Push
git push
```

---

## 🌟 GitHub Features:

بعد از آپلود می‌توانید:

- ✅ Issues برای bug tracking
- ✅ Wiki برای مستندات بیشتر
- ✅ Releases برای نسخه‌های جدید
- ✅ GitHub Actions برای CI/CD
- ✅ Discussions برای انجمن کاربران

---

## 🎉 آماده!

همه چیز آماده push به GitHub است!

فقط:
1. Repository در GitHub بسازید
2. دستورات بالا را اجرا کنید
3. تمام! ✅

موفق باشید! 🚀

