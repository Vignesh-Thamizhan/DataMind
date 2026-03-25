const axios = require("axios");
const logger = require("../config/logger");

const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";

const agentClient = axios.create({
  baseURL: AI_AGENT_URL,
  timeout: 60000,
});

// Intercept errors to log them better
agentClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.message || error.message;
      logger.error(`AI Agent error (${status}): ${detail}`);
    }
    return Promise.reject(error);
  }
);

const aiAgentService = {
  detectSchema: async (filePath, fileType) => {
    try {
      const response = await agentClient.post("/api/schema/detect", null, {
        params: { file_path: filePath, file_type: fileType },
      });
      return response.data;
    } catch (error) {
      logger.error(`Schema detection request failed: ${error.message}`);
      throw error;
    }
  },

  runQuery: async (payload) => {
    try {
      logger.info(`Calling AI agent with payload: dataset_id=${payload.dataset_id}, provider=${payload.provider}`);
      const response = await agentClient.post("/api/query/run", payload);
      return response.data;
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      logger.error(`Query execution request failed: ${detail}`);
      throw new Error(`AI Agent error: ${detail}`);
    }
  },

  getModels: async () => {
    try {
      const response = await agentClient.get("/api/models");
      return response.data;
    } catch (error) {
      logger.error(`Get models request failed: ${error.message}`);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await agentClient.get("/health");
      return response.data;
    } catch (error) {
      logger.error(`Health check request failed: ${error.message}`);
      throw error;
    }
  },
};

module.exports = aiAgentService;
