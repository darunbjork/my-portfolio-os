require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); 

const promoteUserToOwner = async (email) => {
  if (!email) {
    console.error('Usage: node promote_to_owner.js <user_email>');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for promotion script.');

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'owner' },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted user ${user.email} to role: ${user.role}`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (err) {
    console.error('Error promoting user:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

const userEmail = process.argv[2];
promoteUserToOwner(userEmail);
