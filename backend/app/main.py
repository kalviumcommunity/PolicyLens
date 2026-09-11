from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine, get_db
from .models import Analysis, Finding, Policy, PolicyStatus
from .schemas import AnalysisCreate, AnalysisRead, PolicyCreate, PolicyRead, PolicyUpdate


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="PolicyLens API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        return {"status": "degraded", "service": "policylens-api"}
    return {"status": "ok", "service": "policylens-api"}


@app.get("/api/policies", response_model=list[PolicyRead])
def list_policies(
    status_filter: PolicyStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None, min_length=1, max_length=100),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[Policy]:
    query = select(Policy)
    if status_filter is not None:
        query = query.where(Policy.status == status_filter)
    if search:
        query = query.where(Policy.title.ilike(f"%{search}%"))
    query = query.order_by(Policy.updated_at.desc()).offset(offset).limit(limit)
    return list(db.scalars(query))


@app.post("/api/policies", response_model=PolicyRead, status_code=status.HTTP_201_CREATED)
def create_policy(payload: PolicyCreate, db: Session = Depends(get_db)) -> Policy:
    policy = Policy(**payload.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@app.get("/api/policies/{policy_id}", response_model=PolicyRead)
def get_policy(policy_id: int, db: Session = Depends(get_db)) -> Policy:
    policy = db.get(Policy, policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@app.patch("/api/policies/{policy_id}", response_model=PolicyRead)
def update_policy(policy_id: int, payload: PolicyUpdate, db: Session = Depends(get_db)) -> Policy:
    policy = db.get(Policy, policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(policy, field, value)
    db.commit()
    db.refresh(policy)
    return policy


@app.post("/api/policies/{policy_id}/analyses", response_model=AnalysisRead, status_code=status.HTTP_201_CREATED)
def create_analysis(policy_id: int, payload: AnalysisCreate, db: Session = Depends(get_db)) -> Analysis:
    if db.get(Policy, policy_id) is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    analysis = Analysis(
        policy_id=policy_id,
        status="completed",
        summary=payload.summary,
        findings=[Finding(**finding.model_dump()) for finding in payload.findings],
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


@app.get("/api/policies/{policy_id}/analyses", response_model=list[AnalysisRead])
def list_analyses(policy_id: int, db: Session = Depends(get_db)) -> list[Analysis]:
    if db.get(Policy, policy_id) is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    query = select(Analysis).where(Analysis.policy_id == policy_id).order_by(Analysis.created_at.desc())
    return list(db.scalars(query))
