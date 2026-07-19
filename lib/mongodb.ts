import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// Define cached variable
let cached: any = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('✅ Using cached DB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully!');
      return mongoose;
    }).catch((err: Error) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}