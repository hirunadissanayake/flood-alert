import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-alert';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@floodalert.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Run "npm run create-admin" first to create the admin user.');
      process.exit(1);
    }

    // Update password (will be hashed by pre-save hook)
    admin.password = 'admin123456';
    await admin.save();

    console.log('✅ Admin password reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@floodalert.com');
    console.log('🔑 Password: admin123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after login!');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
