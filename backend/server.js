require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== CATEGORY ROUTES ====================

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ categories: rows });
  });
});

// Get single category
app.get('/api/categories/:id', (req, res) => {
  db.get('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ category: row });
  });
});

// Create category
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        description
      });
    }
  );
});

// Update category
app.put('/api/categories/:id', (req, res) => {
  const { name, description } = req.body;
  
  db.run(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Category updated successfully' });
    }
  );
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

// ==================== CONFIG ROUTES ====================

// Get all configs
app.get('/api/configs', (req, res) => {
  const query = `
    SELECT configs.*, categories.name as category_name 
    FROM configs 
    LEFT JOIN categories ON configs.category_id = categories.id 
    ORDER BY configs.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ configs: rows });
  });
});

// Get configs by category
app.get('/api/configs/category/:categoryId', (req, res) => {
  const query = `
    SELECT configs.*, categories.name as category_name 
    FROM configs 
    LEFT JOIN categories ON configs.category_id = categories.id 
    WHERE configs.category_id = ? AND configs.is_active = 1
    ORDER BY configs.created_at DESC
  `;
  
  db.all(query, [req.params.categoryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ configs: rows });
  });
});

// Get single config
app.get('/api/configs/:id', (req, res) => {
  db.get('SELECT * FROM configs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ config: row });
  });
});

// Create config
app.post('/api/configs', (req, res) => {
  const { name, config_url, category_id, is_active } = req.body;
  
  if (!name || !config_url) {
    res.status(400).json({ error: 'Name and config URL are required' });
    return;
  }

  db.run(
    'INSERT INTO configs (name, config_url, category_id, is_active) VALUES (?, ?, ?, ?)',
    [name, config_url, category_id || null, is_active !== undefined ? is_active : 1],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        config_url,
        category_id,
        is_active
      });
    }
  );
});

// Update config
app.put('/api/configs/:id', (req, res) => {
  const { name, config_url, category_id, is_active } = req.body;
  
  db.run(
    'UPDATE configs SET name = ?, config_url = ?, category_id = ?, is_active = ? WHERE id = ?',
    [name, config_url, category_id, is_active, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Config updated successfully' });
    }
  );
});

// Delete config
app.delete('/api/configs/:id', (req, res) => {
  db.run('DELETE FROM configs WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Config deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VPN API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
