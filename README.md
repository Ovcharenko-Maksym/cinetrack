# 🎬 CineTrack

Personal movie tracking service — search, rate, review, and organize your movie watchlist.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, React Router v6     |
| Styling    | CSS Modules, CSS Variables          |
| HTTP       | Axios                               |
| Backend    | Node.js, Express                    |
| Database   | PostgreSQL, Sequelize ORM           |
| Auth       | JWT, bcryptjs                       |
| Testing    | Jest, Supertest                     |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (for Labs 3–4)

### Run Frontend (Lab 1)

```bash
cd client
npm install
npm run dev
```

App opens at http://localhost:5173

### Run Backend (Labs 3–4)

```bash
cd server
npm install
npm run start
```

Server runs at http://localhost:5000

### Run Tests

```bash
npm install
npm test
```

## Project Structure

```
cinetrack/
├── client/                     ← React frontend (Lab 1)
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── pages/
│       ├── components/
│       ├── context/
│       ├── api/
│       └── utils/
├── server/                     ← Express backend (Labs 3–4)
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── db/
├── tests/                      ← Jest tests (Lab 5)
│   ├── unit/
│   └── integration/
├── package.json
└── README.md
```

## Lab Breakdown

| Lab | Focus                     | Status       |
|-----|---------------------------|--------------|
| 1   | Frontend (React + Vite)   | ✅ Implemented |
| 2   | CSS Design & Responsive   | ✅ Implemented |
| 3   | Backend (Express + REST)  | 📁 Scaffolded |
| 4   | Database (PostgreSQL)     | 📁 Scaffolded |
| 5   | Testing (Jest)            | 📁 Scaffolded |

## OMDB API Setup

1. Get a free API key at https://www.omdbapi.com/apikey.aspx
2. Copy `.env.example` to `.env`
3. Set `OMDB_API_KEY=your_key_here`

## Environment Variables

See `server/.env.example` for the full list:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinetrack
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
OMDB_API_KEY=your_omdb_key
```
