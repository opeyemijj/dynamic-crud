const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

const db = pool.promise();

/**
 * Checks if a table exists and creates it if it does not.
 * Automatically adds created_at and updated_at timestamps.
 * @param {Object} model - The model definition
 */
const initializeTable = async (model) => {
  const columns = [];
  
  Object.entries(model.fields).forEach(([field, properties]) => {
    let type;
    switch (properties.type) {
      case 'integer':
        type = 'INT';
        if (properties.autoIncrement) type += ' AUTO_INCREMENT';
        break;
      case 'string':
        type = `VARCHAR(${properties.maxLength || 255})`;
        break;
      case 'enum':
        type = `ENUM(${properties.values.map(v => `'${v}'`).join(', ')})`;
        break;
      case 'boolean':
        type = 'TINYINT(1)';
        break;
      case 'timestamp':
        type = 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
        break;
      default:
        type = 'TEXT';
    }

    let constraints = [];
    if (properties.primary) constraints.push('PRIMARY KEY');
    if (properties.unique) constraints.push('UNIQUE');
    if (properties.required) constraints.push('NOT NULL');

    columns.push(`\`${field}\` ${type} ${constraints.join(' ')}`);
  });

  // Add created_at and updated_at timestamps
  columns.push('`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  columns.push('`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS \`${model.tableName}\` (
      ${columns.join(', ')}
    )
  `;

  try {
    await db.query(createTableQuery);
    console.log(`Table '${model.tableName}' is ready with timestamps.`);
  } catch (error) {
    console.error(`Error creating table ${model.tableName}:`, error);
  }
};

module.exports = { db, initializeTable };
