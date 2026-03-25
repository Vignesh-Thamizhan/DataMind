import os
from pydantic_settings import BaseSettings
from pathlib import Path

# Resolve root directory (2 levels up from this file: app/config.py -> ai-agent/)
ROOT_DIR = Path(__file__).parent.parent.parent.absolute()


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # API Keys
    gemini_api_key: str = ""
    groq_api_key: str = ""
    
    # Server Configuration
    uvicorn_host: str = "0.0.0.0"
    uvicorn_port: int = 8000
    uvicorn_reload: bool = True
    
    # Environment
    environment: str = "development"
    
    # Paths (resolved relative to project root)
    dataset_dir: str = str(ROOT_DIR / "datasets")
    duckdb_cache_dir: str = str(ROOT_DIR / "ai-agent" / "duckdb_cache")
    
    # Logging
    log_level: str = "INFO"
    
    # Model Configuration
    default_model: str = "llama3-70b"
    default_provider: str = "groq"
    
    # Query Timeout (seconds)
    query_timeout: int = 30
    
    # SQL Validation
    enable_sql_validation: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Ensure dataset directory exists
Path(settings.dataset_dir).mkdir(parents=True, exist_ok=True)
Path(settings.duckdb_cache_dir).mkdir(parents=True, exist_ok=True)
