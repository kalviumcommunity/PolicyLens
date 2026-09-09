from datetime import datetime

from pydantic import BaseModel, ConfigDict

from .models import FindingSeverity, PolicyStatus


class PolicyBase(BaseModel):
    title: str
    description: str = ""
    status: PolicyStatus = PolicyStatus.draft
    version: str = "1.0"
    owner: str


class PolicyCreate(PolicyBase):
    pass


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


class AnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    policy_id: int
    status: str
    summary: str
    created_at: datetime
    findings: list[FindingRead] = []
