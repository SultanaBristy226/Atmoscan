export interface AirQualityData {
  id?: string;
  co2: number;
  co: number;
  pm25?: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  aqi: number;
  level?: AQILevel;
  advice?: string;
}

export type AQILevel = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

export interface PurifierStatus {
  isOn: boolean;
  fanSpeed: number;
  mode: 'AUTO' | 'MANUAL' | 'OFF';
  filterLife: number;
}

export interface AlertMessage {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

export interface DashboardData {
  current: AirQualityData;
  purifier: PurifierStatus;
  alert: AlertMessage | null;
  history: AirQualityData[];
}

export const calculateAQI = (co2: number, co: number): number => {
  let aqi = (co2 / 1000) * 50 + (co / 10) * 50;
  return Math.min(Math.round(aqi), 500);
};

export const getAQILevel = (aqi: number): AQILevel => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
};

export const getAQIColor = (level: AQILevel): string => {
  switch (level) {
    case 'good': return '#4CAF50';
    case 'moderate': return '#FFC107';
    case 'unhealthy': return '#FF9800';
    case 'hazardous': return '#f44336';
  }
};

export const getAdvice = (aqi: number): string => {
  if (aqi <= 50) return 'Air quality is good. Enjoy outdoor activities.';
  if (aqi <= 100) return 'Air quality is moderate. Sensitive groups should limit outdoor exposure.';
  if (aqi <= 150) return 'Air quality is unhealthy. Wear a mask outdoors.';
  return 'Air quality is hazardous. Stay indoors and use air purifier.';
};

export const getPurifierLogic = (aqi: number): { isOn: boolean; fanSpeed: number } => {
  if (aqi <= 50) return { isOn: false, fanSpeed: 0 };
  if (aqi <= 100) return { isOn: true, fanSpeed: 30 };
  if (aqi <= 150) return { isOn: true, fanSpeed: 60 };
  return { isOn: true, fanSpeed: 100 };
};

export const getAlertMessage = (aqi: number): AlertMessage | null => {
  if (aqi <= 50) return null;
  if (aqi <= 100) return {
    id: Date.now().toString(),
    type: 'warning',
    title: 'Moderate Air Quality',
    message: 'Air quality is moderate. Consider reducing outdoor activities.',
  };
  if (aqi <= 150) return {
    id: Date.now().toString(),
    type: 'danger',
    title: 'Unhealthy Air Quality',
    message: 'Air quality is unhealthy. Wear a mask and stay indoors.',
  };
  return {
    id: Date.now().toString(),
    type: 'danger',
    title: 'Hazardous Air Quality',
    message: 'Air quality is hazardous! Stay indoors immediately.',
  };
};