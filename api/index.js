const createApp = require('../src/createApp');

// Reuse the same app instance across invocations
let app;
module.exports = (req, res) => {
  if (!app) {
    app = createApp();
  }
  return app(req, res);
};


