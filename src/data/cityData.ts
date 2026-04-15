// Simulated real-world data for Madurai city

export const trafficData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  vehicles: Math.round(
    200 + 800 * Math.exp(-((i - 9) ** 2) / 8) + 600 * Math.exp(-((i - 18) ** 2) / 6) + Math.random() * 100
  ),
  avgSpeed: Math.round(45 - 25 * Math.exp(-((i - 9) ** 2) / 8) - 20 * Math.exp(-((i - 18) ** 2) / 6) + Math.random() * 5),
  congestionIndex: +(
    0.2 + 0.6 * Math.exp(-((i - 9) ** 2) / 8) + 0.5 * Math.exp(-((i - 18) ** 2) / 6) + Math.random() * 0.1
  ).toFixed(2),
}));

export const weeklyTraffic = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
  day,
  vehicles: Math.round(12000 + Math.random() * 5000 + (i < 5 ? 3000 : 0)),
  incidents: Math.round(2 + Math.random() * 8),
}));

export const pollutionData = [
  { area: 'Meenakshi Temple Zone', pm25: 42, pm10: 78, aqi: 95, co: 1.2, no2: 28, so2: 12, lat: 9.9195, lng: 78.1193 },
  { area: 'Periyar Bus Stand', pm25: 68, pm10: 112, aqi: 156, co: 2.8, no2: 45, so2: 22, lat: 9.9220, lng: 78.1240 },
  { area: 'Goripalayam', pm25: 55, pm10: 95, aqi: 128, co: 2.1, no2: 38, so2: 18, lat: 9.9280, lng: 78.1180 },
  { area: 'Mattuthavani', pm25: 72, pm10: 125, aqi: 168, co: 3.2, no2: 52, so2: 25, lat: 9.9350, lng: 78.1350 },
  { area: 'Anna Nagar', pm25: 30, pm10: 55, aqi: 72, co: 0.8, no2: 20, so2: 8, lat: 9.9150, lng: 78.1050 },
  { area: 'KK Nagar', pm25: 35, pm10: 62, aqi: 82, co: 1.0, no2: 24, so2: 10, lat: 9.9100, lng: 78.0950 },
  { area: 'Thirunagar', pm25: 48, pm10: 85, aqi: 108, co: 1.6, no2: 32, so2: 15, lat: 9.9050, lng: 78.1100 },
  { area: 'Vilangudi', pm25: 25, pm10: 45, aqi: 58, co: 0.6, no2: 15, so2: 6, lat: 9.9400, lng: 78.1000 },
];

export const monthlyPollution = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => ({
  month,
  aqi: Math.round(80 + 40 * Math.sin((i / 12) * Math.PI * 2) + Math.random() * 20),
  pm25: Math.round(35 + 20 * Math.sin((i / 12) * Math.PI * 2) + Math.random() * 10),
}));

export const energyData = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => ({
  month,
  residential: Math.round(1200 + 400 * Math.sin(((i + 3) / 12) * Math.PI * 2) + Math.random() * 100),
  commercial: Math.round(1800 + 300 * Math.sin(((i + 3) / 12) * Math.PI * 2) + Math.random() * 150),
  industrial: Math.round(2500 + 200 * Math.sin(((i + 3) / 12) * Math.PI * 2) + Math.random() * 200),
}));

export const dailyEnergy = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  consumption: Math.round(
    500 + 300 * Math.exp(-((i - 14) ** 2) / 12) + 200 * Math.exp(-((i - 20) ** 2) / 8) + Math.random() * 50
  ),
  solar: Math.round(Math.max(0, 200 * Math.exp(-((i - 12) ** 2) / 8)) + Math.random() * 20),
}));

export const wasteBins = [
  { id: 'BIN-001', area: 'Meenakshi Temple Zone', fill: 85, type: 'Mixed', lat: 9.9195, lng: 78.1193, lastCollected: '2h ago' },
  { id: 'BIN-002', area: 'Periyar Bus Stand', fill: 92, type: 'Organic', lat: 9.9220, lng: 78.1240, lastCollected: '4h ago' },
  { id: 'BIN-003', area: 'Goripalayam', fill: 45, type: 'Recyclable', lat: 9.9280, lng: 78.1180, lastCollected: '1h ago' },
  { id: 'BIN-004', area: 'Anna Nagar', fill: 30, type: 'Mixed', lat: 9.9150, lng: 78.1050, lastCollected: '30m ago' },
  { id: 'BIN-005', area: 'KK Nagar', fill: 67, type: 'Organic', lat: 9.9100, lng: 78.0950, lastCollected: '3h ago' },
  { id: 'BIN-006', area: 'Mattuthavani', fill: 98, type: 'Mixed', lat: 9.9350, lng: 78.1350, lastCollected: '6h ago' },
  { id: 'BIN-007', area: 'Thirunagar', fill: 55, type: 'Recyclable', lat: 9.9050, lng: 78.1100, lastCollected: '2h ago' },
  { id: 'BIN-008', area: 'Vilangudi', fill: 20, type: 'Organic', lat: 9.9400, lng: 78.1000, lastCollected: '1h ago' },
];

export const cleanlinessScores = [
  { area: 'Anna Nagar', score: 92 },
  { area: 'Vilangudi', score: 88 },
  { area: 'KK Nagar', score: 85 },
  { area: 'Thirunagar', score: 78 },
  { area: 'Goripalayam', score: 72 },
  { area: 'Meenakshi Temple Zone', score: 68 },
  { area: 'Periyar Bus Stand', score: 55 },
  { area: 'Mattuthavani', score: 48 },
];

export const predictionData = {
  traffic: Array.from({ length: 7 }, (_, i) => ({
    day: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][i],
    predicted: Math.round(14000 + Math.random() * 4000),
    confidence: +(0.85 + Math.random() * 0.1).toFixed(2),
  })),
  pollution: Array.from({ length: 7 }, (_, i) => ({
    day: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][i],
    predictedAqi: Math.round(80 + Math.random() * 60),
    confidence: +(0.82 + Math.random() * 0.12).toFixed(2),
  })),
  energy: Array.from({ length: 7 }, (_, i) => ({
    day: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][i],
    predictedMWh: Math.round(4500 + Math.random() * 1500),
    confidence: +(0.88 + Math.random() * 0.08).toFixed(2),
  })),
};

export function getAqiLevel(aqi: number) {
  if (aqi <= 50) return { label: 'Good', color: 'neon-text-green' };
  if (aqi <= 100) return { label: 'Moderate', color: 'neon-text-blue' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'neon-text-orange' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'neon-text-red' };
  return { label: 'Hazardous', color: 'neon-text-red' };
}

export function getBinStatus(fill: number) {
  if (fill >= 90) return { label: 'Critical', colorClass: 'neon-text-red' };
  if (fill >= 70) return { label: 'High', colorClass: 'neon-text-orange' };
  if (fill >= 40) return { label: 'Medium', colorClass: 'neon-text-blue' };
  return { label: 'Low', colorClass: 'neon-text-green' };
}
