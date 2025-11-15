# Simple APK Builder
# This script downloads Android SDK and builds APK automatically

Write-Host "=================================="
Write-Host "  Android APK Builder"
Write-Host "=================================="
Write-Host ""

# Step 1: Check internet
Write-Host "[1/7] Checking internet connection..."
try {
    $null = Test-Connection -ComputerName www.google.com -Count 1 -ErrorAction Stop
    Write-Host "OK: Internet connection" -ForegroundColor Green
} catch {
    Write-Host "ERROR: No internet connection!" -ForegroundColor Red
    exit 1
}

# Step 2: Create directories
Write-Host ""
Write-Host "[2/7] Creating directories..."
$androidHome = "C:\Android"
$cmdlineTools = "$androidHome\cmdline-tools\latest"

if (-not (Test-Path $androidHome)) {
    New-Item -ItemType Directory -Path $androidHome -Force | Out-Null
}
Write-Host "OK: Directory created" -ForegroundColor Green

# Step 3: Download Command Line Tools
Write-Host ""
Write-Host "[3/7] Downloading Android Command Line Tools..."
Write-Host "  This may take 2-5 minutes..."

$cmdlineUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$zipFile = "$env:TEMP\cmdline-tools.zip"

try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $cmdlineUrl -OutFile $zipFile
    Write-Host "OK: Download complete" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Download failed" -ForegroundColor Red
    Write-Host "Please download manually from:"
    Write-Host $cmdlineUrl
    exit 1
}

# Step 4: Extract files
Write-Host ""
Write-Host "[4/7] Extracting files..."

try {
    Expand-Archive -Path $zipFile -DestinationPath "$androidHome\cmdline-tools-temp" -Force
    
    if (-not (Test-Path "$cmdlineTools")) {
        New-Item -ItemType Directory -Path "$cmdlineTools" -Force | Out-Null
    }
    
    Copy-Item -Path "$androidHome\cmdline-tools-temp\cmdline-tools\*" -Destination "$cmdlineTools" -Recurse -Force
    Remove-Item -Path "$androidHome\cmdline-tools-temp" -Recurse -Force
    Remove-Item -Path $zipFile -Force
    
    Write-Host "OK: Extraction complete" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Extraction failed - $_" -ForegroundColor Red
    exit 1
}

# Step 5: Set Environment Variables
Write-Host ""
Write-Host "[5/7] Setting environment variables..."

[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")
$env:ANDROID_HOME = $androidHome

$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$androidHome\platform-tools*") {
    $newPath = "$currentPath;$androidHome\platform-tools;$androidHome\cmdline-tools\latest\bin"
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = "$env:Path;$androidHome\platform-tools;$androidHome\cmdline-tools\latest\bin"
}

Write-Host "OK: Environment variables set" -ForegroundColor Green

# Step 6: Install Android SDK
Write-Host ""
Write-Host "[6/7] Installing Android SDK..."
Write-Host "  This may take 3-7 minutes..."

$sdkmanager = "$cmdlineTools\bin\sdkmanager.bat"

if (-not (Test-Path $sdkmanager)) {
    Write-Host "ERROR: sdkmanager not found!" -ForegroundColor Red
    exit 1
}

try {
    # Accept licenses
    Write-Host "  Accepting licenses..."
    $input = "y`ny`ny`ny`ny`ny`ny`ny`n"
    $input | & $sdkmanager --licenses 2>&1 | Out-Null
    
    # Install packages
    Write-Host "  Installing platform-tools..."
    & $sdkmanager "platform-tools" 2>&1 | Out-Null
    
    Write-Host "  Installing platforms..."
    & $sdkmanager "platforms;android-33" 2>&1 | Out-Null
    
    Write-Host "  Installing build-tools..."
    & $sdkmanager "build-tools;33.0.0" 2>&1 | Out-Null
    
    Write-Host "OK: Android SDK installed" -ForegroundColor Green
} catch {
    Write-Host "ERROR: SDK installation failed - $_" -ForegroundColor Red
    exit 1
}

# Step 7: Build APK
Write-Host ""
Write-Host "[7/7] Building APK..."
Write-Host "  First build may take 5-10 minutes..."

$projectPath = "G:\vpn\mobile-app"

if (-not (Test-Path "$projectPath\android")) {
    Write-Host "ERROR: Project not found at $projectPath\android" -ForegroundColor Red
    exit 1
}

try {
    Set-Location "$projectPath\android"
    
    Write-Host "  Running gradle build..."
    .\gradlew.bat assembleDebug 2>&1 | Out-Null
    
    $apkPath = "$projectPath\android\app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        Write-Host ""
        Write-Host "=================================="  -ForegroundColor Green
        Write-Host "  SUCCESS! APK Built" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "APK Location:" -ForegroundColor Cyan
        Write-Host $apkPath -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Opening folder..." -ForegroundColor Cyan
        explorer.exe (Split-Path $apkPath)
        
    } else {
        Write-Host "ERROR: APK not found!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "ERROR: Build failed - $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "To see details, run:" -ForegroundColor Yellow
    Write-Host "  cd G:\vpn\mobile-app\android"
    Write-Host "  .\gradlew.bat assembleDebug"
    exit 1
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

