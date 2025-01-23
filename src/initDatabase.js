const fs = require('fs');
const path = require('path');
const { initializeTable } = require('./config/database');

const modelsPath = path.join(__dirname, 'models');

// Load all models dynamically and initialize tables
const initDB = async () => {
  const files = fs.readdirSync(modelsPath);
  for (const file of files) {
    if (file.endsWith('.model.js')) {
      const model = require(path.join(modelsPath, file));
      await initializeTable(model);
    }
  }
  console.log('Database initialization complete.');
};

module.exports = initDB;
