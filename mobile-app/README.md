# VPN Mobile App - React Native

اپلیکیشن موبایل VPN با React Native برای اندروید

## ✨ ویژگی‌ها

- ✅ نمایش دسته‌بندی سرورها
- ✅ لیست سرورها بر اساس دسته‌بندی
- ✅ اتصال به سرورهای VPN (vless://)
- ✅ قطع اتصال VPN
- ✅ کپی کردن لینک کانفیگ
- ✅ رابط کاربری فارسی و راست‌چین
- ✅ Native Module برای اتصال VPN
- ✅ پشتیبانی از Android 8.0+

## 📋 پیش‌نیازها

### Windows:
1. **Node.js 18+**: https://nodejs.org/
2. **JDK 17**: https://adoptium.net/
3. **Android Studio**: https://developer.android.com/studio
4. **React Native CLI**:
   ```bash
   npm install -g react-native-cli
   ```

### تنظیمات Environment Variables:

```
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.X.X-hotspot\
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

به PATH اضافه کنید:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

## 🚀 نصب و اجرا

### 1. نصب Dependencies

```bash
cd mobile-app
npm install
```

### 2. تنظیم IP Backend

فایل `src/api/api.js` را باز کنید:

```javascript
// برای Emulator (پیشنهادی برای Development):
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// برای گوشی واقعی:
// 1. IP کامپیوتر را پیدا کنید: ipconfig
// 2. آدرس را تغییر دهید:
const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

### 3. اطمینان از اجرای Backend

```bash
cd backend
npm start
# باید ببینید: Server is running on port 3000
```

### 4. اجرا با Emulator

#### راه‌اندازی Emulator:
1. Android Studio را باز کنید
2. Tools > Device Manager
3. Create Device
4. Pixel 5 API 33 یا بالاتر
5. دکمه Play را بزنید

#### اجرای اپ:
```bash
cd mobile-app
npm run android
```

### 5. اجرا با گوشی واقعی

#### فعال کردن USB Debugging:
1. Settings > About Phone
2. 7 بار روی Build Number ضربه بزنید
3. Settings > Developer Options
4. USB Debugging را فعال کنید

#### اجرا:
```bash
# بررسی اتصال:
adb devices

# اجرای اپ:
npm run android
```

## 📦 ساخت APK

### Debug APK (برای تست):

```bash
cd android
gradlew assembleDebug
```

APK در: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (برای انتشار):

```bash
cd android
gradlew assembleRelease
```

APK در: `android/app/build/outputs/apk/release/app-release.apk`

برای اطلاعات بیشتر: [ANDROID_BUILD.md](ANDROID_BUILD.md)

## 🔧 استفاده از اپلیکیشن

### 1. ورود به اپ
- اپلیکیشن را باز کنید
- لیست دسته‌بندی‌ها نمایش داده می‌شود

### 2. انتخاب سرور
- روی یک دسته‌بندی کلیک کنید
- لیست سرورهای آن دسته نمایش داده می‌شود

### 3. اتصال به VPN
- روی دکمه "اتصال" کلیک کنید
- مجوز VPN را تایید کنید
- منتظر بمانید تا اتصال برقرار شود

### 4. قطع اتصال
- روی دکمه "قطع اتصال" کلیک کنید

### 5. کپی کردن کانفیگ
- روی دکمه "کپی لینک" کلیک کنید
- لینک کانفیگ کپی می‌شود

## 🏗️ ساختار پروژه

```
mobile-app/
├── android/                    # فایل‌های Native اندروید
│   ├── app/
│   │   └── src/main/java/com/vpnapp/
│   │       ├── MainActivity.kt
│   │       ├── MainApplication.kt
│   │       ├── V2RayVPNModule.kt      # Native Module برای VPN
│   │       └── V2RayVPNPackage.kt
│   └── build.gradle
├── src/
│   ├── api/
│   │   └── api.js              # ارتباط با Backend
│   ├── screens/
│   │   ├── HomeScreen.js       # صفحه اصلی
│   │   └── ServerListScreen.js # لیست سرورها
│   └── services/
│       ├── VPNService.js       # سرویس VPN (شبیه‌سازی)
│       └── NativeVPNService.js # سرویس VPN Native
├── App.js                      # فایل اصلی
├── index.js                    # Entry Point
└── package.json
```

## 🔌 API Endpoints

اپ از API های زیر استفاده می‌کند:

- `GET /api/categories` - دریافت دسته‌بندی‌ها
- `GET /api/configs` - دریافت تمام کانفیگ‌ها
- `GET /api/configs/category/:id` - دریافت کانفیگ‌های یک دسته

## 🐛 عیب‌یابی

### مشکل: اپ نصب نمی‌شود

```bash
# حذف و نصب مجدد:
adb uninstall com.vpnapp
npm run android
```

### مشکل: خطای Network

- مطمئن شوید Backend در حال اجرا است
- IP را صحیح تنظیم کرده‌اید
- برای Emulator از `10.0.2.2` استفاده کنید
- برای گوشی واقعی از IP کامپیوتر استفاده کنید

### مشکل: Build Failed

```bash
cd android
gradlew clean
cd ..
npm run android
```

### مشکل: اپ باز نمی‌شود

```bash
# مشاهده لاگ‌ها:
adb logcat | grep ReactNative
```

## 📚 مستندات بیشتر

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - راهنمای کامل نصب
- [ANDROID_BUILD.md](ANDROID_BUILD.md) - راهنمای Build و APK
- [../README.md](../README.md) - مستندات کلی پروژه

## 🔒 امنیت

⚠️ **نکات مهم:**
- این یک نسخه Development است
- برای Production نیاز به کتابخانه V2Ray Core دارد
- Native Module فعلی یک شبیه‌سازی است
- برای اتصال واقعی به libv2ray نیاز است

## 📱 نسخه‌های پشتیبانی شده

- Android: 8.0 (API 26) و بالاتر
- React Native: 0.73.0
- Node.js: 18.0.0+

## 🎯 TODO

- [ ] پیاده‌سازی واقعی V2Ray Core
- [ ] افزودن پشتیبانی از vmess://
- [ ] نمایش سرعت اتصال
- [ ] نمایش مصرف ترافیک
- [ ] تست اتصال سرور
- [ ] پشتیبانی از iOS

## 📄 لایسنس

MIT License

## 👨‍💻 ساخته شده با

- React Native
- React Navigation
- Axios
- Kotlin (برای Native Module)

موفق باشید! 🚀

