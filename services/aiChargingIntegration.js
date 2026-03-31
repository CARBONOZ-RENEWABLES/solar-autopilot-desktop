// Use EXISTING WebSocket connection to send AI charging data
// This integrates with your existing MQTT WebSocket connection

function sendAiChargingUpdate(ws, userId, chargingEngine) {
  if (!ws || ws.readyState !== 1) return; // 1 = OPEN

  const chargingData = {
    type: 'ai-charging',
    userId: userId,
    status: chargingEngine.isCharging ? 'charging' : 'standby',
    mode: chargingEngine.mode, // 'solar', 'grid', 'hybrid', 'off-peak'
    batteryLevel: chargingEngine.currentSOC,
    targetSOC: chargingEngine.targetSOC,
    lastCommandTime: chargingEngine.lastCommandTime,
    lastCommandReason: chargingEngine.lastCommandReason
  };

  ws.send(JSON.stringify(chargingData));
}

// Example usage with existing WebSocket:
// const ws = new WebSocket('wss://broker.carbonoz.com:8000');
// setInterval(() => {
//   if (aiChargingEnabled) {
//     sendAiChargingUpdate(ws, userId, aiChargingEngine);
//   }
// }, 30000);

module.exports = { sendAiChargingUpdate };
