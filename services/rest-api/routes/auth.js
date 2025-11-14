const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Database pengguna untuk autentikasi (terpisah dari 'users' di users.js)
const authUsers = [];

// Rahasia JWT (simpan di .env di produksi)
const JWT_SECRET = 'your-very-secret-key-please-change-me';

// POST /api/auth/register - Registrasi pengguna baru
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cek duplikat username atau email
    const existingUser = authUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Conflict', message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    authUsers.push(newUser);

    // Jangan kirim password kembali
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login pengguna
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari pengguna
    const user = authUsers.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    // Validasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    // Buat token JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        message: 'Login successful',
        token
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: 'Failed to login' });
  }
});

module.exports = router;