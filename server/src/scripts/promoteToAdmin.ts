import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const promoteToAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-alert';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2] || 'admin@floodalert.com';

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email "${email}" not found!`);
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`⚠️  User "${email}" is already an admin!`);
      process.exit(0);
    }

    // Promote to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ User promoted to admin successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ User now has admin privileges!');
    console.log('⚠️  Please logout and login again to see admin features.');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error promoting user:', error.message);
    process.exit(1);
  }
};

promoteToAdmin();
