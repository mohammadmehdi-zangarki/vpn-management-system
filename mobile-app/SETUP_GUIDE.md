# راهنمای نصب و اجرای اپلیکیشن React Native

## پیش‌نیازها

### 1. نصب Node.js
- دانلود و نصب از: https://nodejs.org/
- نسخه 18 یا بالاتر

### 2. نصب JDK (Java Development Kit)
- دانلود JDK 17 از: https://adoptium.net/
- تنظیم متغیر محیطی `JAVA_HOME`

### 3. نصب Android Studio
1. دانلود از: https://developer.android.com/studio
2. نصب کامل Android Studio
3. باز کردن SDK Manager و نصب موارد زیر:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools
   - Android Emulator
4. تنظیم متغیرهای محیطی:
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```
   و اضافه کردن به PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

## راه‌اندازی پروژه

### مرحله 1: نصب پکیج‌ها

```bash
cd mobile-app
npm install
```

### مرحله 2: راه‌اندازی Emulator

#### روش 1: با Android Studio (پیشنهادی)
1. Android Studio را باز کنید
2. Tools > Device Manager
3. Create Device
4. یک دستگاه مثل Pixel 5 انتخاب کنید
5. System Image: Android 13 (API 33) یا بالاتر
6. Finish و سپس روی Play کلیک کنید

#### روش 2: از Command Line
```bash
# لیست Emulator های موجود
emulator -list-avds

# اجرای Emulator
emulator -avd YOUR_AVD_NAME
```

### مرحله 3: تنظیم IP سرور

فایل `src/api/api.js` را باز کنید:

```javascript
// برای Emulator:
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// برای گوشی واقعی (IP کامپیوتر خود را بگذارید):
const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

### مرحله 4: اطمینان از اجرای Backend

```bash
cd ../backend
npm start
```

باید پیام `Server is running on port 3000` را ببینید.

### مرحله 5: اجرای اپلیکیشن

در ترمینال جدید:

```bash
cd mobile-app
npm run android
```

یا:

```bash
npx react-native run-android
```

## تست با گوشی واقعی

### مرحله 1: فعال کردن Developer Mode

1. Settings > About Phone
2. 7 بار روی Build Number ضربه بزنید
3. برگردید به Settings > Developer Options
4. USB Debugging را فعال کنید

### مرحله 2: اتصال به کامپیوتر

1. گوشی را با کابل USB وصل کنید
2. اجازه USB Debugging را بدهید
3. بررسی اتصال:

```bash
adb devices
```

### مرحله 3: تغییر IP

1. IP کامپیوتر را پیدا کنید:
```bash
ipconfig
```

2. در `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

3. مطمئن شوید گوشی و کامپیوتر در یک شبکه Wi-Fi هستند

### مرحله 4: اجرا

```bash
npm run android
```

## ساخت APK

### Debug APK (برای تست)

```bash
cd android
./gradlew assembleDebug
```

APK در مسیر زیر ایجاد می‌شود:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (برای انتشار)

1. ایجاد Keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. فایل `android/gradle.properties` را ویرایش کنید:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

3. فایل `android/app/build.gradle` را ویرایش کنید و در بخش `android.signingConfigs` اضافه کنید:
```gradle
release {
    if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
}
```

4. Build کنید:
```bash
cd android
./gradlew assembleRelease
```

APK در:
```
android/app/build/outputs/apk/release/app-release.apk
```

## مشکلات رایج

### خطای "SDK location not found"
```bash
# ایجاد فایل local.properties در android/
echo sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk > android/local.properties
```

### خطای "Unable to load script"
```bash
# پاک کردن cache
npm start -- --reset-cache
```

### خطای Build
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### اپ نصب می‌شود ولی باز نمی‌شود
```bash
# بررسی لاگ‌ها
adb logcat | grep "ReactNative"
```

### خطای Network/CORS
- مطمئن شوید Backend در حال اجرا است
- IP را صحیح وارد کرده‌اید
- Firewall Backend را مسدود نکرده باشد

## دستورات مفید

```bash
# پاک کردن cache
npm start -- --reset-cache

# نصب مجدد روی دستگاه
npm run android

# مشاهده لاگ‌ها
adb logcat

# لیست دستگاه‌های متصل
adb devices

# Uninstall اپ
adb uninstall com.vpnapp

# فوروارد کردن پورت (اگر نیاز بود)
adb reverse tcp:3000 tcp:3000
```

## نکات مهم

✅ همیشه Backend را قبل از اجرای اپ اجرا کنید
✅ برای Emulator از IP `10.0.2.2` استفاده کنید
✅ برای گوشی واقعی IP کامپیوتر را وارد کنید
✅ گوشی و کامپیوتر باید در یک شبکه باشند
✅ USB Debugging را فعال کنید
✅ برای Production حتماً Keystore ایجاد کنید

موفق باشید! 🚀

