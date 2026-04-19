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

interface RealtimeChartProps {
  data: { time: string; co2: number; aqi: number }[];
}

export default function RealtimeChart({ data }: RealtimeChartProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6">
      <h3 className="text-white font-semibold mb-4">24-Hour Air Quality Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend wrapperStyle={{ color: '#f3f4f6' }} />
          <Line yAxisId="left" type="monotone" dataKey="co2" stroke="#8b5cf6" strokeWidth={2} dot={false} name="CO₂" />
          <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={2} dot={false} name="AQI" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}