// CineTrack Server — Express Application Entry Point
// TODO: Implement in Lab 3

// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { sequelize } = require('./models');
// const authRoutes = require('./routes/auth');
// const movieRoutes = require('./routes/movies');
// const userRoutes = require('./routes/user');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/user', userRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// // Database sync and server start
// sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`CineTrack server running on port ${PORT}`);
//   });
// }).catch(err => {
//   console.error('Failed to sync database:', err);
// });

// module.exports = app;
