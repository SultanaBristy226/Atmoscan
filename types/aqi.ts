export interface AirQualityData {
  id: string;
  co2: number;
  co: number;
  pm25?: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  aqi: number;
}

export type AQILevel = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

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
  switch(level) {
    case 'good': return '#4CAF50';
    case 'moderate': return '#FFC107';
    case 'unhealthy': return '#FF9800';
    case 'hazardous': return '#f44336';
  }
};
export interface AirQualityData {
  id: string;
  co2: number;
  co: number;
  pm25?: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  aqi: number;
}

export type AQILevel = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

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
  switch(level) {
    case 'good': return '#4CAF50';
    case 'moderate': return '#FFC107';
    case 'unhealthy': return '#FF9800';
    case 'hazardous': return '#f44336';
  }
};

export interface PurifierStatus {
  isOn: boolean;
  fanSpeed: number;
  mode: string;
  filterLife: number;
}

export interface AlertMessage {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}