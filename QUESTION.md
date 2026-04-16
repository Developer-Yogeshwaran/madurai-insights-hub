**Project Viva — Smart Madurai: Questions & Model Answers**

Q: What is the primary goal of this project?
A: Provide a real-time dashboard for city telemetry (traffic, pollution, energy, waste) with AI predictions and reporting to support decision making.

Q: How did you collect and prepare data for modeling?
A: For the demo we generated synthetic telemetry (server/ml/generate_synthetic.py). In production we'd ingest historical sensor CSVs or database exports, normalize timestamps, align sites, handle missing values, and create time-based features (hour, dayofweek) and lag/rolling statistics.

Q: What prediction targets did you implement?
A: Next-hour AQI, next-hour traffic_count, and next-day bin_fill.

Q: Which models did you train and why?
A: Baseline RandomForest regressors (scikit-learn) as they are robust, fast to train, and perform well on tabular time-series features. For production, consider LightGBM or a TensorFlow model for export.

Q: How do you evaluate model performance?
A: Use train/validation/test split by time or by site; metrics: MAE and RMSE for regression, plus residual analysis and per-site error breakdown. Track model drift over time.

Q: How are predictions served to the frontend?
A: A FastAPI service exposes `/predict` and `/health`. The frontend can call this API or receive pushed predictions via WebSocket; models are loaded from `server/ml/models/`.

Q: How did you make the app appear production-ready?
A: Polished UI with Tailwind, map layers and clustering, PDF export, Tawk chat, Vercel hosting, Dockerfile for the predictor, and deploy-ready configs (vercel.json). The ML pipeline produces SavedModels/joblib artifacts and a FastAPI container.

Q: How do you ensure predictions are explainable?
A: Integrate SHAP to show feature importance per prediction (planned). Provide summary plots and per-site feature contributions in popups.

Q: How is realtime telemetry handled?
A: Demo Socket.IO server (`server/socket-server.js`) emits telemetry; frontend connects with `socket.io-client` and forwards events to an in-memory EventBus for UI updates and notifications.

Q: How are alerts generated?
A: Simple threshold rules run on incoming telemetry (AQI >= 150, bin_fill >= 90) and model-predicted thresholds trigger proactive alerts via the NotificationsPanel.

Q: What monitoring or validation is in place for models?
A: Health endpoint reports models loaded. Best practice: add periodic evaluation jobs, logging of inputs/outputs, and drift detectors (data distribution & error rate monitoring).

Q: How did you handle dependency and build issues for deployment?
A: Added `.npmrc` to use `legacy-peer-deps` on CI, fixed CSS import ordering, and adjusted marker-cluster CSS paths. Frontend deployed on Vercel; predictor packaged in Docker.

Q: How are environment variables and secrets managed?
A: Use Vercel environment variables (`VITE_WS_URL`, `VITE_PREDICTOR_URL`) for runtime endpoints. API keys or tokens should be stored in the host's secret store and never committed.

Q: How would you productionize the predictor service?
A: Train on real historical data, tune and validate models, containerize, deploy to Render/Railway/ECS with autoscaling, add HTTPS, authentication, observability, and CI/CD.

Q: How is reproducibility ensured?
A: Commit training scripts, random seeds, and requirements (requirements.txt). For full reproducibility, use Docker to pin runtime and CI to run training and push versioned artifacts.

Q: What are key limitations of this demo approach?
A: Synthetic data may not reflect real sensor noise or concept drift. Models require careful feature engineering and real historical labeled data for reliable predictions.

Q: How do you handle missing or faulty sensor data?
A: Impute using forward/backward fill, use robust statistics, and flag sensors with high missing-rate. Use ensemble models robust to missing features or build separate imputers.

Q: What security concerns exist and how to mitigate them?
A: Secure prediction API with API keys or OAuth, enable CORS restrictions, validate inputs, rate-limit endpoints, and scan dependencies for vulnerabilities.

Q: How would you demonstrate model quality to judges?
A: Provide train/val/test metrics, per-site error tables, example predictions vs ground truth, SHAP explanation snapshots, and a reproducible training notebook.

Q: How can the frontend show confidence and explainability?
A: Show predicted value, prediction interval or model confidence score, and a short list of top contributing features (SHAP values) in the marker popup or side panel.

Q: What next steps would you recommend to make this production-ready?
A: Replace synthetic data with historical telemetry, retrain and version models, deploy the predictor to a reliable host, add monitoring and CI/CD, secure APIs, and add explainability and documentation.

---
File: QUESTION.md — created for viva prep.
