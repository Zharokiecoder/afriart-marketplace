const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@afriart.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists! Updating to admin role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin role updated!');
    } else {
      // Create new admin
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@afriart.com',
        password: '123456',
        role: 'admin'
      });
      console.log('✅ Admin created successfully!');
      console.log('📧 Email: admin@afriart.com');
      console.log('🔒 Password: 123456');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();