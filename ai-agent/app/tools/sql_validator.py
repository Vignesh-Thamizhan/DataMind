"""SQL validation and safety checks."""

import re
import logging

logger = logging.getLogger(__name__)


class SQLValidator:
    """Service for validating SQL queries for safety."""
    
    DANGEROUS_KEYWORDS = [
        "DROP", "DELETE", "TRUNCATE", "INSERT", "UPDATE", "ALTER",
        "CREATE", "EXEC", "EXECUTE", "SCRIPT", "CALL", "GRANT", "REVOKE"
    ]
    
    @staticmethod
    def is_safe(sql: str) -> bool:
        """
        Check if SQL query is safe to execute.
        
        Args:
            sql: SQL query to validate
        
        Returns:
            True if safe, False otherwise
        """
        sql_upper = sql.upper().strip()
        
        # Check for dangerous keywords
        for keyword in SQLValidator.DANGEROUS_KEYWORDS:
            if re.search(rf'\b{keyword}\b', sql_upper):
                logger.warning(f"Dangerous keyword detected: {keyword}")
                return False
        
        # Only allow SELECT queries (readOnly)
        if not sql_upper.startswith("SELECT"):
            logger.warning("Query does not start with SELECT")
            return False
        
        return True
    
    @staticmethod
    def sanitize_sql(sql: str) -> str:
        """
        Sanitize SQL query for safe execution.
        
        Args:
            sql: SQL query to sanitize
        
        Returns:
            Sanitized SQL
        """
        # Remove leading/trailing whitespace
        sql = sql.strip()
        
        # Remove common markdown code block markers
        if sql.startswith("```"):
            sql = sql.split("```")[1].strip()
        if sql.startswith("sql"):
            sql = sql[3:].strip()
        
        return sql


# Global instance
sql_validator = SQLValidator()
