"""Insight Agent — wraps LLM service for data insight generation."""

import logging
from app.services.groq_service import groq_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class InsightAgent:
    """Agent responsible for generating data insights from query results."""

    def generate(
        self,
        query: str,
        data_summary: str,
        provider: str = "groq",
        model: str = None,
    ) -> str:
        """
        Generate an insight from query results.

        Args:
            query: Original user question
            data_summary: Summary description of the result data
            provider: 'groq' or 'gemini'
            model: Specific model variant

        Returns:
            Insight text (1-2 sentences)
        """
        llm = gemini_service if provider == "gemini" else groq_service
        insight = llm.generate_insight(query, data_summary, model)
        logger.info(f"InsightAgent generated insight via {provider}")
        return insight


insight_agent = InsightAgent()
