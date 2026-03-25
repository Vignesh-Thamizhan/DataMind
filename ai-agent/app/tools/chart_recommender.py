"""Chart recommendation service."""

from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class ChartRecommender:
    """Service for recommending chart types based on data."""
    
    @staticmethod
    def recommend_chart(columns: List[str], data: List[Dict[str, Any]], query: str) -> Dict[str, Any]:
        """
        Recommend chart type and configuration based on data.
        
        Args:
            columns: Column names from query result
            data: Query result data
            query: Original user query
        
        Returns:
            Chart recommendation with type and config
        """
        try:
            if len(data) == 0:
                return None
            
            # Analyze data types
            numeric_cols = ChartRecommender._get_numeric_columns(data)
            categorical_cols = ChartRecommender._get_categorical_columns(data)
            
            # Recommend based on column types and data
            if len(numeric_cols) >= 2:
                return {
                    "type": "scatter",
                    "x_key": numeric_cols[0],
                    "y_key": numeric_cols[1],
                    "config": {
                        "responsive": True,
                        "plugins": {
                            "legend": {"display": False}
                        }
                    }
                }
            
            elif len(categorical_cols) >= 1 and len(numeric_cols) >= 1:
                return {
                    "type": "bar",
                    "x_key": categorical_cols[0],
                    "y_key": numeric_cols[0],
                    "config": {
                        "responsive": True,
                        "indexAxis": "y" if len(categorical_cols) > 3 else "x"
                    }
                }
            
            elif len(numeric_cols) >= 1:
                if "time" in query.lower() or "month" in query.lower() or "date" in query.lower():
                    return {
                        "type": "line",
                        "x_key": categorical_cols[0] if categorical_cols else numeric_cols[0],
                        "y_key": numeric_cols[0],
                    }
                else:
                    return {
                        "type": "bar",
                        "x_key": columns[0],
                        "y_key": numeric_cols[0],
                    }
            
            return None
        
        except Exception as e:
            logger.error(f"Chart recommendation failed: {str(e)}")
            return None
    
    @staticmethod
    def _get_numeric_columns(data: List[Dict[str, Any]]) -> List[str]:
        """Identify numeric columns."""
        if not data:
            return []
        
        numeric = []
        first_row = data[0]
        
        for key, value in first_row.items():
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                numeric.append(key)
        
        return numeric
    
    @staticmethod
    def _get_categorical_columns(data: List[Dict[str, Any]]) -> List[str]:
        """Identify categorical columns."""
        if not data:
            return []
        
        categorical = []
        first_row = data[0]
        
        for key, value in first_row.items():
            if isinstance(value, str):
                categorical.append(key)
        
        return categorical


# Global instance
chart_recommender = ChartRecommender()
