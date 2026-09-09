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
