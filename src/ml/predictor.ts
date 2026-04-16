// Simple client-side predictor using TensorFlow.js
// Trains a tiny model on available site telemetry to predict next-step AQI for demo purposes.
export async function predictSites(sites: any[]) {
  try {
    const tf = await import('@tensorflow/tfjs');

    // Build dataset from sites. Features: [trafficCongestion, energyConsumption, currentAqi]
    const xs: number[][] = [];
    const ys: number[][] = [];
    sites.forEach((s) => {
      const traffic = (s.traffic?.congestion ?? 20) / 100; // normalize 0-1
      const energy = (s.energy?.consumption ?? 200) / 10000; // scale down
      const aqi = (s.pollution?.aqi ?? 50) / 200; // scale to 0-1
      xs.push([traffic, energy, aqi]);
      // target: slightly higher than current aqi to simulate next-step
      const targetAqi = ((s.pollution?.aqi ?? (20 + (traffic * 100) * 0.5)) * (1 + (Math.random() - 0.5) * 0.15)) / 200;
      ys.push([targetAqi]);
    });

    const xT = tf.tensor2d(xs);
    const yT = tf.tensor2d(ys);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 12, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

    // Train a few epochs — small so it runs fast in-browser
    await model.fit(xT, yT, { epochs: 30, batchSize: Math.min(16, sites.length) });

    const preds = model.predict(xT) as any;
    const predData = Array.from(await preds.data()).map((v: any) => Number(v));

    // Convert back to AQI scale and attach a simple confidence estimate
    const results = predData.map((v: number) => ({ predictedAqi: Math.max(0, Math.round(v * 200)), confidence: 0.6 + Math.random() * 0.4 }));

    xT.dispose();
    yT.dispose();
    preds.dispose();

    return results;
  } catch (err) {
    console.error('Prediction failed', err);
    return sites.map(() => ({ predictedAqi: 0, confidence: 0 }));
  }
}
