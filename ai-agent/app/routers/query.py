"""Router for query execution and model listing."""

import time
import logging
from fastapi import APIRouter, HTTPException, status
from app.models import QueryRequest, QueryResponse, ModelsListResponse, ModelInfo
from app.services.duckdb_service import duckdb_service
from app.services.groq_service import groq_service
from app.services.gemini_service import gemini_service
from app.tools.chart_recommender import chart_recommender
from app.tools.sql_validator import sql_validator
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["query"])

AVAILABLE_MODELS = [
    # Groq - Llama 3 Models
    ModelInfo(provider="groq", model_id="llama3-70b", display_name="🦙 Llama 3 70B",
              description="Best quality SQL generation & complex queries", capabilities=["sql_generation", "insights"]),
    ModelInfo(provider="groq", model_id="llama3-8b", display_name="🦙 Llama 3 8B",
              description="Fast lightweight, good for quick queries", capabilities=["sql_generation"]),
    ModelInfo(provider="groq", model_id="llama2-70b", display_name="🦙 Llama 2 70B",
              description="Reliable reasoning over code", capabilities=["sql_generation", "insights"]),
    
    # Groq - Mixtral Models
    ModelInfo(provider="groq", model_id="mixtral", display_name="⚡ Mixtral 8x7B",
              description="Expert instruction following for SQL", capabilities=["sql_generation", "insights"]),
    ModelInfo(provider="groq", model_id="mixtral-8x22", display_name="⚡ Mixtral 8x22B",
              description="High capacity expert mixture model", capabilities=["sql_generation", "insights"]),
    
    # Groq - Gemma Models
    ModelInfo(provider="groq", model_id="gemma2-9b", display_name="✨ Gemma 2 9B",
              description="Efficient & fast reasoning", capabilities=["sql_generation"]),
    ModelInfo(provider="groq", model_id="gemma", display_name="✨ Gemma 7B",
              description="Lightweight efficient model", capabilities=["sql_generation"]),
    
    # Groq - Deepseek (Advanced)
    ModelInfo(provider="groq", model_id="deepseek-r1-distill-70b", display_name="🚀 DeepSeek R1 Distill 70B",
              description="Advanced reasoning with strong logic", capabilities=["sql_generation", "insights"]),
    
    # Gemini Models
    ModelInfo(provider="gemini", model_id="gemini-flash", display_name="💫 Gemini 1.5 Flash",
              description="Fast multimodal model", capabilities=["sql_generation", "insights"]),
    ModelInfo(provider="gemini", model_id="gemini-pro", display_name="🌟 Gemini 1.5 Pro",
              description="Advanced reasoning for complex analysis", capabilities=["sql_generation", "insights"]),
]


@router.get("/models", response_model=ModelsListResponse)
async def list_models():
    """Get list of available AI models."""
    return ModelsListResponse(models=AVAILABLE_MODELS)


@router.post("/query/run", response_model=QueryResponse)
async def run_query(request: QueryRequest):
    """
    Execute a natural language query on a dataset.

    Pipeline:
    1. Resolve LLM service (Groq or Gemini)
    2. Fetch dataset schema from DuckDB
    3. Generate SQL
    4. Validate SQL for safety
    5. Execute query
    6. Recommend chart type
    7. Generate AI insight
    """
    try:
        # Select LLM provider
        logger.info(f"Query request: provider={request.provider}, model={request.model}, dataset_id={request.dataset_id}")
        llm_service = gemini_service if request.provider == "gemini" else groq_service
        model_variant = request.model or settings.default_model
        logger.info(f"Using LLM service with model variant: {model_variant}")

        # Get schema
        logger.info(f"Fetching schema for dataset {request.dataset_id}")
        schema = duckdb_service.get_schema(request.dataset_id)
        if not schema:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Dataset {request.dataset_id} not found. Upload and process it first.",
            )

        schema_description = "\n".join(
            [f"- {col['name']} ({col['type']})" for col in schema]
        )
        # Tell the LLM the table name
        table_name = f"dataset_{request.dataset_id}"
        schema_description = f"Table: {table_name}\nColumns:\n{schema_description}"

        # Generate SQL
        logger.info(f"Generating SQL for: {request.query}")
        sql = llm_service.generate_sql(schema_description, request.query, model_variant)

        # Validate SQL
        if settings.enable_sql_validation:
            if not sql_validator.is_safe(sql):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Generated SQL failed safety validation (contains disallowed statements)",
                )
            sql = sql_validator.sanitize_sql(sql)

        # Execute query
        logger.info(f"Executing SQL: {sql}")
        start_time = time.time()
        data, columns, row_count = duckdb_service.execute_query(request.dataset_id, sql)
        execution_time_ms = int((time.time() - start_time) * 1000)

        # Recommend chart (non-fatal)
        chart = None
        try:
            chart = chart_recommender.recommend_chart(columns, data, request.query)
        except Exception as e:
            logger.warning(f"Chart recommendation failed: {str(e)}")

        # Generate insight (non-fatal)
        insight = None
        try:
            if data:
                data_summary = (
                    f"Query returned {row_count} rows with columns: {', '.join(columns)}.\n"
                    f"First row sample: {data[0] if data else 'N/A'}"
                )
                insight = llm_service.generate_insight(request.query, data_summary, model_variant)
        except Exception as e:
            logger.warning(f"Insight generation failed: {str(e)}")

        return QueryResponse(
            sql=sql,
            data=data,
            columns=columns,
            chart=chart,
            insight=insight,
            execution_time_ms=execution_time_ms,
            row_count=row_count,
        )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        logger.error(f"Query execution failed: {error_msg}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg
        )
