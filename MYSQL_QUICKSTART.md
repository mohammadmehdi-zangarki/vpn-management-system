# راه‌اندازی سریع با MySQL

## مرحله 1: نصب و راه‌اندازی MySQL

### Windows:
1. دانلود MySQL از: https://dev.mysql.com/downloads/installer/
2. نصب کنید و رمز عبور root را یادداشت کنید
3. MySQL Workbench را هم نصب کنید (برای مدیریت راحت‌تر)

## مرحله 2: ایجاد دیتابیس

### روش 1: با MySQL Command Line
```bash
# باز کردن MySQL
mysql -u root -p

# در MySQL:
CREATE DATABASE vpn_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### روش 2: با اسکریپت آماده
```bash
cd backend
mysql -u root -p < setup-mysql.sql
```

## مرحله 3: تنظیم Backend

1. **ویرایش فایل `backend/.env`:**

```env
PORT=3000

# تنظیمات MySQL - رمز عبور خود را وارد کنید
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=vpn_management
DB_PORT=3306
```

2. **نصب پکیج‌های جدید:**

```bash
cd backend
npm install
```

## مرحله 4: اجرا

```bash
npm start
```

باید این پیام‌ها را ببینید:
```
Connected to MySQL database successfully
MySQL database tables initialized successfully
Server is running on port 3000
Using MySQL database: vpn_management
```

## تست

مرورگر را باز کنید:
```
http://localhost:3000/api/health
```

باید ببینید:
```json
{
  "status": "ok",
  "message": "VPN API is running with MySQL"
}
```

## مشکل دارید؟

### MySQL اجرا نمیشه
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### رمز عبور رو یادم رفته
در Windows:
- برنامه "MySQL Installer - Community" را باز کنید
- "Reconfigure" روی MySQL Server
- رمز عبور جدید تعیین کنید

### دیتابیس ساخته نمیشه
```sql
mysql -u root -p
CREATE DATABASE vpn_management;
SHOW DATABASES;
EXIT;
```

## حالا چی کار کنم؟

1. ✅ Backend با MySQL اجرا شد
2. 🔄 پنل ادمین را اجرا کنید:
```bash
cd admin-panel
npm run dev
```
3. 🌐 مرورگر: http://localhost:3001
4. 📝 دسته‌بندی و کانفیگ اضافه کنید

همه چیز آماده است! 🎉

