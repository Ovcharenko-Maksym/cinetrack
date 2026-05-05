// Auth Controller — handles registration and login logic
// TODO: Implement in Lab 3

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// };

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword });
//     const token = generateToken(user);
//
//     res.status(201).json({
//       user: { id: user.id, name: user.name, email: user.email },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//
//     const token = generateToken(user);
//
//     res.json({
//       user: { id: user.id, name: user.name, email: user.email },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// };
