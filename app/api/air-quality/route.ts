import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AirQuality from '@/models/AirQuality';
import { calculateAQI, getAQILevel, getAdvice } from '@/types/aqi';

let lastData: any = null;

// ========== GET: Fetch latest data ==========
export async function GET() {
  try {
    await connectToDatabase();
    
    // Get last 24 readings
    const history = await AirQuality.find()
      .sort({ timestamp: -1 })
      .limit(24)
      .lean();

    // Get latest reading
    const latest = await AirQuality.findOne()
      .sort({ timestamp: -1 })
      .lean();

    const current = latest ? {
      aqi: latest.aqi,
      co2: latest.co2,
      co: latest.co,
      temperature: latest.temperature,
      humidity: latest.humidity,
      level: latest.level,
      advice: latest.advice,
      timestamp: latest.timestamp
    } : lastData;

    const purifier = {
      isOn: current?.aqi > 50 || false,
      fanSpeed: Math.min(100, Math.max(0, ((current?.aqi || 0) - 50) * 1.8)),
      mode: 'AUTO',
      filterLife: 85,
      esp32Connected: !!latest
    };

    const chartHistory = history.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aqi: item.aqi
    }));

    let alert = null;
    if (current?.aqi > 150) {
      alert = { type: 'danger', title: '🚨 Hazardous!', message: 'Stay indoors!' };
    } else if (current?.aqi > 100) {
      alert = { type: 'warning', title: '⚠️ Unhealthy', message: 'Wear mask!' };
    }

    return NextResponse.json({
      success: true,
      data: {
        current,
        history: chartHistory,
        purifier,
        alert,
        esp32Connected: !!latest
      }
    });

  } catch (error) {
    console.error('❌ DB Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database error'
    }, { status: 500 });
  }
}

// ========== POST: Save data from ESP32 ==========
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['aqi', 'co2', 'co', 'temperature', 'humidity'];
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { success: false, error: `Missing: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate if not provided
    const aqi = body.aqi || calculateAQI(body.co2, body.co);
    const level = body.level || getAQILevel(aqi);
    const advice = body.advice || getAdvice(aqi);

    // Save to database
    await connectToDatabase();
    const newData = await AirQuality.create({
      aqi,
      co2: body.co2,
      co: body.co,
      temperature: body.temperature,
      humidity: body.humidity,
      level,
      advice,
      timestamp: new Date(),
      deviceId: body.deviceId || 'esp32-01'
    });

    console.log('📊 Data saved to DB:', newData);
    lastData = newData;

    return NextResponse.json({
      success: true,
      message: 'Data saved to database',
      data: newData
    });

  } catch (error) {
    console.error('❌ DB Save Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}