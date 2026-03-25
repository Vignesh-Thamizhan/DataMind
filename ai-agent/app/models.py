"""Pydantic schemas for request/response validation."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# ============== Dataset Schemas ==============
class DatasetSchema(BaseModel):
    """Dataset schema information."""
    name: str
    columns: List[Dict[str, str]]  # [{"name": "id", "type": "INTEGER"}]
    row_count: int
    file_path: str
    file_type: str  # csv, json, xlsx, parquet


# ============== Query Schemas ==============
class QueryRequest(BaseModel):
    """Request to run a natural language query."""
    dataset_id: str = Field(..., description="MongoDB ObjectId of the dataset")
    query: str = Field(..., description="Natural language query")
    provider: Optional[str] = Field("groq", description="LLM provider: groq or gemini")
    model: Optional[str] = Field(None, description="Model name, defaults to DEFAULT_MODEL")


class QueryResponse(BaseModel):
    """Response from query execution."""
    sql: str = Field(..., description="Generated SQL query")
    data: List[Dict[str, Any]] = Field(..., description="Query results")
    columns: List[str] = Field(..., description="Column names")
    chart: Optional[Dict[str, Any]] = Field(None, description="Recommended chart config")
    insight: Optional[str] = Field(None, description="AI-generated insight")
    execution_time_ms: int = Field(..., description="Query execution time")
    row_count: int = Field(..., description="Number of rows returned")


# ============== Chart Schemas ==============
class ChartRecommendation(BaseModel):
    """Chart recommendation based on data."""
    chart_type: str = Field(..., description="bar, line, pie, scatter, histogram")
    title: str
    x_key: str
    y_key: str
    config: Optional[Dict[str, Any]] = Field(None, description="Chart.js config")


# ============== Schema Detection ==============
class SchemaDetectionRequest(BaseModel):
    """Request to detect dataset schema."""
    file_path: str
    file_type: str


class SchemaDetectionResponse(BaseModel):
    """Response from schema detection."""
    columns: List[Dict[str, str]]
    sample_data: List[Dict[str, Any]]
    row_count: int


# ============== Model Information ==============
class ModelInfo(BaseModel):
    """Information about available AI models."""
    provider: str
    model_id: str
    display_name: str
    description: str
    capabilities: List[str]  # ["sql_generation", "insights"]


class ModelsListResponse(BaseModel):
    """List of available models."""
    models: List[ModelInfo]


# ============== Error Response ==============
class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    detail: Optional[str] = None
    status_code: int
