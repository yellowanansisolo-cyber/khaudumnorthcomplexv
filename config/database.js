const mongoose = require('mongoose');

// We use an async function to leverage await for the connection
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from our environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If the connection is successful, log a confirmation message to the console
    console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during connection, log the error message
    console.error(`MongoDB connection error: ${error.message}`);
    
    // Exit the process with a failure code (1) since the app cannot run without the DB
    process.exit(1);
  }
};

// Export the connectDB function so it can be imported and used in server.js
module.exports = connectDB;