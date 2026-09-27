import mongoose from 'mongoose';
import User from './models/User.js';

async function reset() {
  await mongoose.connect('mongodb://localhost:27017/peoplefirst');

  // Delete existing test users and recreate fresh
  await User.deleteMany({ email: { $in: ['admin@peoplefirst.lk', 'user@peoplefirst.lk'] } });

  // Ensure all existing users in db are emailVerified: true
  await User.updateMany({}, { emailVerified: true, status: 'active' });

  const admin = await User.create({
    name: 'PeopleFirst Admin',
    email: 'admin@peoplefirst.lk',
    password: 'admin@2026',
    whatsapp: '+94771234567',
    district: 'Colombo',
    address: 'PeopleFirst HQ, Colombo 03',
    role: 'admin',
    emailVerified: true,
    status: 'active',
  });

  const user = await User.create({
    name: 'Kasun Perera',
    email: 'user@peoplefirst.lk',
    password: 'user@2026',
    whatsapp: '+94719876543',
    district: 'Kandy',
    address: 'No. 45, Peradeniya Road, Kandy',
    role: 'reader',
    emailVerified: true,
    status: 'active',
  });

  console.log('✅ Created fresh admin:', admin.email, 'role:', admin.role);
  console.log('✅ Created fresh user:', user.email, 'role:', user.role);

  // Test password matching
  const testAdmin = await User.findOne({ email: 'admin@peoplefirst.lk' }).select('+password');
  const matchAdmin = await testAdmin.matchPassword('admin@2026');
  console.log('✅ Admin password match test (admin@2026):', matchAdmin);

  const testUser = await User.findOne({ email: 'user@peoplefirst.lk' }).select('+password');
  const matchUser = await testUser.matchPassword('user@2026');
  console.log('✅ User password match test (user@2026):', matchUser);

  process.exit(0);
}

reset();
