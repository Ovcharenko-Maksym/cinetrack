const { QueryTypes } = require('sequelize');
const { sequelize, User, CustomMovie, UserList, ActivityLog } = require('../models');
const { stripTags } = require('../utils/sanitize');

const STATUSES = new Set(['watchlist', 'watched', 'favorites']);

function mapCustomMovie(movie) {
  if (!movie) return null;
  return {
    id: movie.id,
    title: movie.title,
    director: movie.director,
    genre: movie.genre,
    year: movie.year,
    description: movie.description,
    posterUrl: movie.poster_url,
    createdAt: movie.created_at,
    updatedAt: movie.updated_at,
  };
}

function mapUserList(row) {
  return {
    id: row.id,
    status: row.status,
    userRating: row.user_rating === null ? null : Number(row.user_rating),
    review: row.review,
    watchedAt: row.watched_at,
    imdbId: row.imdb_id,
    customMovie: mapCustomMovie(row.CustomMovie),
  };
}

function listIdentityWhere(userId, { imdbId, customMovieId, status }) {
  return {
    user_id: userId,
    status,
    ...(imdbId ? { imdb_id: imdbId } : { custom_movie_id: customMovieId }),
  };
}

function sortRows(rows, sort) {
  const sorted = [...rows];
  const text = (row) => (row.CustomMovie?.title || row.imdb_id || '').toLowerCase();
  const year = (row) => Number(row.CustomMovie?.year || 0);

  switch (sort) {
    case 'title':
    case 'title-asc':
      sorted.sort((a, b) => text(a).localeCompare(text(b)));
      break;
    case 'title-desc':
      sorted.sort((a, b) => text(b).localeCompare(text(a)));
      break;
    case 'year':
    case 'year-newest':
      sorted.sort((a, b) => year(b) - year(a));
      break;
    case 'year-oldest':
      sorted.sort((a, b) => year(a) - year(b));
      break;
    case 'rating':
    case 'rating-desc':
      sorted.sort((a, b) => Number(b.user_rating || 0) - Number(a.user_rating || 0));
      break;
    case 'date':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    default:
      break;
  }

  return sorted;
}

async function logActivity(userId, action, row = {}) {
  await ActivityLog.create({
    user_id: userId,
    action,
    imdb_id: row.imdb_id || row.imdbId || null,
    custom_movie_id: row.custom_movie_id || row.customMovieId || null,
  });
}

