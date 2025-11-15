# 🎯 راه حل برای شما - ساخت APK

## ببینید، من چرا نمی‌تونم مستقیماً APK بسازم:

1. ❌ **Android SDK** نصب نیست
2. ❌ من نمی‌تونم نرم‌افزار نصب کنم (نیاز به UI و تعامل کاربر)
3. ❌ Gradle برای build نیاز به Android SDK داره

## اما 3 راه حل ساده دارم:

---

## ✅ راه 1: نصب Android Command Line Tools (بدون UI!)

### مزایا:
- ✅ سریع (15 دقیقه)
- ✅ بدون نیاز به Android Studio
- ✅ کم حجم (200 MB)

### مراحل:

**1. دانلود:**
```
https://developer.android.com/studio#command-line-tools-only
```
فایل: `commandlinetools-win-11076708_latest.zip`

**2. استخراج:**
```
C:\Android\cmdline-tools\latest\
```

**3. نصب SDK:**

در PowerShell:
```powershell
cd C:\Android\cmdline-tools\latest\bin
.\sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

**4. تنظیم Environment:**

```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android", "User")
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Android\platform-tools", "User")
```

**5. Restart PowerShell**

**6. Build APK:**

```powershell
cd G:\vpn\mobile-app\android
.\gradlew.bat assembleDebug
```

**7. APK آماده است!**
```
G:\vpn\mobile-app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## ✅ راه 2: با Docker (اگر Docker دارید)

```bash
docker run --rm -v G:\vpn\mobile-app:/project mingc/android-build-box bash -c "cd /project/android && ./gradlew assembleDebug"
```

APK در همون مسیر ایجاد می‌شود.

---

## ✅ راه 3: نصب کامل Android Studio

اگر می‌خواهید ابزار کامل داشته باشید:

**دانلود (1 GB):**
```
https://developer.android.com/studio
```

**نصب:**
- دوبل کلیک
- Next تا انتها
- Standard Setup

**Build APK:**
```bash
cd G:\vpn\mobile-app\android
gradlew assembleDebug
```

---

## 🚀 بعد از گرفتن APK:

### انتقال به گوشی:

**روش 1: با کابل USB**
```bash
adb install app-debug.apk
```

**روش 2: بدون کابل**
- APK را در Google Drive یا Telegram آپلود کنید
- از گوشی دانلود کنید
- نصب کنید

### نصب روی گوشی:

1. Settings > Security > Unknown Sources: ON
2. روی فایل APK کلیک کنید
3. Install

---

## 📱 استفاده از برنامه:

**نکته مهم:** IP را تنظیم کنید!

در `mobile-app/src/api/api.js`:
```javascript
// IP کامپیوتر خود را وارد کنید
const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

چطور IP را پیدا کنیم:
```bash
ipconfig
```
در Wi-Fi Adapter به دنبال "IPv4 Address" بگردید.

---

## 🎯 توصیه من:

**اگر فوری می‌خواهید:**
- ✅ راه 1: Command Line Tools (15 دقیقه)

**اگر زمان دارید:**
- ✅ راه 3: Android Studio کامل (45 دقیقه)

**اگر تکنیکال هستید:**
- ✅ راه 2: Docker (5 دقیقه)

---

## 💡 کمک بیشتر:

اگر در هر مرحله گیر کردید:
1. Screenshot بگیرید
2. خطا را کپی کنید
3. بهم بگویید

من کمکتون می‌کنم! 🚀

