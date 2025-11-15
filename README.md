# 🔐 VPN Management System

یک سیستم مدیریت VPN کامل شامل Backend API، پنل ادمین وب، و برنامه کاربری برای ویندوز.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)

## 📦 ساختار پروژه

```
vpn/
├── backend/              # Backend API (Node.js + Express + SQLite)
├── admin-panel/          # پنل مدیریت وب (React + Tailwind CSS)
├── desktop-app/          # برنامه دسکتاپ ویندوز (Electron + v2ray-core)
└── mobile-app/           # برنامه موبایل اندروید (React Native) - در حال توسعه
```

## ✨ ویژگی‌ها

### 🖥️ Backend API
- ✅ RESTful API با Express.js
- ✅ دیتابیس SQLite (قابل تغییر به MySQL/PostgreSQL)
- ✅ مدیریت دسته‌بندی‌های سرور
- ✅ مدیریت کانفیگ‌های VPN (vless://)
- ✅ CORS Support
- ✅ Validation

### 🌐 پنل ادمین (Web)
- ✅ رابط کاربری مدرن با React و Tailwind CSS
- ✅ مدیریت دسته‌بندی‌ها
- ✅ مدیریت کانفیگ‌های VPN
- ✅ افزودن، ویرایش، حذف
- ✅ رابط فارسی و راست‌چین
- ✅ Responsive Design

### 💻 برنامه Desktop (Windows)
- ✅ برنامه Native با Electron
- ✅ دانلود خودکار v2ray-core
- ✅ پارس کردن vless:// URLs
- ✅ اتصال به سرورهای VPN
- ✅ تنظیم خودکار System Proxy
- ✅ **کل ترافیک سیستم از VPN می‌گذرد**
- ✅ قطع اتصال خودکار
- ✅ رابط کاربری زیبا و فارسی
- ✅ دقیقاً مثل v2rayN کار می‌کند

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18 یا بالاتر
- npm یا yarn

### نصب

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/vpn-management-system.git
cd vpn-management-system

# نصب dependencies برای Backend
cd backend
npm install

# نصب dependencies برای Admin Panel
cd ../admin-panel
npm install

# نصب dependencies برای Desktop App
cd ../desktop-app
npm install
```

### اجرا

#### 1. Backend API

```bash
cd backend
npm start
```

Server روی `http://localhost:3000` اجرا می‌شود.

#### 2. پنل ادمین

```bash
cd admin-panel
npm run dev
```

پنل روی `http://localhost:3001` قابل دسترسی است.

#### 3. برنامه Desktop

```bash
cd desktop-app
npm start
```

## 📖 مستندات

- [راهنمای سریع](QUICKSTART.md)
- [دستورالعمل کامل](INSTRUCTIONS.md)
- [Backend API](backend/README.md)
- [Desktop App](desktop-app/README.md)

## 🔧 ساخت برنامه Desktop

### Development

```bash
cd desktop-app
npm start
```

### Production Build

```bash
cd desktop-app
npm run package
```

خروجی در: `dist-package/VPNApp-win32-x64/VPNApp.exe`

## 📱 برنامه موبایل

برنامه اندروید با React Native در حال توسعه است.

برای جزئیات بیشتر: [mobile-app/README.md](mobile-app/README.md)

## 🔌 API Endpoints

### Categories

- `GET /api/categories` - دریافت همه دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی جدید
- `PUT /api/categories/:id` - ویرایش دسته‌بندی
- `DELETE /api/categories/:id` - حذف دسته‌بندی

### Configs

- `GET /api/configs` - دریافت همه کانفیگ‌ها
- `GET /api/configs/category/:id` - دریافت کانفیگ‌های یک دسته‌بندی
- `POST /api/configs` - ایجاد کانفیگ جدید
- `PUT /api/configs/:id` - ویرایش کانفیگ
- `DELETE /api/configs/:id` - حذف کانفیگ

## 🎯 نحوه استفاده

### برای ادمین:

1. Backend را اجرا کنید
2. پنل ادمین را باز کنید (`http://localhost:3001`)
3. دسته‌بندی ایجاد کنید (مثلاً "ایرانسل", "همراه اول")
4. کانفیگ‌های VPN اضافه کنید (vless://...)

### برای کاربران:

1. برنامه Desktop را دانلود و نصب کنند
2. برنامه را باز کنند
3. دسته‌بندی و سرور انتخاب کنند
4. روی "اتصال" کلیک کنند
5. از اینترنت آزاد استفاده کنند!

## 🔐 امنیت

⚠️ **برای استفاده در Production:**

- [ ] Authentication و Authorization اضافه کنید
- [ ] از HTTPS استفاده کنید
- [ ] Input Validation کامل
- [ ] Rate Limiting
- [ ] دیتابیس را به PostgreSQL/MySQL تغییر دهید
- [ ] Environment Variables برای secrets
- [ ] Code signing برای برنامه Desktop
- [ ] Regular security audits

## 🛠️ تکنولوژی‌ها

**Backend:**
- Node.js
- Express.js
- SQLite3

**Admin Panel:**
- React 18
- Tailwind CSS
- Vite
- React Router
- Axios

**Desktop App:**
- Electron
- v2ray-core
- Node.js

**Mobile App:**
- React Native
- React Navigation
- Axios

## 📊 ویژگی‌های کلیدی

- ✅ مدیریت متمرکز کانفیگ‌های VPN
- ✅ دسته‌بندی سرورها (بر اساس اپراتور، کشور، و...)
- ✅ اتصال خودکار به VPN
- ✅ تنظیم خودکار System Proxy
- ✅ پشتیبانی از vless:// protocol
- ✅ رابط کاربری فارسی
- ✅ Cross-platform (Web, Windows, Android)

## 🤝 مشارکت

برای مشارکت در این پروژه:

1. Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای جزئیات بیشتر فایل [LICENSE](LICENSE) را ببینید.

## 👨‍💻 توسعه‌دهندگان

- توسعه یافته با ❤️

## 🙏 تشکرات

- [v2fly/v2ray-core](https://github.com/v2fly/v2ray-core) - VPN Core
- [Electron](https://www.electronjs.org/) - Desktop Framework
- [React](https://reactjs.org/) - UI Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

## 📞 پشتیبانی

برای گزارش باگ یا درخواست ویژگی جدید، لطفاً یک [Issue](https://github.com/YOUR-USERNAME/vpn-management-system/issues) ایجاد کنید.

## 🚀 نسخه‌های آینده

- [ ] پشتیبانی از vmess:// و trojan://
- [ ] نمایش سرعت اتصال
- [ ] نمایش مصرف ترافیک
- [ ] تست سرعت سرور
- [ ] Auto-connect
- [ ] System tray icon
- [ ] Multi-language support
- [ ] برنامه iOS

---

⭐ اگر این پروژه برای شما مفید بود، یک Star بدهید!

موفق باشید! 🎉
