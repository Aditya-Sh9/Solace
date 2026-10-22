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
py -3.14 -m uvicorn app.main:app --port 8000
```

`py -3.14` asks the Windows launcher for 3.14 by name, so it works even when plain `python` is an
older install. No `--reload`: on Windows it leaves a worker process holding port 8000 after you stop it.

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
