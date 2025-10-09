const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/pinoyaya';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    cachedConnection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Do not exit the process in serverless; rethrow instead
    throw err;
  }
};

module.exports = connectDB; 