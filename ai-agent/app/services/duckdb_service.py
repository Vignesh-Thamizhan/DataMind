"""DuckDB service for dataset management and query execution."""

import duckdb
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Tuple
import logging
from app.config import settings

logger = logging.getLogger(__name__)


class DuckDBService:
    """Service for interacting with DuckDB."""
    
    def __init__(self):
        self.db_path = Path(settings.duckdb_cache_dir) / "analytics.duckdb"
        self.conn = None
        self._connect()
    
    def _connect(self):
        """Establish DuckDB connection."""
        self.conn = duckdb.connect(str(self.db_path))
        logger.info(f"Connected to DuckDB: {self.db_path}")
    
    def load_dataset(self, file_path: str, dataset_id: str, file_type: str = "csv") -> bool:
        """
        Load dataset as a view in DuckDB.
        
        Args:
            file_path: Path to the dataset file
            dataset_id: MongoDB ObjectId for the dataset
            file_type: File type (csv, json, parquet, xlsx)
        
        Returns:
            True if successful
        """
        try:
            # Check if file exists
            if not Path(file_path).exists():
                logger.error(f"File does not exist: {file_path}")
                return False
            
            view_name = f"dataset_{dataset_id}"
            
            if file_type == "csv":
                self.conn.execute(f"""
                    CREATE OR REPLACE VIEW {view_name} AS
                    SELECT * FROM read_csv_auto('{file_path}')
                """)
            
            elif file_type == "json":
                self.conn.execute(f"""
                    CREATE OR REPLACE VIEW {view_name} AS
                    SELECT * FROM read_json_auto('{file_path}')
                """)
            
            elif file_type == "parquet":
                self.conn.execute(f"""
                    CREATE OR REPLACE VIEW {view_name} AS
                    SELECT * FROM read_parquet('{file_path}')
                """)
            
            elif file_type in ["xlsx", "xls"]:
                # Convert XLSX to parquet first
                df = pd.read_excel(file_path)
                parquet_path = file_path.replace(".xlsx", ".parquet").replace(".xls", ".parquet")
                df.to_parquet(parquet_path)
                
                self.conn.execute(f"""
                    CREATE OR REPLACE VIEW {view_name} AS
                    SELECT * FROM read_parquet('{parquet_path}')
                """)
            
            logger.info(f"Loaded dataset {dataset_id} as view {view_name}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to load dataset {dataset_id} from {file_path}: {str(e)}", exc_info=True)
            return False
    
    def get_schema(self, dataset_id: str) -> List[Dict[str, str]]:
        """
        Get schema of a dataset.
        
        Returns:
            List of {name, type} dicts
        """
        try:
            view_name = f"dataset_{dataset_id}"
            result = self.conn.execute(f"DESCRIBE {view_name}").fetchall()
            return [{"name": row[0], "type": str(row[1])} for row in result]
        except Exception as e:
            logger.error(f"Failed to get schema for {dataset_id}: {str(e)}")
            return []
    
    def get_sample_data(self, dataset_id: str, limit: int = 10) -> Tuple[List[Dict[str, Any]], int]:
        """
        Get sample data from a dataset.
        
        Returns:
            (data, total_row_count)
        """
        try:
            view_name = f"dataset_{dataset_id}"
            
            # Get sample
            sample = self.conn.execute(f"SELECT * FROM {view_name} LIMIT {limit}").fetchall()
            columns = [desc[0] for desc in self.conn.description]
            data = [dict(zip(columns, row)) for row in sample]
            
            # Get row count
            row_count = self.conn.execute(f"SELECT COUNT(*) FROM {view_name}").fetchone()[0]
            
            return data, row_count
        
        except Exception as e:
            logger.error(f"Failed to get sample data for {dataset_id}: {str(e)}")
            return [], 0
    
    def execute_query(self, dataset_id: str, sql: str) -> Tuple[List[Dict[str, Any]], List[str], int]:
        """
        Execute a SQL query on a dataset.
        
        Returns:
            (data, columns, row_count)
        """
        try:
            logger.info(f"Executing query on dataset {dataset_id}: {sql[:100]}...")
            result = self.conn.execute(sql).fetchall()
            columns = [desc[0] for desc in self.conn.description]
            data = [dict(zip(columns, row)) for row in result]
            logger.info(f"Query executed successfully. Rows: {len(data)}, Columns: {len(columns)}")
            return data, columns, len(data)
        
        except Exception as e:
            logger.error(f"Query execution failed on dataset {dataset_id}: {type(e).__name__}: {str(e)}\nSQL: {sql}")
            raise
    
    def close(self):
        """Close DuckDB connection."""
        if self.conn:
            self.conn.close()
            logger.info("DuckDB connection closed")


# Global instance
duckdb_service = DuckDBService()
