const express = require('express');
const {
  search,
  getDetails,
  getTop,
  getCollections,
  getCollection,
} = require('../controllers/movieController');

const router = express.Router();

router.get('/search', search);
router.get('/top', getTop);
router.get('/collections', getCollections);
router.get('/collections/:id', getCollection);
router.get('/:imdbId', getDetails);

module.exports = router;
