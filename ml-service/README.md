# solace-ml

Python FastAPI service for SOLACE's ML/AI layer.

## Responsibilities

- Emotion classification via Hugging Face Inference API
- Personal pattern model (scikit-learn, trains per user after 14+ check-ins)
- Exposes a clean HTTP API consumed by the Node.js backend

## Setup

```bash
pip install -r requirements.txt
```

## Run (development)

```bash
uvicorn app.main:app --reload
```

Or from the monorepo root:

```bash
npm run dev:ml
```

Service starts on `http://localhost:8000`.

## Health check

```
GET /health
→ { "status": "ok", "service": "solace-ml" }
```

## Planned endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/emotion` | Classify emotion from check-in text |
| `POST` | `/predict` | Run personal pattern model for a user |
| `POST` | `/train` | Trigger weekly model re-train for a user |
