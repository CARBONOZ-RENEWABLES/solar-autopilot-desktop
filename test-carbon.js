const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testCarbonIntensity() {
  try {
    console.log('Testing carbon intensity API...');
    
    // Read settings
    const settingsPath = path.join(__dirname, 'data', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    
    console.log('Settings:', {
      hasApiKey: !!settings.apiKey,
      apiKeyLength: settings.apiKey ? settings.apiKey.length : 0,
      selectedZone: settings.selectedZone
    });
    
    if (!settings.apiKey || !settings.selectedZone) {
      console.error('Missing API key or zone');
      return;
    }
    
    // Test API call
    const response = await axios.get('https://api.electricitymap.org/v3/carbon-intensity/latest', {
      params: { zone: settings.selectedZone },
      headers: { 'auth-token': settings.apiKey },
      timeout: 10000
    });
    
    console.log('API Response:', response.data);
    console.log('Carbon Intensity:', response.data.carbonIntensity, 'g/kWh');
    
    // Test with sample energy data
    const sampleGridEnergy = 10; // 10 kWh
    const sampleSolarEnergy = 25; // 25 kWh
    const carbonIntensity = response.data.carbonIntensity;
    
    const unavoidableEmissions = (sampleGridEnergy * carbonIntensity) / 1000;
    const avoidedEmissions = (sampleSolarEnergy * carbonIntensity) / 1000;
    
    console.log('\nSample Calculations:');
    console.log(`Grid Energy: ${sampleGridEnergy} kWh`);
    console.log(`Solar Energy: ${sampleSolarEnergy} kWh`);
    console.log(`Unavoidable Emissions: ${unavoidableEmissions.toFixed(3)} kg CO₂`);
    console.log(`Avoided Emissions: ${avoidedEmissions.toFixed(3)} kg CO₂`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testCarbonIntensity();