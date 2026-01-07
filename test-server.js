const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 6790;

app.use(cors());
app.use(express.json());

const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Carbon intensity endpoint
app.get('/api/carbon-intensity/:zone', async (req, res) => {
  try {
    const { zone } = req.params;
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
    
    console.log(`Fetching carbon intensity for zone: ${zone}`);
    console.log(`API key length: ${settings.apiKey ? settings.apiKey.length : 0}`);
    
    if (!settings.apiKey) {
      return res.json({ 
        success: false,
        error: 'API key not configured',
        data: [],
        carbonIntensity: 0
      });
    }
    
    const response = await axios.get('https://api.electricitymap.org/v3/carbon-intensity/latest', {
      params: { zone },
      headers: { 'auth-token': settings.apiKey },
      timeout: 10000
    });
    
    console.log(`Carbon intensity response: ${response.data.carbonIntensity} g/kWh`);
    
    res.json({ 
      success: true,
      data: response.data,
      carbonIntensity: response.data.carbonIntensity || 0
    });
  } catch (error) {
    console.error('Carbon intensity API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.json({ 
      success: false,
      error: error.response?.status === 401 ? 'Invalid API key' : 'API request failed',
      data: [],
      carbonIntensity: 0
    });
  }
});

// Results data endpoint with carbon intensity
app.get('/api/results/data', async (req, res) => {
  try {
    const period = req.query.period || 'today';
    console.log(`Fetching results data for period: ${period}`);
    
    // Generate sample data
    const sampleData = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch carbon intensity
    let carbonIntensity = 0;
    try {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
      if (settings.apiKey && settings.selectedZone) {
        console.log(`Fetching carbon intensity for zone: ${settings.selectedZone}`);
        const carbonResponse = await axios.get('https://api.electricitymap.org/v3/carbon-intensity/latest', {
          params: { zone: settings.selectedZone },
          headers: { 'auth-token': settings.apiKey },
          timeout: 10000
        });
        carbonIntensity = carbonResponse.data.carbonIntensity || 0;
        console.log(`Carbon intensity fetched: ${carbonIntensity} g/kWh`);
      }
    } catch (carbonError) {
      console.error('Carbon intensity fetch failed:', carbonError.message);
    }
    
    // Create sample data with real carbon intensity
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const gridEnergy = 5 + Math.random() * 10; // 5-15 kWh
      const solarEnergy = 15 + Math.random() * 20; // 15-35 kWh
      const loadEnergy = 20 + Math.random() * 15; // 20-35 kWh
      
      const totalEnergy = gridEnergy + solarEnergy;
      const selfSufficiencyScore = totalEnergy > 0 ? (solarEnergy / totalEnergy) * 100 : 0;
      
      sampleData.push({
        date: dateStr,
        gridEnergy: parseFloat(gridEnergy.toFixed(2)),
        solarEnergy: parseFloat(solarEnergy.toFixed(2)),
        loadEnergy: parseFloat(loadEnergy.toFixed(2)),
        selfSufficiencyScore: parseFloat(selfSufficiencyScore.toFixed(1)),
        unavoidableEmissions: parseFloat(((gridEnergy * carbonIntensity) / 1000).toFixed(3)),
        avoidedEmissions: parseFloat(((solarEnergy * carbonIntensity) / 1000).toFixed(3)),
        carbonIntensity: carbonIntensity
      });
    }
    
    console.log(`Generated ${sampleData.length} sample records with carbon intensity: ${carbonIntensity} g/kWh`);
    
    res.json({
      success: true,
      data: sampleData,
      period: period,
      count: sampleData.length,
      carbonIntensity: carbonIntensity
    });
  } catch (error) {
    console.error('Error fetching results data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch results data: ' + error.message,
      data: []
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`📊 Carbon intensity API test server ready`);
  console.log(`🌐 Test URL: http://localhost:${port}/api/carbon-intensity/DE`);
});