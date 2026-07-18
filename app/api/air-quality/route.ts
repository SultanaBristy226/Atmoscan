import { NextRequest, NextResponse } from 'next/server';
import { 
  getDashboardData, 
  storeData, 
  setPurifierMode, 
  setFanSpeed 
} from '@/lib/data';
import { AirQualityData } from '@/types/aqi';

// ========== GET: Fetch all dashboard data ==========
export async function GET() {
  try {
    const dashboardData = getDashboardData();
    return NextResponse.json({ 
      success: true, 
      data: dashboardData 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// ========== POST: Receive sensor data from ESP32 ==========
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate incoming sensor data
    const sensorData: AirQualityData = {
      co2: body.co2,
      co: body.co,
      temperature: body.temperature,
      humidity: body.humidity,
      aqi: body.aqi,
      level: body.level,
      advice: body.advice,
      timestamp: new Date(body.timestamp)
    };
    
    // Store data
    storeData(sensorData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sensor data received successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid data format' },
      { status: 400 }
    );
  }
}

// ========== PUT: Control purifier manually ==========
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let purifier;
    
    if (body.mode) {
      purifier = setPurifierMode(body.mode);
    } else if (body.fanSpeed !== undefined) {
      purifier = setFanSpeed(body.fanSpeed);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid control command' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, data: purifier });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to control purifier' },
      { status: 500 }
    );
  }
}