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

  return app;
};

module.exports = createApp;


