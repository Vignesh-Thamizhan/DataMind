# DataMind AI — AI Data Analysis Platform

> Upload CSV/JSON/Excel → Ask questions in plain English → Get SQL, charts, and AI insights

**Stack:** React (Vite) + Node.js/Express + Python FastAPI + DuckDB + MongoDB  
**AI:** Google Gemini + Groq (Llama3, Mixtral, Gemma2)

---

## Quick Start

### Prerequisites
- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **Python** 3.11+ ([python.org](https://python.org))
- **MongoDB** local or Atlas ([mongodb.com](https://docs.mongodb.com/manual/installation/))
- **API Keys:**
  - Gemini: [console.cloud.google.com](https://console.cloud.google.com)
  - Groq: [console.groq.com](https://console.groq.com)

---

### 1. Setup Environment Files

```bash
cp server/.env.example server/.env
cp ai-agent/.env.example ai-agent/.env
```

Edit `.env` files and fill in:
- **server/.env** → `MONGO_URI`, `JWT_SECRET`
- **ai-agent/.env** → `GEMINI_API_KEY`, `GROQ_API_KEY`

---

### 2. Start Node.js Backend

```bash
cd server
npm install
npm run dev
```
✅ Runs on `http://localhost:5000`

---

### 3. Start Python AI Agent

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
✅ Runs on `http://localhost:8000`

---

### 4. Start React Frontend

```bash
cd client
npm install
npm run dev
```
✅ Runs on `http://localhost:3000`

---

## Project Structure

```
ai-analyst/
├── client/                    React + Vite + Tailwind + Chart.js
│   ├── src/
│   │   ├── components/        UI components (charts, query, dataset, insights)
│   │   ├── pages/            Page components (Login, Dashboard, Upload)
│   │   ├── services/         API client (Axios + interceptors)
│   │   ├── store/            Zustand state management
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                    Node.js Express API Gateway
│   ├── src/
│   │   ├── config/           Database & logging config
│   │   ├── controllers/      Route handlers
│   │   ├── middleware/       Auth, upload, rate limiting
│   │   ├── models/           Mongoose schemas
│   │   ├── routes/           API endpoints
│   │   ├── services/         Business logic
│   │   ├── utils/            Helpers & error handling
│   │   └── index.js
│   └── package.json
│
├── ai-agent/                  Python FastAPI AI Engine
│   ├── app/
│   │   ├── agents/           SQL generation, insights
│   │   ├── routers/          API endpoint definitions
│   │   ├── services/         LLM, DuckDB, data processing
│   │   ├── tools/            Chart recommendation, validation
│   │   ├── models/           Pydantic schemas
│   │   └── config.py
│   ├── main.py
│   └── requirements.txt
│
└── datasets/                  Shared volume for uploaded files
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user profile |

### Datasets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/datasets/upload` | Upload CSV/JSON/Excel |
| GET | `/api/datasets` | List user's datasets |
| GET | `/api/datasets/:id` | Dataset details + schema |
| DELETE | `/api/datasets/:id` | Delete dataset |

### Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query/run` | Execute natural language query |
| GET | `/api/query/models` | Available AI models |
| GET | `/api/history` | Query history |

#### POST /api/query/run

**Request:**
```json
{
  "datasetId": "mongo_object_id",
  "query": "Show revenue by month",
  "provider": "groq",
  "model": "llama3-70b"
}
```

**Response:**
```json
{
  "sql": "SELECT STRFTIME('%Y-%m', date) AS month, SUM(revenue) AS total FROM dataset GROUP BY 1 ORDER BY 1",
  "data": [{...}, {...}],
  "columns": ["month", "total"],
  "chart": {
    "type": "line",
    "x_key": "month",
    "y_key": "total"
  },
  "insight": "Revenue grew 32% from January to April...",
  "executionTimeMs": 1240
}
```

---

## Available AI Models

| Provider | Model | Key | Best For |
|----------|-------|-----|---------|
| **Groq** | Llama 3 70B | `llama3-70b` | General SQL, best quality |
| **Groq** | Mixtral 8x7B | `mixtral` | Instruction following |
| **Groq** | Llama 3 8B | `llama3-8b` | Fast, lightweight |
| **Groq** | Gemma 2 9B | `gemma2` | Efficient |
| **Gemini** | 1.5 Flash | `gemini-flash` | Fast + multimodal |
| **Gemini** | 1.5 Pro | `gemini-pro` | Complex reasoning |

---

## Development

### Install Dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd server && npm install

# AI Agent
cd ai-agent && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

### Run All Services (in separate terminals)

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: AI Agent
cd ai-agent && source venv/bin/activate && uvicorn main:app --reload

# Terminal 3: Frontend
cd client && npm run dev
```

---

## Architecture

```
┌─────────────┐
│   Browser   │
│ (React App) │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  Node.js (5000)      │
│  - JWT Auth          │
│  - Dataset Mgmt      │
│  - Query Routing     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Python Agent (8000)  │
│ - NL→SQL (Groq/GM)   │
│ - DuckDB Exec        │
│ - Insights Gen       │
│ - Chart Routing      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│    DuckDB / Files    │
│   (CSV/JSON/XLSX)    │
└──────────────────────┘
```

---

## Key Features

### 🗂️ Multi-Format Support
- CSV, JSON, Excel (XLSX), Parquet
- Automatic schema detection
- Data preview on upload

### 🤖 Multi-Model AI
- Groq (Llama3, Mixtral, Gemma2) — Fast & free
- Google Gemini (Flash, Pro) — Advanced reasoning

### 📊 Auto Chart Recommendation
- Bar, Line, Pie, Scatter, Histogram
- Intelligent axis selection

### 🔒 Security
- JWT authentication
- SQL injection prevention (regex validation)
- DuckDB sandboxing (in-memory)
- Rate limiting (100 req/15min global, 20 queries/min)

### ⚡ Performance
- Async dataset processing (202 Accepted)
- DuckDB VIEWs (zero data duplication)
- Frontend polling for async status

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
sudo lsof -i :5000     # Node backend
sudo lsof -i :8000     # Python agent
sudo lsof -i :3000     # React frontend
kill -9 <PID>
```

### MongoDB Connection Failed
- Ensure MongoDB is running locally or use Atlas URI
- Check `MONGO_URI` in `server/.env`

### Groq/Gemini API Errors
- Verify API keys in `ai-agent/.env`
- Check rate limits on respective consoles

### DuckDB Permission Denied
- Ensure `datasets/` directory is writable
- Check file permissions: `chmod 755 datasets/`

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## License

MIT License — See LICENSE file for details

---

## Support

For issues, feature requests, or questions:
- 📧 Email: support@datamind.dev
- 🐛 GitHub Issues: [Report a bug](../../issues)
- 💬 Discussions: [Join our community](../../discussions)
