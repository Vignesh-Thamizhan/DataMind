"""Main FastAPI application — routes delegated to routers."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import HTTPException

from app.config import settings
from app.services.duckdb_service import duckdb_service
from app.routers import schema as schema_router
from app.routers import query as query_router

logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("DataMind AI Agent starting...")
    yield
    logger.info("DataMind AI Agent shutting down...")
    duckdb_service.close()


app = FastAPI(
    title="DataMind AI Agent",
    description="NL→SQL AI Engine with Chart Recommendations",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(schema_router.router)
app.include_router(query_router.router)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "DataMind AI Agent",
        "environment": settings.environment,
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.uvicorn_host,
        port=settings.uvicorn_port,
        reload=settings.uvicorn_reload,
    )
