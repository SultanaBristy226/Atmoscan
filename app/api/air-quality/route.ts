import { NextResponse } from 'next/server';

export async function GET() {
  // Generate realistic mock data
  const generateHistoryData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        time: `${i}:00`,
        aqi: 35 + Math.random() * 80,
        co2: 380 + Math.random() * 150,
        co: 1.5 + Math.random() * 4,
      });
    }
    return data;
  };

  const mockData = {
    current: {
      aqi: 42,
      co2: 415,
      co: 2.3,
      temperature: 22,
      humidity: 55,
    },
    history: generateHistoryData(),
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockData);
}