import { useState, useEffect } from "react";
import {
  getCustomMovies,
  addCustomMovie,
  updateCustomMovie,
  deleteCustomMovie,
  addUserMovie,
} from "../api";
import { useToast } from "../components/Toast";
import styles from "./MyMoviesPage.module.css";

const EMPTY_FORM = {
  title: "",
  director: "",
  genre: "",
  year: "",
  description: "",
  posterUrl: "",
};

function MyMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await getCustomMovies();
      setMovies(data);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (movie) => {
    setForm({
      title: movie.title || "",
      director: movie.director || "",
      genre: movie.genre || "",
      year: movie.year ? String(movie.year) : "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
    });
    setEditingId(movie.id);
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (form.year) {
      const y = Number(form.year);
      if (!Number.isInteger(y) || y < 1888 || y > 2030) {
        errors.year = "Year must be between 1888 and 2030";
      }
    }
    return errors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
      };

      if (editingId) {
        const updated = await updateCustomMovie(editingId, payload);
        setMovies((prev) =>
          prev.map((m) => (m.id === editingId ? updated : m)),
        );
        toast.success("Movie updated");
      } else {
        const created = await addCustomMovie(payload);
        setMovies((prev) => [created, ...prev]);
        toast.success("Movie created");
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save movie");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this movie? It will also be removed from all your lists.",
      )
    )
      return;
    try {
      await deleteCustomMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success("Movie deleted");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  const handleAddToList = async (customMovieId, status) => {
    try {
      await addUserMovie(customMovieId, status);
      const labels = {
        watchlist: "Watchlist",
        watched: "Watched",
        favorites: "Favorites",
      };
      toast.success(`Added to ${labels[status]}`);
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === "Movie is already in this list") {
        toast.info("Already in this list");
      } else {
        toast.error(msg || "Failed to add to list");
      }
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>My Movies</h1>
        <button className={styles.btnCreate} onClick={openCreateForm}>
          + Add Movie
        </button>
      </div>

      {showForm && (
        <div className={styles.formOverlay} onClick={closeForm}>
          <form
            className={styles.form}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2 className={styles.formTitle}>
              {editingId ? "Edit Movie" : "Add New Movie"}
            </h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Title *</label>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Movie title"
                />
                {formErrors.title && (
                  <span className={styles.fieldError}>{formErrors.title}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Year</label>
                <input
                  className={styles.input}
                  type="number"
                  value={form.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="2024"
                  min="1888"
                  max="2030"
                />
                {formErrors.year && (
                  <span className={styles.fieldError}>{formErrors.year}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Director</label>
                <input
                  className={styles.input}
                  value={form.director}
                  onChange={(e) => handleChange("director", e.target.value)}
                  placeholder="Director name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Genre</label>
                <input
                  className={styles.input}
                  value={form.genre}
                  onChange={(e) => handleChange("genre", e.target.value)}
                  placeholder="Drama, Thriller"
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Poster URL</label>
                <input
                  className={styles.input}
                  value={form.posterUrl}
                  onChange={(e) => handleChange("posterUrl", e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of the movie..."
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.btnSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Movie"}
              </button>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {movies.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎥</div>
          <p className={styles.emptyText}>No custom movies yet</p>
          <p className={styles.emptyHint}>
            Add movies that aren't on OMDB to track them in your lists
          </p>
          <button className={styles.btnCreate} onClick={openCreateForm}>
            + Add Your First Movie
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <div className={styles.cardPoster}>
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className={styles.posterImg}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={styles.posterPlaceholder}
                  style={{ display: movie.posterUrl ? "none" : "flex" }}
                >
                  🎬
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{movie.title}</h3>
                <div className={styles.cardMeta}>
                  {movie.year && <span>{movie.year}</span>}
                  {movie.director && <span>{movie.director}</span>}
                </div>
                {movie.genre && (
                  <span className={styles.cardGenre}>{movie.genre}</span>
                )}
                {movie.description && (
                  <p className={styles.cardDesc}>{movie.description}</p>
                )}
              </div>

              <div className={styles.cardActions}>
                <div className={styles.listActions}>
                  <button
                    className={styles.listBtn}
                    onClick={() => handleAddToList(movie.id, "watchlist")}
                    title="Add to Watchlist"
                  >
                    📋
                  </button>
                  <button
                    className={styles.listBtn}
                    onClick={() => handleAddToList(movie.id, "watched")}
                    title="Mark as Watched"
                  >
                    ✓
                  </button>
                  <button
                    className={styles.listBtn}
                    onClick={() => handleAddToList(movie.id, "favorites")}
                    title="Add to Favorites"
                  >
                    ♥
                  </button>
                </div>
                <div className={styles.editActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => openEditForm(movie)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.editBtn} ${styles.deleteBtnText}`}
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyMoviesPage;
