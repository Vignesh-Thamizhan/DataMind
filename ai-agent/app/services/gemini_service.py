"""Google Gemini API service for SQL generation and insights."""

import google.generativeai as genai
import logging
from app.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google Gemini API."""
    
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = "gemini-1.5-flash"  # or gemini-1.5-pro
    
    def generate_sql(self, schema_description: str, natural_language_query: str, model: str = None) -> str:
        """
        Generate SQL from natural language using Gemini.
        
        Args:
            schema_description: Description of the dataset schema
            natural_language_query: User's natural language query
            model: Model variant (flash or pro)
        
        Returns:
            Generated SQL query
        """
        model_name = f"gemini-1.5-{model or 'flash'}"
        
        prompt = f"""You are a SQL expert. Given the following dataset schema, generate a SQL query that answers the user's question.

Schema:
{schema_description}

User Question: {natural_language_query}

Generate ONLY the SQL query without any explanation. The query should be valid DuckDB SQL.
"""
        
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            sql = response.text.strip()
            
            # Remove markdown code blocks if present
            if sql.startswith("```"):
                sql = sql.split("```")[1].replace("sql", "", 1).strip()
            
            logger.info(f"Generated SQL using {model_name}: {sql[:100]}...")
            return sql
        
        except Exception as e:
            logger.error(f"SQL generation failed with Gemini: {str(e)}")
            raise
    
    def generate_insight(self, query: str, data_summary: str, model: str = None) -> str:
        """
        Generate AI insight based on query results using Gemini.
        
        Args:
            query: Original user query
            data_summary: Summary of the data/results
            model: Model variant
        
        Returns:
            Generated insight text
        """
        model_name = f"gemini-1.5-{model or 'flash'}"
        
        prompt = f"""Based on the following data query and results, provide a brief, actionable insight (1-2 sentences).

Query: {query}

Data Summary:
{data_summary}

Insight:"""
        
        try:
            model_obj = genai.GenerativeModel(model_name)
            response = model_obj.generate_content(prompt)
            insight = response.text.strip()
            
            logger.info(f"Generated insight using {model_name}")
            return insight
        
        except Exception as e:
            logger.error(f"Insight generation failed with Gemini: {str(e)}")
            return "Unable to generate insight"


# Global instance
gemini_service = GeminiService()
