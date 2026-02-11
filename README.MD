# Career Advisor Chatbot (Prototype)
AI Young Guru 2026

## Quick Start
- `cd backend`
- `npm install`
- `npm run setup-db`
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

## LLM API MODEL
GPT OSS 120B
See: https://console.groq.com/playground?model=openai/gpt-oss-120b

-----------------------------------------------------------------------------------
Credit
Team LLMagik
* Phạm Khôi Nguyên @thisIsAnVariableOfACoder
* Đinh Quang Minh @minhhdinh192
* Vũ Minh Hoàng @GetInHod
