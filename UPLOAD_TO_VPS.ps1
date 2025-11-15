# اسکریپت آپلود به VPS
# اجرا: .\UPLOAD_TO_VPS.ps1

$VPS_IP = "89.44.241.83"
$VPS_USER = "root"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  آپلود فایل‌ها به VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IP سرور: $VPS_IP" -ForegroundColor Yellow
Write-Host ""

# رفتن به پوشه پروژه
Set-Location G:\vpn

Write-Host "[1/2] آپلود Backend..." -ForegroundColor Yellow
scp -r backend "${VPS_USER}@${VPS_IP}:/var/www/"
Write-Host "✓ Backend آپلود شد" -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] آپلود Admin Panel..." -ForegroundColor Yellow
scp -r admin-panel "${VPS_USER}@${VPS_IP}:/var/www/"
Write-Host "✓ Admin Panel آپلود شد" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ آپلود کامل شد!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "حالا در VPS دستورات زیر را اجرا کنید:" -ForegroundColor Cyan
Write-Host ""
Write-Host "cd /var/www/backend && npm install --production" -ForegroundColor Yellow
Write-Host "pm2 start server.js --name vpn-backend" -ForegroundColor Yellow
Write-Host "cd /var/www/admin-panel && npm install && npm run build" -ForegroundColor Yellow
Write-Host ""

