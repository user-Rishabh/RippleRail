interface PredictionResult {
  currentTrain: string;
  connectingTrain: string;
  station: string;
  predictedDelayMinutes: number;
  probabilityScore: number;
  riskLevel: "SAFE" | "MODERATE" | "HIGH";
}

export function predictDelay(
  currentTrain: string,
  connectingTrain: string,
  station: string
): PredictionResult {
  // Mock ML-based delay prediction
  // In a real app, this would call an external ML microservice or run an inference model.
  
  // Seed random generation somewhat based on train numbers
  const seed = (parseInt(currentTrain.replace(/\D/g, "") || "0") + parseInt(connectingTrain.replace(/\D/g, "") || "0")) % 100;
  
  // Generate a random delay between 0 and 180 minutes
  const baseDelay = Math.floor(Math.random() * 120);
  const weatherPenalty = Math.random() > 0.8 ? 45 : 0; // 20% chance of bad weather causing 45 min delay
  const congestionPenalty = (seed % 10) * 3; // up to 27 mins of congestion
  
  const predictedDelayMinutes = baseDelay + weatherPenalty + congestionPenalty;
  
  // Probability score based on a mock connection buffer of 120 minutes
  // If delay > 120, probability drops significantly
  const bufferMinutes = 120;
  let probabilityScore = 100;
  
  if (predictedDelayMinutes > bufferMinutes) {
    const diff = predictedDelayMinutes - bufferMinutes;
    probabilityScore = Math.max(0, 100 - (diff * 1.5));
  } else {
    probabilityScore = 100 - (predictedDelayMinutes / bufferMinutes) * 20; // At worst, 80% if just at buffer
  }

  // Cap probability
  probabilityScore = Math.min(100, Math.max(0, Math.round(probabilityScore)));

  let riskLevel: "SAFE" | "MODERATE" | "HIGH" = "SAFE";
  if (probabilityScore < 40) {
    riskLevel = "HIGH";
  } else if (probabilityScore < 75) {
    riskLevel = "MODERATE";
  }

  return {
    currentTrain,
    connectingTrain,
    station,
    predictedDelayMinutes,
    probabilityScore,
    riskLevel,
  };
}
