# راه‌اندازی MySQL برای پروژه VPN

## پیش‌نیازها

نصب MySQL Server روی سیستم شما

### نصب MySQL

#### Windows:
1. دانلود MySQL Installer از: https://dev.mysql.com/downloads/installer/
2. نصب MySQL Server
3. در حین نصب یک رمز عبور برای root تعیین کنید

#### Mac:
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## راه‌اندازی دیتابیس

### روش 1: استفاده از اسکریپت SQL (پیشنهادی)

```bash
# ورود به MySQL
mysql -u root -p

# در MySQL Console:
source setup-mysql.sql

# یا از خارج:
mysql -u root -p < setup-mysql.sql
```

### روش 2: ایجاد دستی

```bash
mysql -u root -p
```

در MySQL Console:

```sql
-- ایجاد دیتابیس
CREATE DATABASE vpn_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- استفاده از دیتابیس
USE vpn_management;

-- خروج
EXIT;
```

## تنظیمات Backend

1. **کپی کردن فایل تنظیمات:**

```bash
cp .env.example .env
```

2. **ویرایش فایل `.env`:**

```env
PORT=3000

# تنظیمات MySQL - مقادیر خود را وارد کنید
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vpn_management
DB_PORT=3306
```

3. **نصب پکیج‌های جدید:**

```bash
npm install
```

4. **اجرای سرور:**

```bash
npm start
```

## تست اتصال

برای تست اینکه Backend به MySQL متصل شده:

```bash
curl http://localhost:3000/api/health
```

باید پیام زیر را ببینید:
```json
{
  "status": "ok",
  "message": "VPN API is running with MySQL"
}
```

## مشکلات رایج

### خطای اتصال به MySQL

```
Error connecting to MySQL database: Access denied for user 'root'@'localhost'
```

**راه حل:**
- رمز عبور در `.env` را بررسی کنید
- مطمئن شوید MySQL در حال اجرا است

### خطای "database does not exist"

**راه حل:**
```sql
mysql -u root -p
CREATE DATABASE vpn_management;
```

### خطای Permission

**راه حل:**
```sql
mysql -u root -p

-- ایجاد کاربر جدید
CREATE USER 'vpn_user'@'localhost' IDENTIFIED BY 'your_password';

-- دادن دسترسی
GRANT ALL PRIVILEGES ON vpn_management.* TO 'vpn_user'@'localhost';
FLUSH PRIVILEGES;
```

سپس در `.env`:
```env
DB_USER=vpn_user
DB_PASSWORD=your_password
```

## بررسی جداول

```sql
mysql -u root -p vpn_management

-- نمایش جداول
SHOW TABLES;

-- نمایش ساختار جدول
DESCRIBE categories;
DESCRIBE configs;

-- نمایش داده‌ها
SELECT * FROM categories;
SELECT * FROM configs;
```

## Backup و Restore

### Backup:
```bash
mysqldump -u root -p vpn_management > backup.sql
```

### Restore:
```bash
mysql -u root -p vpn_management < backup.sql
```

## دستورات مفید MySQL

```sql
-- نمایش تمام دیتابیس‌ها
SHOW DATABASES;

-- انتخاب دیتابیس
USE vpn_management;

-- نمایش جداول
SHOW TABLES;

-- پاک کردن تمام داده‌ها (احتیاط!)
TRUNCATE TABLE configs;
TRUNCATE TABLE categories;

-- حذف دیتابیس (احتیاط!)
DROP DATABASE vpn_management;
```

## مقایسه SQLite و MySQL

| ویژگی | SQLite | MySQL |
|-------|--------|-------|
| سرعت | سریع‌تر برای تعداد کم | سریع‌تر برای تعداد زیاد |
| همزمانی | محدود | عالی |
| مقیاس‌پذیری | محدود | عالی |
| نصب | ندارد | نیاز به نصب |
| مناسب برای | Development | Production |

## امنیت در Production

برای استفاده در Production:

1. ✅ از کاربر root استفاده نکنید
2. ✅ رمز عبور قوی تعیین کنید
3. ✅ فقط دسترسی‌های لازم را بدهید
4. ✅ از SSL/TLS برای اتصال استفاده کنید
5. ✅ Backup منظم بگیرید
6. ✅ Log ها را بررسی کنید

موفق باشید! 🚀

