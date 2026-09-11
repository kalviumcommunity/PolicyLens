# PolicyLens backend

FastAPI API with SQLite persistence.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API is available at `http://localhost:8000`. Interactive docs are at `/docs`.

Set `DATABASE_URL` and `FRONTEND_ORIGIN` in a `.env` file when deploying.

## API highlights

- `GET /health` checks API and database availability.
- `GET /api/policies?status=active&search=privacy&limit=20&offset=0` filters and paginates policies.
- `POST /api/policies` and `PATCH /api/policies/{policy_id}` manage policy records.
- `POST /api/policies/{policy_id}/analyses` saves an analysis and its findings together.
- `GET /api/policies/{policy_id}/analyses` returns the policy's analysis history.
