import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Schema
const SensorSchema = new mongoose.Schema({
  aqi: Number,
  co2: Number,
  co: Number,
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

const Sensor = mongoose.models.Sensor || mongoose.model('Sensor', SensorSchema);

// GET — Dashboard data 
export async function GET() {
  try {
    await connectDB();

    const latest = await Sensor.findOne().sort({ timestamp: -1 });

    const history = await Sensor.find()
      .sort({ timestamp: -1 })
      .limit(24)
      .lean();

    const historyFormatted = history.reverse().map((d: any) => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      aqi: d.aqi,
      co2: d.co2,
      co: d.co,
    }));

    if (!latest) {
      const mockHistory = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        aqi: 35 + Math.random() * 80,
        co2: 380 + Math.random() * 150,
        co: 1.5 + Math.random() * 4,
      }));

      return NextResponse.json({
        current: { aqi: 42, co2: 415, co: 2.3, temperature: 22, humidity: 55 },
        history: mockHistory,
      });
    }

    return NextResponse.json({
      current: {
        aqi: latest.aqi,
        co2: latest.co2,
        co: latest.co,
        temperature: latest.temperature,
        humidity: latest.humidity,
      },
      history: historyFormatted,
    });

  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST — ESP32 data data flow
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { aqi, co2, co, temperature, humidity } = body;

    const sensor = new Sensor({ aqi, co2, co, temperature, humidity });
    await sensor.save();

    return NextResponse.json({ success: true, message: 'Data saved' });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}