const express = require('express');
const auth = require('../middleware/auth');
const {
  getMovies,
  getMovieStatus,
  addMovie,
  updateMovie,
  deleteMovie,
  getCustomMovies,
  addCustomMovie,
  updateCustomMovie,
  deleteCustomMovie,
  getStats,
  getActivity,
  getProfile,
  updateProfile,
} = require('../controllers/userController');

const router = express.Router();

router.use(auth);

router.get('/movies', getMovies);
router.get('/movies/status/:imdbId', getMovieStatus);
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

router.get('/custom-movies', getCustomMovies);
router.post('/custom-movies', addCustomMovie);
router.put('/custom-movies/:id', updateCustomMovie);
router.delete('/custom-movies/:id', deleteCustomMovie);

router.get('/stats', getStats);
router.get('/activity', getActivity);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
