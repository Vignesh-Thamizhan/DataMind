"""Groq LLM service for SQL generation and insights."""

from groq import Groq
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Map human-friendly model IDs to actual Groq model names
MODEL_MAP = {
    # Llama 3 Models
    "llama3-70b": "llama3-70b-8192",
    "llama3-8b": "llama3-8b-8192",
    "llama2-70b": "llama2-70b-4096",
    
    # Mixtral Models
    "mixtral": "mixtral-8x7b-32768",
    "mixtral-8x22": "mixtral-8x22b",
    
    # Gemma Models
    "gemma2-9b": "gemma2-9b-it",
    "gemma": "gemma-7b-it",
    
    # Other Models
    "deepseek-r1-distill-70b": "deepseek-r1-distill-llama-70b",
}


class GroqService:
    """Service for interacting with Groq API."""

    def __init__(self):
        if not settings.groq_api_key:
            logger.error("GROQ_API_KEY environment variable not set!")
            raise ValueError("GROQ_API_KEY environment variable is required")
        self.client = Groq(api_key=settings.groq_api_key)
        self.default_model = settings.default_model
        logger.info(f"GroqService initialized with default model: {self.default_model}")

    def _resolve_model(self, model: str) -> str:
        return MODEL_MAP.get(model, model)

    def generate_sql(self, schema_description: str, natural_language_query: str, model: str = None) -> str:
        """
        Generate SQL from natural language using Groq.

        Args:
            schema_description: Description of the dataset schema
            natural_language_query: User's natural language query
            model: Model to use (defaults to default_model)

        Returns:
            Generated SQL query
        """
        model_id = self._resolve_model(model or self.default_model)

        prompt = f"""You are a SQL expert. Given the following dataset schema, generate a SQL query that answers the user's question.

Schema:
{schema_description}

User Question: {natural_language_query}

Rules:
- Generate ONLY the SQL query without any explanation or markdown.
- The query must be valid DuckDB SQL.
- Use the table name as given in the schema (e.g. dataset_<id>).
- Never use DROP, DELETE, UPDATE, INSERT, or CREATE statements.
"""

        try:
            response = self.client.chat.completions.create(
                model=model_id,
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            sql = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if sql.startswith("```"):
                lines = sql.split("\n")
                sql = "\n".join(
                    line for line in lines
                    if not line.startswith("```")
                ).strip()

            logger.info(f"Generated SQL using {model_id}: {sql[:100]}...")
            return sql

        except Exception as e:
            logger.error(f"SQL generation failed with {model_id}: {type(e).__name__}: {str(e)}")
            raise

    def generate_insight(self, query: str, data_summary: str, model: str = None) -> str:
        """
        Generate AI insight based on query results.

        Args:
            query: Original user query
            data_summary: Summary of the data/results
            model: Model to use

        Returns:
            Generated insight text
        """
        model_id = self._resolve_model(model or self.default_model)

        prompt = f"""Based on the following data query and results, provide a brief, actionable insight (1-2 sentences).

Query: {query}

Data Summary:
{data_summary}

Insight:"""

        try:
            response = self.client.chat.completions.create(
                model=model_id,
                max_tokens=512,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            insight = response.choices[0].message.content.strip()
            logger.info(f"Generated insight using {model_id}")
            return insight

        except Exception as e:
            logger.error(f"Insight generation failed: {str(e)}")
            return "Unable to generate insight"


# Global instance
groq_service = GroqService()
