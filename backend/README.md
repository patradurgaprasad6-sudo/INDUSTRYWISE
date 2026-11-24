# Python API

Run from this directory:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Endpoints: `GET /api/health`, `GET /api/telemetry`, `GET /api/predictions`. These return synthetic demo data, not real sensor readings or validated predictions.
