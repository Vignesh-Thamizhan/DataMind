"""Router for schema detection endpoints."""

from fastapi import APIRouter, HTTPException, status, Query
from app.services.duckdb_service import duckdb_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/schema", tags=["schema"])


@router.post("/detect")
async def detect_schema(file_path: str = Query(...), file_type: str = Query(...)):
    """
    Load a dataset file into DuckDB and return its schema + sample data.
    Called by Node.js server after a file upload.
    """
    try:
        logger.info(f"Detecting schema for file_path={file_path}, file_type={file_type}")
        dataset_id = file_path.split("/")[-1]
        # Strip extension for use as dataset_id
        for ext in [".csv", ".json", ".xlsx", ".xls", ".parquet"]:
            if dataset_id.endswith(ext):
                dataset_id = dataset_id[: -len(ext)]
                break

        loaded = duckdb_service.load_dataset(file_path, dataset_id, file_type)
        if not loaded:
            logger.error(f"DuckDB load_dataset returned False for {dataset_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to load dataset into DuckDB",
            )

        schema = duckdb_service.get_schema(dataset_id)
        sample_data, row_count = duckdb_service.get_sample_data(dataset_id, limit=5)

        return {
            "dataset_id": dataset_id,
            "columns": schema,
            "sample_data": sample_data,
            "row_count": row_count,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Schema detection error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
