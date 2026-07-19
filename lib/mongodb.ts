export async function connectToDatabase() {
  if (cached.conn) {
    console.log('✅ Using cached DB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📡 URI:', MONGODB_URI.replace(/\/\/.*@/, '//<hidden>@')); // Hide password
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully!');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}