# Career Advisor Chatbot (Prototype)

## Quick Start
- `cd backend`
- `npm install`
- `npm run setup-db`
- `npm run dev`

## Frontend
- `cd frontend`
- `npm install`
- `npm run dev`

## One-Click Run (Windows)
- Double click `run.bat`

## Single Command (Root)
- `npm install`
- `npm run setup`
- `npm run dev`

## Single URL (Serve Frontend From Backend)
- `npm run build` (one-time)
- `npm run start`
- Or one command: `npm run serve`
- Open `http://localhost:3001`

## API
Base URL: `http://localhost:3001`

## Database Notes
- `npm run setup-db` now skips if DB already exists.
- To rebuild from scratch: `npm run reset-db` (this deletes the existing DB file).
- Server auto-initializes DB on first run if empty.

## Explore Careers (Job Catalog)
- Job catalog uses a separate SQLite DB: `backend/database/career_catalog.db`.
- Import 1000+ jobs from O*NET (online) with:
  - `npm --prefix backend run import-jobs`
- Reset and re-import:
  - `npm --prefix backend run reset-jobs`

### Data Source
- O*NET Database (text) download:
  - `https://www.onetcenter.org/dl_files/database/db_30_1_text.zip`
- O*NET license:
  - `https://www.onetcenter.org/license_db.html`

## Notes
- Uses SQLite. Configure `DB_PATH` if needed.
- Scenario and matcher are rule-based for prototype speed.
