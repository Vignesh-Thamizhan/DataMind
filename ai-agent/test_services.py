#!/usr/bin/env python3
"""Test script to verify API services and configuration."""

import logging
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_config():
    """Test that configuration loads correctly."""
    logger.info("Testing configuration...")
    try:
        from app.config import settings
        logger.info(f"✓ Config loaded successfully")
        logger.info(f"  - GROQ_API_KEY: {'SET' if settings.groq_api_key else 'NOT SET'}")
        logger.info(f"  - GEMINI_API_KEY: {'SET' if settings.gemini_api_key else 'NOT SET'}")
        logger.info(f"  - Default model: {settings.default_model}")
        return settings
    except Exception as e:
        logger.error(f"✗ Config failed: {e}")
        sys.exit(1)

def test_groq_service(settings):
    """Test Groq service initialization."""
    logger.info("\nTesting Groq service...")
    try:
        from app.services.groq_service import groq_service
        logger.info(f"✓ Groq service initialized")
        logger.info(f"  - Default model: {groq_service.default_model}")
        return groq_service
    except Exception as e:
        logger.error(f"✗ Groq service failed: {e}")
        return None

def test_gemini_service(settings):
    """Test Gemini service initialization."""
    logger.info("\nTesting Gemini service...")
    try:
        from app.services.gemini_service import gemini_service
        logger.info(f"✓ Gemini service initialized")
        return gemini_service
    except Exception as e:
        logger.error(f"✗ Gemini service failed: {e}")
        return None

def test_duckdb_service():
    """Test DuckDB service initialization."""
    logger.info("\nTesting DuckDB service...")
    try:
        from app.services.duckdb_service import duckdb_service
        logger.info(f"✓ DuckDB service initialized")
        return duckdb_service
    except Exception as e:
        logger.error(f"✗ DuckDB service failed: {e}")
        return None

def test_sql_generation(groq_service):
    """Test SQL generation with Groq."""
    if not groq_service:
        logger.info("\nSkipping SQL generation test (Groq not available)")
        return
    
    logger.info("\nTesting SQL generation...")
    try:
        schema = "Table: test_data\nColumns:\n- id (INTEGER)\n- name (VARCHAR)\n- age (INTEGER)"
        query = "Get all names"
        sql = groq_service.generate_sql(schema, query)
        logger.info(f"✓ SQL generated successfully: {sql[:50]}...")
    except Exception as e:
        logger.error(f"✗ SQL generation failed: {type(e).__name__}: {e}")

if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("DataMind AI Agent - Service Health Check")
    logger.info("=" * 60)
    
    settings = test_config()
    groq_service = test_groq_service(settings)
    gemini_service = test_gemini_service(settings)
    duckdb_service = test_duckdb_service()
    
    if groq_service:
        test_sql_generation(groq_service)
    
    logger.info("\n" + "=" * 60)
    logger.info("Health check complete!")
    logger.info("=" * 60)
