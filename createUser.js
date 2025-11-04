// createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

const createMasterUser = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in your .env file.');
        process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('DB connected');

    // Define the master admin's details
    const masterAdminUsername = 'masteradmin';
    const masterAdminPassword = 'MasterPassword123!'; // CHOOSE A VERY STRONG PASSWORD

    // Remove any existing user with the master username to avoid conflicts
    await User.deleteOne({ username: masterAdminUsername });

    // Create the protected master user
    await User.create({
        username: masterAdminUsername,
        password: masterAdminPassword,

        role: 'Technical Manager',
        isProtected: true // This is the crucial flag
    });

    console.log('--- Master Admin User ---');
    console.log(`Username: ${masterAdminUsername}`);
    console.log(`Password: ${masterAdminPassword}`);
    console.log('Master admin user has been created successfully!');
    console.log('This user cannot be deleted from the admin panel.');
    
    mongoose.connection.close();
};

createMasterUser().catch(err => {
    console.error('Failed to create master user:', err);
    mongoose.connection.close();
});