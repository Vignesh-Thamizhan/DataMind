"""SQL Agent — wraps LLM service for NL→SQL generation."""

import logging
from app.services.groq_service import groq_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class SQLAgent:
    """Agent responsible for converting natural language queries to SQL."""

    def generate(
        self,
        schema_description: str,
        query: str,
        provider: str = "groq",
        model: str = None,
    ) -> str:
        """
        Generate SQL from natural language.

        Args:
            schema_description: Table name + column definitions
            query: User's natural language question
            provider: 'groq' or 'gemini'
            model: Specific model variant

        Returns:
            Generated SQL string
        """
        llm = gemini_service if provider == "gemini" else groq_service
        sql = llm.generate_sql(schema_description, query, model)
        logger.info(f"SQLAgent generated SQL via {provider}: {sql[:80]}...")
        return sql


sql_agent = SQLAgent()
