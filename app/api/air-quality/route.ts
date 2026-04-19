import { NextResponse } from 'next/server';

// সিমুলেটেড রিয়েল-টাইম ডেটা জেনারেটর
let lastValue = 75;

export async function GET() {
  // রিয়েলিস্টিক AQI জেনারেট করো (50-150 এর মধ্যে)
  const change = (Math.random() - 0.5) * 10;
  let newAQI = lastValue + change;
  newAQI = Math.min(Math.max(newAQI, 35), 180);
  lastValue = newAQI;
  
  const currentData = {
    id: Date.now().toString(),
    co2: Math.floor(380 + Math.random() * 120),  // 380-500 ppm
    co: Math.floor(8 + Math.random() * 25),       // 8-33 ppm
    temperature: Math.floor(20 + Math.random() * 10), // 20-30°C
    humidity: Math.floor(45 + Math.random() * 30),    // 45-75%
    timestamp: new Date(),
    aqi: Math.floor(newAQI)
  };
  
  // চার্টের জন্য ইতিহাস ডেটা (শেষ 24 ঘন্টা)
  const history = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    history.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      co2: 380 + Math.sin(i * 0.3) * 60 + Math.random() * 30,
      aqi: 50 + Math.sin(i * 0.3) * 40 + Math.random() * 20
    });
  }
  
  return NextResponse.json({
    current: currentData,
    history: history
  });
}