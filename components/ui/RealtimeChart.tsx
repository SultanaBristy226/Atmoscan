'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartDataPoint {
  time: string;
  co2: number;
  aqi: number;
}

interface RealtimeChartProps {
  data: ChartDataPoint[];
}

export default function RealtimeChart({ data }: RealtimeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Air Quality Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" angle={-45} textAnchor="end" height={60} />
            <YAxis yAxisId="left" label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'AQI', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="co2" stroke="#FF6B6B" strokeWidth={2} name="CO₂" />
            <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#4ECDC4" strokeWidth={2} name="AQI" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}