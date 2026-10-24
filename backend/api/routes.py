from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.greeting import get_greeting

router = APIRouter(prefix="/api")


class HealthResponse(BaseModel):
    status: str


class GreetingResponse(BaseModel):
    message: str


@router.get("/health")
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/hello")
def hello() -> GreetingResponse:
    return GreetingResponse(message=get_greeting().message)
