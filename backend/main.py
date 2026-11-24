"""INDUSTRYWISE demo API. Replace the synthetic generator with sensor ingestion for deployment."""
from datetime import datetime, timezone
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="INDUSTRYWISE API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health():
    return {"status": "online", "service": "industrywise-api", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/telemetry")
def telemetry():
    # Synthetic demo values. Do not use for operational decisions.
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "synthetic-demo",
        "assets": [
            {"id": "M-04", "temperature_c": round(random.uniform(66, 71), 1), "vibration_mm_s": round(random.uniform(3.8, 4.7), 2), "health": 96, "status": "normal"},
            {"id": "P-02", "temperature_c": round(random.uniform(70, 76), 1), "vibration_mm_s": round(random.uniform(5.1, 6.2), 2), "health": 78, "status": "warning"},
            {"id": "R-01", "temperature_c": round(random.uniform(42, 47), 1), "vibration_mm_s": round(random.uniform(1.1, 1.8), 2), "health": 99, "status": "normal"},
        ],
    }

@app.get("/api/predictions")
def predictions():
    return {"source": "demo-rule-based-placeholder", "asset": "P-02", "risk": "elevated", "maintenance_window_hours": 72, "confidence": 0.87, "note": "Illustrative output; connect and validate a trained model before use."}
