const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');

require('dotenv').config();

// Initialize database connection once per cold start
connectDB();

// Create and configure the Express application
const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  // Routes mounted under /api so URLs are /api/<router>
  app.use('/api', require('./routes'));

  // Centralized error handler to avoid unhandled exceptions causing 500 without logs
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const statusCode = err && err.status ? err.status : 500;
    res.status(statusCode).json({
      success: false,
      message: err && err.message ? err.message : 'Internal Server Error'
    });
  });

  return app;
};

module.exports = createApp;


