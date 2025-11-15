# 📦 راهنمای ساده ساخت APK (بدون Android Studio!)

## 🎯 روش 1: با استفاده از GitHub Actions (رایگان)

### مرحله 1: آپلود پروژه در GitHub

```bash
cd G:\vpn\mobile-app

# اگر Git ندارید، از GitHub Desktop استفاده کنید
# دانلود: https://desktop.github.com/
```

### مرحله 2: استفاده از GitHub Actions

فایل `.github/workflows/build-apk.yml` را ایجاد می‌کنیم که خودکار APK می‌سازد.

---

## 🎯 روش 2: نصب فقط Android Command Line Tools (ساده‌تر)

بدون نیاز به Android Studio!

### 1. دانلود Command Line Tools

لینک: https://developer.android.com/studio#command-line-tools-only

فایل: `commandlinetools-win-XXXXX_latest.zip`

### 2. استخراج

```
C:\Android\cmdline-tools\
```

### 3. نصب SDK

```bash
cd C:\Android\cmdline-tools\bin
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### 4. تنظیم Environment Variable

```
ANDROID_HOME=C:\Android
```

### 5. Build APK

```bash
cd G:\vpn\mobile-app\android
gradlew assembleDebug
```

APK در: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 🎯 روش 3: استفاده از کامپیوتر دیگری

اگر دوستی دارید که Android Studio نصب داره:

### 1. فایل‌ها را بدهید:

```bash
# ZIP کردن پروژه:
cd G:\vpn
Compress-Archive -Path mobile-app -DestinationPath vpn-mobile.zip
```

### 2. دوستتان این کارها را انجام دهد:

```bash
# استخراج
# باز کردن Android Studio
# File > Open > انتخاب پوشه mobile-app/android
# Build > Generate Signed Bundle/APK > APK
# Debug
```

### 3. فایل APK را بگیرید!

---

## 🎯 روش 4: ساخت APK با Docker (پیشرفته)

اگر Docker نصب دارید:

```bash
docker run --rm -v G:\vpn\mobile-app:/app mingc/android-build-box bash -c "cd /app/android && ./gradlew assembleDebug"
```

---

## ⚡ روش 5: نصب سریع Android Studio (30 دقیقه)

### سریع‌ترین راه:

**1. دانلود (1 GB):**
https://redirector.gvt1.com/edgedl/android/studio/install/2024.1.1.13/android-studio-2024.1.1.13-windows.exe

**2. نصب:**
- دوبل کلیک
- Next, Next, Next...
- Install

**3. اولین اجرا:**
- Standard Setup
- همه چیز را Install کند

**4. ساخت APK:**

```bash
cd G:\vpn\mobile-app\android
gradlew assembleDebug
```

**5. APK:**
```
G:\vpn\mobile-app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 نصب APK روی گوشی

### با کابل USB:

```bash
adb install app-debug.apk
```

### بدون کابل:

1. APK را به گوشی منتقل کنید (Telegram, Email, USB, ...)
2. روی گوشی باز کنید
3. "Install from Unknown Sources" را تایید کنید
4. نصب!

---

## 🎯 توصیه من:

اگر می‌خواهید **امروز** اپ را ببینید:
- ✅ روش 5: نصب سریع Android Studio (30 دقیقه)

اگر می‌خواهید **بدون نصب** APK بگیرید:
- ✅ روش 3: از دوست بخواهید

اگر **تکنیکال** هستید:
- ✅ روش 2: Command Line Tools (15 دقیقه)

---

## 📞 کمک نیاز دارید؟

اگر گیر کردید، بگویید تا کمک کنم! 🚀

