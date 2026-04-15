from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import joblib
import numpy as np
import os

app = FastAPI(title="Madurai Insights Predictor")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml", "models")

models = {}
for name in ["aqi","traffic","bin"]:
    path = os.path.abspath(os.path.join(MODEL_DIR, f"{name}_model.joblib"))
    if os.path.exists(path):
        models[name] = joblib.load(path)
    else:
        models[name] = None

class SiteRequest(BaseModel):
    site_id: str
    lat: float
    lng: float
    hour: int
    dayofweek: int
    aqi_lag1: float
    traffic_lag1: float
    bin_lag1: float

class PredictRequest(BaseModel):
    sites: List[SiteRequest]

class PredictResponse(BaseModel):
    site_id: str
    aqi_pred: Optional[float]
    traffic_pred: Optional[float]
    bin_pred: Optional[float]

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": {k: (v is not None) for k,v in models.items()}}

@app.post("/predict", response_model=List[PredictResponse])
def predict(req: PredictRequest):
    out = []
    for s in req.sites:
        x = np.array([[s.lat, s.lng, s.hour, s.dayofweek, s.aqi_lag1, s.traffic_lag1, s.bin_lag1]])
        aqi_p = models["aqi"].predict(x)[0] if models.get("aqi") is not None else None
        traf_p = models["traffic"].predict(x)[0] if models.get("traffic") is not None else None
        bin_p = models["bin"].predict(x)[0] if models.get("bin") is not None else None
        out.append({"site_id": s.site_id, "aqi_pred": float(aqi_p) if aqi_p is not None else None,
                    "traffic_pred": float(traf_p) if traf_p is not None else None,
                    "bin_pred": float(bin_p) if bin_p is not None else None})
    return out
