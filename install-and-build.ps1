# اسکریپت خودکار نصب و ساخت APK
# این اسکریپت Android Command Line Tools را دانلود و نصب می‌کند

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  نصب خودکار و ساخت APK" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# بررسی دسترسی اینترنت
Write-Host "[1/7] بررسی اتصال اینترنت..." -ForegroundColor Yellow
try {
    $null = Test-Connection -ComputerName www.google.com -Count 1 -ErrorAction Stop
    Write-Host "✓ اتصال اینترنت OK" -ForegroundColor Green
} catch {
    Write-Host "✗ خطا: اتصال اینترنت وجود ندارد!" -ForegroundColor Red
    exit 1
}

# ایجاد پوشه Android
Write-Host ""
Write-Host "[2/7] ایجاد پوشه‌ها..." -ForegroundColor Yellow
$androidHome = "C:\Android"
$cmdlineTools = "$androidHome\cmdline-tools\latest"

if (-not (Test-Path $androidHome)) {
    New-Item -ItemType Directory -Path $androidHome -Force | Out-Null
    Write-Host "✓ پوشه $androidHome ایجاد شد" -ForegroundColor Green
} else {
    Write-Host "✓ پوشه $androidHome موجود است" -ForegroundColor Green
}

# دانلود Command Line Tools
Write-Host ""
Write-Host "[3/7] دانلود Android Command Line Tools..." -ForegroundColor Yellow
Write-Host "  (این مرحله 2-5 دقیقه طول می‌کشد)" -ForegroundColor Gray

$cmdlineUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$zipFile = "$env:TEMP\cmdline-tools.zip"

try {
    # استفاده از WebClient برای دانلود با نمایش پیشرفت
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($cmdlineUrl, $zipFile)
    Write-Host "✓ دانلود کامل شد" -ForegroundColor Green
} catch {
    Write-Host "✗ خطا در دانلود: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "لطفاً دستی دانلود کنید:" -ForegroundColor Yellow
    Write-Host $cmdlineUrl -ForegroundColor Cyan
    exit 1
}

# استخراج فایل
Write-Host ""
Write-Host "[4/7] استخراج فایل‌ها..." -ForegroundColor Yellow

try {
    Expand-Archive -Path $zipFile -DestinationPath "$androidHome\cmdline-tools-temp" -Force
    
    # انتقال به مسیر صحیح
    if (-not (Test-Path "$cmdlineTools")) {
        New-Item -ItemType Directory -Path "$cmdlineTools" -Force | Out-Null
    }
    
    Move-Item -Path "$androidHome\cmdline-tools-temp\cmdline-tools\*" -Destination "$cmdlineTools" -Force
    Remove-Item -Path "$androidHome\cmdline-tools-temp" -Recurse -Force
    
    Write-Host "✓ استخراج کامل شد" -ForegroundColor Green
} catch {
    Write-Host "✗ خطا در استخراج: $_" -ForegroundColor Red
    exit 1
}

# تنظیم Environment Variables
Write-Host ""
Write-Host "[5/7] تنظیم Environment Variables..." -ForegroundColor Yellow

[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")
$env:ANDROID_HOME = $androidHome

$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$androidHome\platform-tools*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$androidHome\platform-tools;$androidHome\cmdline-tools\latest\bin", "User")
    $env:Path = "$env:Path;$androidHome\platform-tools;$androidHome\cmdline-tools\latest\bin"
}

Write-Host "✓ Environment Variables تنظیم شد" -ForegroundColor Green

# نصب Android SDK
Write-Host ""
Write-Host "[6/7] نصب Android SDK..." -ForegroundColor Yellow
Write-Host "  (این مرحله 3-7 دقیقه طول می‌کشد)" -ForegroundColor Gray

$sdkmanager = "$cmdlineTools\bin\sdkmanager.bat"

try {
    # قبول کردن لایسنس‌ها
    Write-Host "  در حال قبول لایسنس‌ها..." -ForegroundColor Gray
    "y" | & $sdkmanager --licenses 2>&1 | Out-Null
    
    # نصب پکیج‌های مورد نیاز
    Write-Host "  در حال نصب platform-tools..." -ForegroundColor Gray
    & $sdkmanager "platform-tools" 2>&1 | Out-Null
    
    Write-Host "  در حال نصب platforms..." -ForegroundColor Gray
    & $sdkmanager "platforms;android-33" 2>&1 | Out-Null
    
    Write-Host "  در حال نصب build-tools..." -ForegroundColor Gray
    & $sdkmanager "build-tools;33.0.0" 2>&1 | Out-Null
    
    Write-Host "✓ Android SDK نصب شد" -ForegroundColor Green
} catch {
    Write-Host "✗ خطا در نصب SDK: $_" -ForegroundColor Red
    exit 1
}

# ساخت APK
Write-Host ""
Write-Host "[7/7] ساخت APK..." -ForegroundColor Yellow
Write-Host "  (اولین بار 5-10 دقیقه طول می‌کشد)" -ForegroundColor Gray

$projectPath = "G:\vpn\mobile-app"

if (-not (Test-Path "$projectPath\android")) {
    Write-Host "✗ خطا: پوشه پروژه پیدا نشد!" -ForegroundColor Red
    Write-Host "  مسیر: $projectPath\android" -ForegroundColor Gray
    exit 1
}

try {
    Set-Location "$projectPath\android"
    
    Write-Host "  در حال ایجاد gradle wrapper..." -ForegroundColor Gray
    # ایجاد gradle wrapper اگر نباشد
    if (-not (Test-Path ".\gradle\wrapper\gradle-wrapper.jar")) {
        gradle wrapper
    }
    
    Write-Host "  در حال build..." -ForegroundColor Gray
    .\gradlew.bat assembleDebug
    
    $apkPath = "$projectPath\android\app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        Write-Host ""
        Write-Host "==================================" -ForegroundColor Green
        Write-Host "  ✓ موفقیت! APK ساخته شد" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "مسیر APK:" -ForegroundColor Cyan
        Write-Host $apkPath -ForegroundColor Yellow
        Write-Host ""
        Write-Host "برای نصب روی گوشی:" -ForegroundColor Cyan
        Write-Host "  1. فایل APK را به گوشی منتقل کنید" -ForegroundColor Gray
        Write-Host "  2. روی گوشی باز کنید و نصب کنید" -ForegroundColor Gray
        Write-Host ""
        
        # باز کردن پوشه
        explorer.exe (Split-Path $apkPath)
        
    } else {
        Write-Host "✗ خطا: APK ساخته نشد!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "✗ خطا در build: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "برای دیدن جزئیات بیشتر:" -ForegroundColor Yellow
    Write-Host "  cd G:\vpn\mobile-app\android" -ForegroundColor Gray
    Write-Host "  .\gradlew.bat assembleDebug" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "تمام!" -ForegroundColor Green

