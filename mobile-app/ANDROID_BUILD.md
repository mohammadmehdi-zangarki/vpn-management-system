# راهنمای Build و اجرای اپلیکیشن اندروید

## 🚀 راه‌اندازی سریع

### 1️⃣ نصب Dependencies

```bash
cd mobile-app
npm install
```

### 2️⃣ اجرا با Emulator

```bash
# ابتدا Emulator را اجرا کنید (از Android Studio)
# سپس:
npm run android
```

### 3️⃣ اجرا با گوشی واقعی

```bash
# گوشی را USB وصل کنید و USB Debugging را فعال کنید
# بررسی اتصال:
adb devices

# اجرا:
npm run android
```

## 📦 ساخت APK

### Debug APK (تست)

```bash
cd android
gradlew assembleDebug
# یا در Windows:
gradlew.bat assembleDebug
```

خروجی:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (انتشار)

#### مرحله 1: ایجاد Keystore

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore vpn-release.keystore -alias vpn-key -keyalg RSA -keysize 2048 -validity 10000
```

اطلاعات درخواستی:
- Password: (یک رمز قوی)
- نام و نام خانوادگی
- نام سازمان
- و غیره...

#### مرحله 2: تنظیمات Gradle

فایل `android/gradle.properties` را ویرایش کنید:

```properties
MYAPP_RELEASE_STORE_FILE=vpn-release.keystore
MYAPP_RELEASE_KEY_ALIAS=vpn-key
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

#### مرحله 3: Build Release

```bash
cd android
gradlew assembleRelease
```

خروجی:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 تنظیمات IP Backend

### برای Emulator:
فایل `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

### برای گوشی واقعی:
1. IP کامپیوتر را پیدا کنید:
```bash
ipconfig
# یا
ip addr show
```

2. در `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

3. مطمئن شوید گوشی و کامپیوتر در یک شبکه هستند

## 🐛 عیب‌یابی

### مشکل 1: SDK location not found

```bash
# در پوشه android ایجاد کنید:
echo sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk > local.properties
```

### مشکل 2: Could not find tools.jar

مطمئن شوید JDK 17 نصب شده و JAVA_HOME تنظیم شده است:

```bash
echo %JAVA_HOME%
# باید مسیر JDK را نشان دهد
```

### مشکل 3: Build Failed

```bash
cd android
gradlew clean
cd ..
npm run android
```

### مشکل 4: Unable to load script

```bash
npm start -- --reset-cache
# در ترمینال دیگر:
npm run android
```

### مشکل 5: اپ نصب شد ولی باز نمی‌شود

```bash
# مشاهده لاگ‌ها:
adb logcat | grep ReactNative
```

### مشکل 6: INSTALL_FAILED_UPDATE_INCOMPATIBLE

```bash
# حذف کامل اپ و نصب مجدد:
adb uninstall com.vpnapp
npm run android
```

## 📱 تست با Metro Bundler

```bash
# ترمینال 1: Metro Bundler
npm start

# ترمینال 2: نصب روی دستگاه
npm run android
```

## 🔐 امنیت در Production

✅ **Keystore را امن نگه دارید**
- هرگز در Git قرار ندهید
- نسخه پشتیبان تهیه کنید
- رمزها را یادداشت کنید

✅ **ProGuard را فعال کنید**
در `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

✅ **کدهای حساس را پنهان کنید**
- API Keys در Environment Variables
- استفاده از Native Module برای کدهای مهم

## 📊 بهینه‌سازی اندازه APK

### 1. فعال کردن App Bundle:

```bash
cd android
gradlew bundleRelease
```

خروجی: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. Build برای Architecture خاص:

در `android/gradle.properties`:
```properties
# فقط برای arm64-v8a (جدیدترین گوشی‌ها)
reactNativeArchitectures=arm64-v8a
```

### 3. حذف Resources غیرضروری:

در `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        ...
        resConfigs "en", "fa"  // فقط انگلیسی و فارسی
    }
}
```

## 🚀 انتشار در Google Play

### 1. تهیه App Bundle:
```bash
cd android
gradlew bundleRelease
```

### 2. آپلود در Google Play Console:
- ورود به https://play.google.com/console
- ایجاد Application جدید
- آپلود `app-release.aab`
- تکمیل اطلاعات (نام، توضیحات، اسکرین‌شات‌ها)
- ارسال برای بررسی

## 📋 Checklist قبل از Release

- [ ] تست کامل روی دستگاه‌های مختلف
- [ ] بررسی Permission ها در AndroidManifest.xml
- [ ] تست اتصال به Backend
- [ ] تست اتصال VPN
- [ ] بهینه‌سازی تصاویر
- [ ] فعال کردن ProGuard
- [ ] Build با Release Keystore
- [ ] تست APK نهایی
- [ ] آماده‌سازی اسکرین‌شات‌ها
- [ ] نوشتن توضیحات فارسی/انگلیسی

## 🎯 نکات مهم

- ✅ همیشه Backend را قبل از تست اجرا کنید
- ✅ IP را صحیح تنظیم کنید
- ✅ Keystore را گم نکنید!
- ✅ Version Code را در هر Release افزایش دهید
- ✅ تست روی اندروید 8.0 به بالا

موفق باشید! 🎉

