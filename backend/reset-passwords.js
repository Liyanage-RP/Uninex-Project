const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    await mongoose.connection.collection('users').updateMany({}, { $set: { password: hashedPassword } });
    console.log('Passwords updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

reset();
