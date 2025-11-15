# VPN Backend API

Backend API برای مدیریت کانفیگ‌های VPN با Node.js و Express و SQLite

## نصب

```bash
npm install
```

## اجرا

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Categories

#### دریافت همه دسته‌بندی‌ها
```
GET /api/categories
```

Response:
```json
{
  "categories": [
    {
      "id": 1,
      "name": "ایرانسل",
      "description": "سرورهای مخصوص ایرانسل",
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

#### ایجاد دسته‌بندی
```
POST /api/categories
Content-Type: application/json

{
  "name": "ایرانسل",
  "description": "سرورهای مخصوص ایرانسل"
}
```

#### ویرایش دسته‌بندی
```
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "ایرانسل",
  "description": "توضیحات جدید"
}
```

#### حذف دسته‌بندی
```
DELETE /api/categories/:id
```

### Configs

#### دریافت همه کانفیگ‌ها
```
GET /api/configs
```

Response:
```json
{
  "configs": [
    {
      "id": 1,
      "name": "سرور آلمان 1",
      "config_url": "vless://...",
      "category_id": 1,
      "category_name": "ایرانسل",
      "is_active": 1,
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

#### دریافت کانفیگ‌های یک دسته‌بندی
```
GET /api/configs/category/:categoryId
```

#### ایجاد کانفیگ
```
POST /api/configs
Content-Type: application/json

{
  "name": "سرور آلمان 1",
  "config_url": "vless://uuid@server:port?...",
  "category_id": 1,
  "is_active": true
}
```

#### ویرایش کانفیگ
```
PUT /api/configs/:id
Content-Type: application/json

{
  "name": "سرور آلمان 1",
  "config_url": "vless://...",
  "category_id": 1,
  "is_active": true
}
```

#### حذف کانفیگ
```
DELETE /api/configs/:id
```

## تنظیمات

فایل `.env`:
```
PORT=3000
DB_PATH=./database.sqlite
```

## دیتابیس

پروژه از SQLite استفاده می‌کند. دیتابیس به صورت خودکار در اولین اجرا ایجاد می‌شود.

### Schema

**Categories Table:**
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Configs Table:**
```sql
CREATE TABLE configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  config_url TEXT NOT NULL,
  category_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## تست با curl

```bash
# Health check
curl http://localhost:3000/api/health

# ایجاد دسته‌بندی
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"ایرانسل","description":"سرورهای مخصوص ایرانسل"}'

# دریافت دسته‌بندی‌ها
curl http://localhost:3000/api/categories

# ایجاد کانفیگ
curl -X POST http://localhost:3000/api/configs \
  -H "Content-Type: application/json" \
  -d '{"name":"سرور آلمان","config_url":"vless://...","category_id":1}'

# دریافت کانفیگ‌ها
curl http://localhost:3000/api/configs
```

