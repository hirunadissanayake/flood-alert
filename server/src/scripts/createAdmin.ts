import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-alert';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@floodalert.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@floodalert.com');
      console.log('You may need to reset the password manually.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@floodalert.com',
      password: 'admin123456', // This will be hashed by the pre-save hook
      role: 'admin',
      phoneNumber: '+94771234567',
      location: {
        lat: 6.9271,
        lng: 79.8612,
        address: 'Colombo, Sri Lanka'
      },
      isSafe: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@floodalert.com');
    console.log('🔑 Password: admin123456');
    console.log('👤 Name: System Administrator');
    console.log('📞 Phone: +94771234567');
    console.log('📍 Location: Colombo, Sri Lanka');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
