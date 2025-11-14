const Joi = require('joi');

// User validation schema (from page.tsx)
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).max(150).required(),
  role: Joi.string().valid('admin', 'user', 'moderator').optional()
});

// User update validation schema (all fields optional)
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().integer().min(1).max(150).optional(),
  role: Joi.string().valid('admin', 'user', 'moderator').optional()
}).min(1); // At least one field must be provided

// Skema baru untuk registrasi
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Skema baru untuk login
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Validation middleware for creating users (from page.tsx)
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

// Validation middleware for updating users (from page.tsx)
const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

// Middleware baru
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation error', message: error.details[0].message });
  }
  next();
};

// Middleware baru
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation error', message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateRegister, // Ekspor baru
  validateLogin     // Ekspor baru
};