exports.getMovies = async (req, res, next) => {
  try {
    const { status, sort = 'title-asc' } = req.query;
    const where = { user_id: req.user.id };

    if (status) {
      if (!STATUSES.has(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      where.status = status;
    }

    const rows = await UserList.findAll({
      where,
      include: [{ model: CustomMovie, required: false }],
    });

    return res.json(sortRows(rows, sort).map(mapUserList));
  } catch (error) {
    return next(error);
  }
};

exports.getMovieStatus = async (req, res, next) => {
  try {
    const row = await UserList.findOne({
      where: { user_id: req.user.id, imdb_id: req.params.imdbId },
      include: [{ model: CustomMovie, required: false }],
    });
    if (!row) return res.json(null);
    return res.json(mapUserList(row));
  } catch (error) {
    return next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const { imdbId, customMovieId, status } = req.body;

    if (!STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if ((!imdbId && !customMovieId) || (imdbId && customMovieId)) {
      return res.status(400).json({ error: 'Provide either imdbId or customMovieId' });
    }

    if (customMovieId) {
      const customMovie = await CustomMovie.findOne({
        where: { id: customMovieId, user_id: req.user.id },
      });
      if (!customMovie) return res.status(400).json({ error: 'Custom movie not found' });
    }

    const identityWhere = {
      user_id: req.user.id,
      ...(imdbId ? { imdb_id: imdbId } : { custom_movie_id: customMovieId }),
    };

    const existing = await UserList.findOne({ where: identityWhere });

    if (existing) {
      if (existing.status === status) {
        return res.status(409).json({ error: 'Movie is already in this list' });
      }

      const updates = { status, updated_at: new Date() };
      if (status === 'watched' && !existing.watched_at) {
        updates.watched_at = new Date();
      }
      await existing.update(updates);
      await logActivity(req.user.id, `added_${status}`, existing);

      const updated = await UserList.findByPk(existing.id, {
        include: [{ model: CustomMovie, required: false }],
      });
      return res.json(mapUserList(updated));
    }

    const row = await UserList.create({
      user_id: req.user.id,
      imdb_id: imdbId || null,
      custom_movie_id: customMovieId || null,
      status,
      watched_at: status === 'watched' ? new Date() : null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await logActivity(req.user.id, `added_${status}`, row);

    const created = await UserList.findByPk(row.id, {
      include: [{ model: CustomMovie, required: false }],
    });
    return res.status(201).json(mapUserList(created));
  } catch (error) {
    return next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const row = await UserList.findByPk(req.params.id);
    if (!row || row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates = {};
    const { status, userRating, review, watchedAt } = req.body;

    if (status !== undefined) {
      if (!STATUSES.has(status)) return res.status(400).json({ error: 'Invalid status' });
      updates.status = status;
      if (status === 'watched' && watchedAt === undefined) {
        updates.watched_at = new Date();
      }
    }

    if (userRating !== undefined) {
      const rating = Number(userRating);
      if (Number.isNaN(rating) || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'userRating must be between 1 and 10' });
      }
      updates.user_rating = rating;
    }

    if (review !== undefined) {
      const sanitizedReview = typeof review === 'string' ? stripTags(review) : review;
      if (sanitizedReview && sanitizedReview.length > 500) {
        return res.status(400).json({ error: 'Review must be 500 characters or less' });
      }
      updates.review = sanitizedReview || null;
    }

    if (watchedAt !== undefined) {
      updates.watched_at = watchedAt ? new Date(watchedAt) : null;
    }

    updates.updated_at = new Date();

    await row.update(updates);
    await logActivity(req.user.id, 'updated_movie', row);

    const updated = await UserList.findByPk(row.id, {
      include: [{ model: CustomMovie, required: false }],
    });
    return res.json(mapUserList(updated));
  } catch (error) {
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const row = await UserList.findByPk(req.params.id);
    if (!row || row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await row.destroy();
    await logActivity(req.user.id, 'removed_movie', row);

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

exports.getCustomMovies = async (req, res, next) => {
  try {
    const movies = await CustomMovie.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });
    return res.json(movies.map(mapCustomMovie));
  } catch (error) {
    return next(error);
  }
};

exports.addCustomMovie = async (req, res, next) => {
  try {
    const { title, director, genre, year, description, posterUrl } = req.body;
    const trimmedTitle = typeof title === 'string' ? stripTags(title.trim()) : '';

    if (!trimmedTitle) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (year !== undefined && year !== null && year !== '') {
      const numericYear = Number(year);
      if (!Number.isInteger(numericYear) || numericYear < 1888 || numericYear > 2030) {
        return res.status(400).json({ error: 'Year must be between 1888 and 2030' });
      }
    }

    const movie = await CustomMovie.create({
      user_id: req.user.id,
      title: trimmedTitle,
      director: director || null,
      genre: genre || null,
      year: year || null,
      description: description || null,
      poster_url: posterUrl || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await logActivity(req.user.id, 'added_custom', { custom_movie_id: movie.id });
    return res.status(201).json(mapCustomMovie(movie));
  } catch (error) {
    return next(error);
  }
};

exports.updateCustomMovie = async (req, res, next) => {
  try {
    const movie = await CustomMovie.findByPk(req.params.id);
    if (!movie || movie.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates = {};
    const allowedFields = ['title', 'director', 'genre', 'year', 'description'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field] || null;
    });
    if (req.body.posterUrl !== undefined) updates.poster_url = req.body.posterUrl || null;

    if (updates.title !== undefined && !String(updates.title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (updates.year !== undefined && updates.year !== null) {
      const numericYear = Number(updates.year);
      if (!Number.isInteger(numericYear) || numericYear < 1888 || numericYear > 2030) {
        return res.status(400).json({ error: 'Year must be between 1888 and 2030' });
      }
      updates.year = numericYear;
    }

    updates.updated_at = new Date();
    await movie.update(updates);
    return res.json(mapCustomMovie(movie));
  } catch (error) {
    return next(error);
  }
};

exports.deleteCustomMovie = async (req, res, next) => {
  try {
    const movie = await CustomMovie.findByPk(req.params.id);
    if (!movie || movie.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await movie.destroy();
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [summary] = await sequelize.query(
      `SELECT COUNT(*) AS total_watched,
              ROUND(AVG(user_rating), 1) AS avg_rating,
              COUNT(review) AS reviews_count
       FROM user_lists
       WHERE user_id = $1 AND status = 'watched'`,
      { bind: [req.user.id], type: QueryTypes.SELECT }
    );

    const distributionRows = await sequelize.query(
      `SELECT user_rating, COUNT(*) AS count
       FROM user_lists
       WHERE user_id = $1 AND status = 'watched' AND user_rating IS NOT NULL
       GROUP BY user_rating
       ORDER BY user_rating`,
      { bind: [req.user.id], type: QueryTypes.SELECT }
    );

    const ratingDistribution = {};
    for (let rating = 1; rating <= 10; rating += 1) ratingDistribution[String(rating)] = 0;
    distributionRows.forEach((row) => {
      ratingDistribution[String(Math.round(Number(row.user_rating)))] = Number(row.count);
    });

    const totalWatched = Number(summary.total_watched || 0);
    const avgRaw = summary.avg_rating === null ? 0 : parseFloat(Number(summary.avg_rating).toFixed(1));

    return res.json({
      totalWatched,
      avgRating: avgRaw,
      reviewsCount: Number(summary.reviews_count || 0),
      ratingDistribution,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const year = Number(req.query.year || new Date().getFullYear());
    const rows = await sequelize.query(
      `SELECT DATE(watched_at) AS day, COUNT(*) AS count
       FROM user_lists
       WHERE user_id = $1 AND watched_at IS NOT NULL
         AND EXTRACT(YEAR FROM watched_at) = $2
       GROUP BY DATE(watched_at)
       ORDER BY day`,
      { bind: [req.user.id, year], type: QueryTypes.SELECT }
    );

    return res.json(
      rows.map((row) => ({
        date: row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10),
        count: Number(row.count),
      }))
    );
  } catch (error) {
    return next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? stripTags(req.body.name.trim()) : '';
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ name });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return next(error);
  }
};
