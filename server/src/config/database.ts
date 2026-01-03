import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️  MongoDB URI not configured. Running without database.');
      console.warn('   Add MONGODB_URI to server/.env to enable database features.');
      return;
    }

    // Set mongoose settings - only disable buffering after connection is established
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    });
    
    // Now that we're connected, we can safely disable buffering
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 30000);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will run without database. Some features may be limited.');
    console.warn('   Please check your MongoDB URI and network connection.');
    
    // Check if it's an IP whitelist issue
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.warn('\n📝 Action Required: Add your IP to MongoDB Atlas');
      console.warn('   1. Visit https://cloud.mongodb.com/');
      console.warn('   2. Go to Network Access');
      console.warn('   3. Click "Add IP Address"');
      console.warn('   4. Add your current IP or use 0.0.0.0/0 for development\n');
    }
    
    // Don't throw - let server start without database
  }
};
