-- اسکریپت راه‌اندازی دیتابیس MySQL
-- این فایل را با دستور زیر اجرا کنید:
-- mysql -u root -p < setup-mysql.sql

-- ایجاد دیتابیس
CREATE DATABASE IF NOT EXISTS vpn_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- استفاده از دیتابیس
USE vpn_management;

-- ایجاد جدول دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ایجاد جدول کانفیگ‌ها
CREATE TABLE IF NOT EXISTS configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  config_url TEXT NOT NULL,
  category_id INT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category_id (category_id),
  INDEX idx_is_active (is_active),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- داده‌های نمونه (اختیاری)
-- INSERT INTO categories (name, description) VALUES 
-- ('ایرانسل', 'سرورهای مخصوص ایرانسل'),
-- ('همراه اول', 'سرورهای مخصوص همراه اول'),
-- ('رایتل', 'سرورهای مخصوص رایتل');

SELECT 'Database setup completed successfully!' as message;

