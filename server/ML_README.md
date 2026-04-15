This folder contains a simple synthetic-data-based ML pipeline and a FastAPI predictor service.

Steps to run locally:

1. Create a virtualenv and install deps (Python 3.11+ recommended):

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r server/predict_api/requirements.txt
pip install pandas numpy scikit-learn joblib
```

2. Generate synthetic data and train models:

```bash
python server/ml/generate_synthetic.py
python server/ml/train.py
```

3. Run the API locally:

```bash
cd server/predict_api
uvicorn main:app --reload --port 8080
```

4. Call `/health` and `/predict` endpoints.

Docker:

```bash
docker build -t madurai-predictor server/predict_api
docker run -p 8080:8080 madurai-predictor
```

Notes:
- This pipeline uses synthetic data as a bootstrap. Replace `server/ml/training.csv` with your historical CSV for stronger models.
- After training, models are saved to `server/ml/models/` and the FastAPI service loads them on start.
