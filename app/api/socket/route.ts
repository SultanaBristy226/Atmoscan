import { NextResponse, NextRequest } from 'next/server';

// ============================================
// In-Memory Storage
// ============================================
interface SensorData {
  aqi: number;
  co2: number;
  co: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}
let currentData: SensorData = {
  aqi: 0,
  co2: 0,
  co: 0,
  temperature: 0,
  humidity: 0,
  timestamp: new Date().toISOString()
};

let historyData: any[] = [];
let isConnected = false;
let lastESP32Data: string = '';

// ============================================
// GET: Fetch latest data for dashboard
// ============================================
export async function GET() {
  // Add current data to history (keep last 24 readings)
  if (currentData.aqi > 0) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    historyData.push({ 
      time: timeStr, 
      aqi: currentData.aqi,
      co2: currentData.co2,
      co: currentData.co,
      temperature: currentData.temperature,
      humidity: currentData.humidity
    });
    if (historyData.length > 24) {
      historyData = historyData.slice(-24);
    }
  }

  // Purifier status based on AQI
  const purifier = {
    isOn: currentData.aqi > 50,
    fanSpeed: Math.min(100, Math.max(0, (currentData.aqi - 50) * 1.8)),
    mode: 'AUTO',
    filterLife: 85,
    esp32Connected: isConnected,
    lastDataReceived: lastESP32Data
  };

  // Alert based on AQI
  let alert = null;
  if (currentData.aqi > 150) {
    alert = { type: 'danger', title: '🚨 Hazardous Air Quality!', message: 'Stay indoors! Run purifier at max speed.' };
  } else if (currentData.aqi > 100) {
    alert = { type: 'warning', title: '⚠️ Unhealthy Air Quality', message: 'Wear mask when going outside.' };
  } else if (currentData.aqi > 50) {
    alert = { type: 'info', title: 'ℹ️ Moderate Air Quality', message: 'Sensitive individuals should limit outdoor time.' };
  }

  return NextResponse.json({
    success: true,
    data: {
      current: currentData,
      history: historyData,
      purifier: purifier,
      alert: alert,
      esp32Connected: isConnected
    }
  });
}

// ============================================
// POST: Receive data from ESP32
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate incoming data
    const requiredFields = ['aqi', 'co2', 'co', 'temperature', 'humidity'];
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Update current data
    currentData = {
      aqi: body.aqi,
      co2: body.co2,
      co: body.co,
      temperature: body.temperature,
      humidity: body.humidity,
      timestamp: new Date().toISOString()
    };

    // Update connection status
    isConnected = true;
    lastESP32Data = new Date().toLocaleTimeString();

    // Add to history
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    historyData.push({
      time: timeStr,
      aqi: currentData.aqi,
      co2: currentData.co2,
      co: currentData.co,
      temperature: currentData.temperature,
      humidity: currentData.humidity
    });
    if (historyData.length > 24) {
      historyData = historyData.slice(-24);
    }

    console.log('📊 ESP32 Data Received:', currentData);

    return NextResponse.json({
      success: true,
      message: 'Data received from ESP32',
      data: currentData
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid data format' },
      { status: 400 }
    );
  }
}