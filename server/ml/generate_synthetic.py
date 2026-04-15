"""Generate synthetic multi-site telemetry for training.
Outputs CSV to server/ml/training.csv
"""
import csv
import random
from datetime import datetime, timedelta

SITES = [
    {"id": f"S{i}", "name": name, "lat": 9.92 + i * 0.01, "lng": 78.12 + i * 0.01}
    for i, name in enumerate(["Meenakshi", "Anna Nagar", "Madakulam", "Gandhi Park", "Simmakkal"], start=1)
]

def generate(start: datetime, hours: int, out_path: str):
    rows = []
    for h in range(hours):
        ts = start + timedelta(hours=h)
        for s in SITES:
            base_aqi = 50 + (s["lat"] - 9.92) * 100
            aqi = max(5, int(random.gauss(base_aqi, 25)))
            pm25 = max(1, int(aqi * 0.4 + random.gauss(0, 5)))
            traffic = max(0, int(random.gauss(5000 + (aqi - 50) * 10, 800)))
            energy = max(10, int(random.gauss(800 + (traffic / 10), 200)))
            bin_fill = max(0, min(100, int(random.gauss(30 + (h % 240) / 2, 15))))
            rows.append({
                "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
                "site_id": s["id"],
                "site_name": s["name"],
                "lat": s["lat"],
                "lng": s["lng"],
                "aqi": aqi,
                "pm25": pm25,
                "traffic_count": traffic,
                "energy_kwh": energy,
                "bin_fill": bin_fill,
            })

    fieldnames = ["timestamp","site_id","site_name","lat","lng","aqi","pm25","traffic_count","energy_kwh","bin_fill"]
    with open(out_path, "w", newline="", encoding="utf8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

if __name__ == "__main__":
    start = datetime.utcnow() - timedelta(days=180)
    generate(start, hours=24*180, out_path="server/ml/training.csv")
    print("Generated server/ml/training.csv")
