'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AQICard from '@/components/AQICard';
import RealtimeChart from '@/components/RealtimeChart';
import { AirQualityData } from '@/types/aqi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [currentData, setCurrentData] = useState<AirQualityData | null>(null);
  const [chartData, setChartData] = useState<{time: string, co2: number, aqi: number}[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/air-quality');
      const data = await response.json();
      
      setCurrentData(data.current);
      setChartData(data.history);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} lastUpdate={lastUpdate} />
      
      <main className="container mx-auto px-4 py-8">
        {/* অ্যালার্ট */}
        {currentData && currentData.aqi > 150 && (
          <Alert variant="destructive" className="mb-6">
            <Bell className="h-4 w-4" />
            <AlertTitle>⚠️ Air Quality Alert!</AlertTitle>
            <AlertDescription>
              Air quality is hazardous! Current AQI: {currentData.aqi}. 
              Please stay indoors and close windows.
            </AlertDescription>
          </Alert>
        )}
        
        {/* গ্রিড লেআউট */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            {currentData && <AQICard data={currentData} />}
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">💡 Health Tip</h3>
                <p className="text-sm opacity-90">
                  Monitor air quality before outdoor activities. Use masks if AQI is moderate or above.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">🌿 Indoor Air Quality</h3>
                <p className="text-sm opacity-90">
                  Houseplants like Snake Plant and Peace Lily help purify indoor air naturally.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* চার্ট */}
        <RealtimeChart data={chartData} />
      </main>
    </div>
  );
}