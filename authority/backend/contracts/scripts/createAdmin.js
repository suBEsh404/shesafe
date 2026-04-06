const connectDatabase = require('../src/config/db');
const User = require('../src/models/User');

async function createAdmin() {
  await connectDatabase();

  const email = 'admin@example.com';

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = 'admin';
    existingAdmin.role = 'admin';
    existingAdmin.password = 'pass123';
    await existingAdmin.save();

    console.log(`Updated admin user: ${email}`);
    return;
  }

  await User.create({
    name: 'admin',
    email,
    password: 'pass123',
    role: 'admin'
  });

  console.log(`Created admin user: ${email}`);
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  });
