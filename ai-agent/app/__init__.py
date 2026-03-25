"""DataMind AI Agent - Main package."""

from app.config import settings
from app.services.duckdb_service import duckdb_service
from app.services.groq_service import groq_service
from app.services.gemini_service import gemini_service

__version__ = "1.0.0"
__all__ = [
    "settings",
    "duckdb_service",
    "groq_service",
    "gemini_service",
]
