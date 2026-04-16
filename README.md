# Smart Madurai — City Insights Dashboard

Overview
- Smart Madurai is a demo dashboard that visualizes city telemetry (traffic, air quality, energy, waste) with live telemetry, map visualizations, exportable reports, and AI predictions.
- The frontend is a polished React + TypeScript app (Vite) with Tailwind CSS and Leaflet maps. A TF.js client prototype and a server-side FastAPI predictor scaffold (scikit-learn) are included to demonstrate realistic ML pipelines.

What's included
- Interactive map with layers: Traffic, Pollution, Energy, Waste, Predictions
- Marker clustering, heatmaps (optional), popups and pulsing markers
- Real-time demo via Socket.IO (server at `server/socket-server.js`) with EventBus-driven notifications
- PDF export, CSV export of visible markers, and dashboard reporting (jsPDF + html2canvas)
- Client-side TF.js predictor prototype (`src/ml/predictor.ts`) and ML scaffold:
  - Synthetic data generator: `server/ml/generate_synthetic.py`
  - Training script: `server/ml/train.py` (produces joblib models)
  - FastAPI predictor: `server/predict_api/main.py` and `Dockerfile`
- Deployment-ready frontend (Vercel) and Dockerized predictor scaffold

Tech stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Mapping: Leaflet + react-leaflet; plugins: markercluster, leaflet.heat (dynamically imported)
- Realtime: Socket.IO (Node demo server + socket.io-client)
- ML (client): TensorFlow.js (lightweight demo predictor)
- ML (server): Python, scikit-learn (RandomForest baseline), joblib, FastAPI
- Reporting: jsPDF, html2canvas
- Devops: Vercel (frontend), Dockerfile for predictor (recommended hosts: Render, Railway)

Quick start (frontend)
1. Install dependencies
```bash
npm install
```
2. Start dev server
```bash
npm run dev
# Open: http://localhost:8080/
```
3. Build for production
```bash
npm run build
``` 

Run realtime demo server (optional)
```bash
# from repo root
# requires Node.js installed
npm run ws-server
# default demo emits telemetry every few seconds
```

ML: generate synthetic data, train, and run predictor (local)
1. Create a Python environment and install requirements
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r server/predict_api/requirements.txt
pip install scikit-learn pandas joblib
```
2. Generate synthetic data and train models
```bash
python server/ml/generate_synthetic.py
python server/ml/train.py
# models are saved to server/ml/models/
```
3. Run FastAPI predictor locally
```bash
uvicorn server.predict_api.main:app --reload --port 8081
# health: http://localhost:8081/health
# predict: POST http://localhost:8081/predict
```

Wiring frontend to predictor
- Set environment variable `VITE_PREDICTOR_URL` (or edit `src/lib/ws.ts` / API client) to point to `http://localhost:8081` or deployed endpoint.
- The Map page includes a 'Run Server Predictions' action to call the `/predict` endpoint and display results.

How this was built (from scratch → final)
1. Scaffolding: created a Vite + React + TypeScript app and added Tailwind.
2. Mapping UX: integrated `react-leaflet`, added map layers, clustering, legend, CSV export and marker popups.
3. Realtime: added a simple Socket.IO demo server and client integration; notifications via an EventBus.
4. Reporting: added jsPDF + html2canvas to export dashboard snapshots and PDFs.
5. ML prototypes: added a TF.js client predictor for instant demo predictions; scaffolded server-side ML with synthetic data generation and RandomForest baselines for realistic server predictions.
6. CI/Deploy fixes: resolved peer-deps issues by adding `.npmrc` with `legacy-peer-deps=true` and fixed Leaflet CSS ordering to ensure builds succeed on Vercel.
7. Polish: UI micro-interactions, Tawk chat snippet, and final Vercel deployment.

Analysis & Model Evaluation
- Data pipeline: align timestamps, fill/flag missing sensors, build lag and rolling-window features, encode cyclic time features (hour/day-of-week), and aggregate per-site when needed.
- Evaluation: use time-based splits (train/val/test) or holdout by site; metrics: MAE, RMSE, and per-site error analysis. Plot residuals and error distribution.
- Explainability: integrate SHAP for per-prediction feature contributions and global importance plots. Add UI elements to surface top contributing features for each prediction.
- Production concerns: monitor drift, add logging of inputs/outputs, validate input ranges, secure API endpoints, and add CI that retrains and validates models before deployment.

Files of interest
- `src/pages/Map.tsx` — main interactive map and prediction hooks
- `src/ml/predictor.ts` — client TF.js prototype
- `server/socket-server.js` — demo Socket.IO telemetry server
- `server/ml/generate_synthetic.py` — synthetic dataset generator
- `server/ml/train.py` — training pipeline (saves joblib models)
- `server/predict_api/main.py` — FastAPI predictor scaffold

Next steps / recommendations
- Replace synthetic data with real historical telemetry (upload to `data/`), retrain, and validate models.
- Deploy the predictor (Docker) to a cloud host and set `VITE_PREDICTOR_URL` in Vercel env variables.
- Add SHAP-based explainability visuals in marker popups and a model metrics page.
- Add authentication for sensitive endpoints and CI (GitHub Actions) to run tests and builds.

Support
If you want, I can:
- Run the training locally here and validate outputs
- Deploy the predictor to Render/Railway and wire environment variables
- Add SHAP explainability integration into the frontend

---
File: README.md — overview, setup, usage, and analysis for Smart Madurai project.
# Welcome to your Lovable project

TODO: Document your project here
