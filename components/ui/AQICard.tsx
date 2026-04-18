'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AirQualityData, getAQILevel, getAQIColor } from '@/types/aqi';

interface AQICardProps {
  data: AirQualityData;
}

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
            <p className="text-lg font-semibold">{data.co2} <span className="text-xs">ppm</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CO</p>
            <p className="text-lg font-semibold">{data.co} <span className="text-xs">ppm</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Temperature</p>
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