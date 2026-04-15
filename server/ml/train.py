"""Train simple models for next-hour AQI, next-hour traffic_count, and next-day bin_fill.
Saves models to server/ml/models/*.joblib
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

DATA_PATH = "server/ml/training.csv"
OUT_DIR = "server/ml/models"
os.makedirs(OUT_DIR, exist_ok=True)

def fe(df):
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour
    df["dayofweek"] = df["timestamp"].dt.dayofweek
    df["day"] = df["timestamp"].dt.day
    # simple lag features grouped by site
    df = df.sort_values(["site_id","timestamp"]) 
    df["aqi_lag1"] = df.groupby("site_id")["aqi"].shift(1).fillna(method="bfill")
    df["traffic_lag1"] = df.groupby("site_id")["traffic_count"].shift(1).fillna(method="bfill")
    df["bin_lag1"] = df.groupby("site_id")["bin_fill"].shift(24).fillna(method="bfill")
    return df


def train():
    df = pd.read_csv(DATA_PATH)
    df = fe(df)
    # create targets
    df = df.sort_values(["site_id","timestamp"]) 
    df["aqi_next1h"] = df.groupby("site_id")["aqi"].shift(-1)
    df["traffic_next1h"] = df.groupby("site_id")["traffic_count"].shift(-1)
    df["bin_next24h"] = df.groupby("site_id")["bin_fill"].shift(-24)
    df = df.dropna()

    features = ["lat","lng","hour","dayofweek","aqi_lag1","traffic_lag1","bin_lag1"]

    X = df[features]
    models = {}
    for target, col in [("aqi", "aqi_next1h"), ("traffic", "traffic_next1h"), ("bin", "bin_next24h")]:
        y = df[col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        m = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
        m.fit(X_train, y_train)
        preds = m.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        print(f"Trained {target} model, MAE={mae:.2f}")
        path = os.path.join(OUT_DIR, f"{target}_model.joblib")
        joblib.dump(m, path)
        models[target] = path
    print("Saved models:", models)

if __name__ == "__main__":
    train()
