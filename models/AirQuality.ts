import mongoose, { Schema, Document } from 'mongoose';

export interface IAirQuality extends Document {
  aqi: number;
  co2: number;
  co: number;
  temperature: number;
  humidity: number;
  level: string;
  advice: string;
  timestamp: Date;
  deviceId: string;
}

const AirQualitySchema = new Schema<IAirQuality>({
  aqi: { type: Number, required: true },
  co2: { type: Number, required: true },
  co: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  level: { type: String, required: true },
  advice: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  deviceId: { type: String, default: 'esp32-01' }
});

export default mongoose.models.AirQuality || mongoose.model<IAirQuality>('AirQuality', AirQualitySchema);