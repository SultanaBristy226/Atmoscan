'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AirQualityData {
  id: string;
  co2: number;
  co: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  aqi: number;
}

interface AQICardProps {
  data: AirQualityData;
}

const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
};

const getAQIColor = (level: string): string => {
  switch(level) {
    case 'good': return '#4CAF50';
    case 'moderate': return '#FFC107';
    case 'unhealthy': return '#FF9800';
    case 'hazardous': return '#f44336';
    default: return '#4CAF50';
  }
};

export default function AQICard({ data }: AQICardProps) {
  const level = getAQILevel(data.aqi);
  const color = getAQIColor(level);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Air Quality Index
          <Badge style={{ backgroundColor: color }} className="text-white">
            {level.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-6xl font-bold" style={{ color }}>
            {data.aqi}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Current AQI</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">CO₂</p>
            <p className="text-lg font-semibold">{Math.round(data.co2)} ppm</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CO</p>
            <p className="text-lg font-semibold">{Math.round(data.co)} ppm</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Temp</p>
            <p className="text-lg font-semibold">{data.temperature}°C</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-lg font-semibold">{data.humidity}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}