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

  // Routes (mounted at root so Vercel's /api prefix works without doubling)
  app.use('/', require('./routes'));

  return app;
};

module.exports = createApp;


