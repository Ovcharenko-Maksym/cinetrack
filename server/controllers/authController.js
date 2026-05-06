const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');
const { stripTags } = require('../utils/sanitize');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toSafeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const trimmedName = typeof name === 'string' ? stripTags(name.trim()) : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!trimmedName) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password_hash: passwordHash,
      createdAt: new Date(),
    });

    await ActivityLog.create({ user_id: user.id, action: 'registered' });

    return res.status(201).json({
      user: toSafeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || !(await user.validatePassword(password || ''))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      user: toSafeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};
