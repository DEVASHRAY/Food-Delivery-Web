// src/lib/db.ts
import mongoose from 'mongoose';

const connectMongoDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_DB_CONNECTION_STRING) {
      throw new Error('MONGO_DB_CONNECTION_STRING is not defined in env');
    }

    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected to MongoDB');
  } catch (err: unknown) {
    // Narrow error type safely
    if (err instanceof Error) {
      console.error('❌ Failed to connect to MongoDB:', err.message);
    } else {
      console.error('❌ Failed to connect to MongoDB:', err);
    }
    process.exit(1); // force exit if DB is critical
  }
};

export default connectMongoDB;
