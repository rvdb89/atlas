export function getTemperatureFactor(roomTemperature: number) {
    if (roomTemperature <= 18) return 1.35;
    if (roomTemperature <= 20) return 1.15;
    if (roomTemperature <= 22) return 1.0;
    if (roomTemperature <= 24) return 0.85;
    if (roomTemperature <= 26) return 0.7;
  
    return 0.6;
  }
  
  export function calculateBulkHours(
    baseBulkHours: number,
    roomTemperature: number,
    recipeFactor: number
  ) {
    const temperatureFactor = getTemperatureFactor(roomTemperature);
  
    return Math.round(baseBulkHours * temperatureFactor * recipeFactor * 10) / 10;
  }