from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from .models import FindingSeverity, PolicyStatus


class PolicyBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=10000)
    status: PolicyStatus = PolicyStatus.draft
    version: str = Field(default="1.0", min_length=1, max_length=30)
    owner: str = Field(min_length=1, max_length=120)


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=10000)
    status: PolicyStatus | None = None
    version: str | None = Field(default=None, min_length=1, max_length=30)
    owner: str | None = Field(default=None, min_length=1, max_length=120)


class PolicyRead(PolicyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class FindingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    details: str
    severity: FindingSeverity
    recommendation: str


class FindingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    details: str = Field(default="", max_length=10000)
    severity: FindingSeverity = FindingSeverity.medium
    recommendation: str = Field(default="", max_length=10000)


class AnalysisCreate(BaseModel):
    summary: str = Field(default="", max_length=20000)
    findings: list[FindingCreate] = Field(default_factory=list)


class AnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    policy_id: int
    status: str
    summary: str
    created_at: datetime
    findings: list[FindingRead] = Field(default_factory=list)


class ReviewQueueItem(BaseModel):
    policy_id: int
    title: str
    owner: str
    status: PolicyStatus
    latest_analysis_id: int | None = None
    latest_analysis_at: datetime | None = None
    finding_count: int = 0
    high_priority_count: int = 0
    highest_severity: FindingSeverity | None = None
