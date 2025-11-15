# 📱 راهنمای نصب Android Studio و اجرای برنامه

## مرحله 1: دانلود و نصب Android Studio

### 1️⃣ دانلود:
لینک دانلود: **https://developer.android.com/studio**

### 2️⃣ نصب:
1. فایل نصب را اجرا کنید
2. Next, Next... تا انتها
3. **مهم**: تیک "Android Virtual Device" را حتماً بزنید

### 3️⃣ اولین اجرا:
1. Android Studio را باز کنید
2. More Actions > SDK Manager
3. در تب "SDK Platforms":
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   
4. در تب "SDK Tools":
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Tools

5. کلیک کنید: Apply > OK

## مرحله 2: تنظیم Environment Variables

### برای Windows:

1. **کلیک راست روی "This PC" > Properties > Advanced system settings > Environment Variables**

2. **ایجاد متغیر ANDROID_HOME:**
   - کلیک کنید: New (در بخش System variables)
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - (YourUsername را با نام کاربری خود جایگزین کنید)

3. **اضافه کردن به PATH:**
   - پیدا کنید: Path (در System variables)
   - کلیک کنید: Edit
   - کلیک کنید: New و این مسیرها را اضافه کنید:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     %ANDROID_HOME%\tools
     %ANDROID_HOME%\tools\bin
     ```

4. **Restart** کنید کامپیوتر را!

## مرحله 3: ایجاد Emulator

1. Android Studio را باز کنید
2. More Actions > Virtual Device Manager
3. Create Device
4. دستگاه را انتخاب کنید: **Pixel 5**
5. System Image: **Android 13 (API 33)** - اگر نصب نیست Download کنید
6. Next > Finish
7. روی دکمه ▶️ Play کلیک کنید
8. منتظر بمانید تا Emulator باز شود (اولین بار 2-3 دقیقه طول می‌کشد)

## مرحله 4: اجرای برنامه

### در PowerShell یا CMD:

```bash
# رفتن به پوشه پروژه
cd G:\vpn\mobile-app

# اطمینان از اجرای Backend
# (در ترمینال جدید:)
cd G:\vpn\backend
npm start

# اجرای اپلیکیشن
cd G:\vpn\mobile-app
npm run android
```

## مرحله 5: صبر کنید!

- **اولین build**: 5-10 دقیقه طول می‌کشد
- Gradle فایل‌ها را دانلود می‌کند
- پروژه compile می‌شود
- APK نصب می‌شود
- اپ باز می‌شود

## ✅ موفقیت!

اگر همه چیز درست پیش رفت:
- اپ روی Emulator باز می‌شود
- صفحه اصلی با دسته‌بندی‌ها نمایش داده می‌شود

## 🐛 مشکلات رایج

### خطا: SDK location not found

```bash
cd G:\vpn\mobile-app\android
echo sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk > local.properties
```

### خطا: Could not find or load main class

مطمئن شوید JAVA_HOME تنظیم شده:
```
echo %JAVA_HOME%
```

### Emulator بسیار کند است

1. BIOS > Virtualization را فعال کنید
2. یا از گوشی واقعی استفاده کنید

### برنامه build نمی‌شود

```bash
cd android
gradlew clean
cd ..
npm run android
```

---

## 🚀 مرحله بعدی

بعد از اینکه اپ اجرا شد:
1. می‌توانید در پنل ادمین دسته‌بندی و کانفیگ اضافه کنید
2. اپ را Reload کنید (R+R در ترمینال)
3. دسته‌بندی‌ها و سرورها را ببینید
4. به سرور متصل شوید!

موفق باشید! 🎉

