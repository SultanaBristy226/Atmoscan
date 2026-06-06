import { 
  AirQualityData, PurifierStatus, AlertMessage, DashboardData,
  calculateAQI, getAQILevel, getAdvice, getPurifierLogic, getAlertMessage
} from '@/types/aqi';

// ========== DATA STORAGE (In-Memory) ==========
let currentData: AirQualityData | null = null;
let historyData: AirQualityData[] = [];
let purifierStatus: PurifierStatus = {
  isOn: false,
  fanSpeed: 0,
  mode: 'AUTO',
  filterLife: 85
};
let lastAlert: AlertMessage | null = null;

// ========== SENSOR DATA COLLECTION (Mock Data - Real ESP32 data will come here) ==========
const generateSensorData = (): { co2: number; co: number; temperature: number; humidity: number } => {
  const hour = new Date().getHours();
  let co2Base = 400;
  let coBase = 10;
  
  // Peak hours (morning and evening rush)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    co2Base += 80;
    coBase += 15;
  }
  // Afternoon dip
  else if (hour >= 12 && hour <= 14) {
    co2Base += 30;
    coBase += 5;
  }
  
  return {
    co2: co2Base + Math.floor(Math.random() * 60),
    co: coBase + Math.floor(Math.random() * 15),
    temperature: 22 + Math.floor(Math.random() * 10),
    humidity: 45 + Math.floor(Math.random() * 30)
  };
};

// ========== AIR QUALITY ANALYSIS ==========
export const processSensorData = (): AirQualityData => {
  const sensorData = generateSensorData();
  const aqi = calculateAQI(sensorData.co2, sensorData.co);
  
  return {
    ...sensorData,
    aqi,
    level: getAQILevel(aqi),
    advice: getAdvice(aqi),
    timestamp: new Date()
  };
};

// ========== PURIFIER LOGIC ==========
export const updatePurifierLogic = (aqi: number): PurifierStatus => {
  const logic = getPurifierLogic(aqi);
  return {
    ...purifierStatus,
    isOn: logic.isOn,
    fanSpeed: logic.fanSpeed,
    mode: 'AUTO'
  };
};

// ========== ALERT GENERATION ==========
export const generateAlert = (aqi: number): AlertMessage | null => {
  return getAlertMessage(aqi);
};

// ========== GET COMPLETE DASHBOARD DATA ==========
export const getDashboardData = (): DashboardData => {
  const newData = processSensorData();
  currentData = newData;
  historyData = [newData, ...historyData].slice(0, 24);
  purifierStatus = updatePurifierLogic(newData.aqi);
  lastAlert = generateAlert(newData.aqi);
  
  return {
    current: currentData,
    purifier: purifierStatus,
    alert: lastAlert,
    history: historyData
  };
};

// ========== DATA STORAGE ==========
export const storeData = (data: AirQualityData): void => {
  console.log('Data stored:', data);
};

// ========== GET HISTORY DATA (for charts) ==========
export const getHistoryData = (): AirQualityData[] => {
  return historyData;
};

// ========== MANUAL PURIFIER CONTROL ==========
export const setPurifierMode = (mode: 'AUTO' | 'MANUAL' | 'OFF'): PurifierStatus => {
  purifierStatus = { ...purifierStatus, mode };
  return purifierStatus;
};

export const setFanSpeed = (speed: number): PurifierStatus => {
  if (speed >= 0 && speed <= 100) {
    purifierStatus = { ...purifierStatus, fanSpeed: speed, isOn: speed > 0, mode: 'MANUAL' };
  }
  return purifierStatus;
};