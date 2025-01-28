const { db } = require('../config/database');  // Ensure correct import

const processTimestamps = (model, data) => {
    Object.keys(model.fields).forEach((field) => {
      if (model.fields[field].type === 'timestamp' && data[field]) {
        data[field] = new Date(data[field]).toISOString().slice(0, 19).replace('T', ' ');
      }
    });
    return data;
};

const applyTransformations = (model, data) => {
  Object.keys(model.fields).forEach(field => {
    if (model.fields[field].transform && data[field]) {
      switch (model.fields[field].transform) {
        case 'uppercase':
          data[field] = data[field].toUpperCase();
          break;
        case 'lowercase':
          data[field] = data[field].toLowerCase();
          break;
        case 'capitalize':
          data[field] = data[field].replace(/\b\w/g, char => char.toUpperCase());
          break;
        case 'titlecase':
          data[field] = data[field].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          break;
        case 'trim':
          data[field] = data[field].trim();
          break;
        case 'money':
          data[field] = parseFloat(data[field]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          break;
        case 'comma':
          data[field] = parseFloat(data[field]).toLocaleString();
          break;
        case 'percentage':
          data[field] = `${(parseFloat(data[field]) * 100).toFixed(2)}%`;
          break;
        case 'mask':
          data[field] = `**** **** **** ${data[field].slice(-4)}`;
          break;
        case 'datetime':
          let format = model.fields[field].transform.format || 'YYYY-MM-DD HH:mm';
          let timezone = model.fields[field].transform.timezone || 'UTC';
          data[field] = new Date(data[field]).toLocaleString('en-US', { timeZone: timezone });
          break;
      }
    }
  });
  return data;
};



// Function to fetch related data for dropdown fields
const getRelatedData = async (model) => {
  const relatedData = {};
  for (let field in model.fields) {
    if (model.fields[field].relation) {
      const relation = model.fields[field].relation;
      try {
        // Ensure `relation.display` is processed to include all fields dynamically
        const displayFields = relation.display.split(',').map(field => field.trim()); // Split and trim fields
        const allFields = [relation.field, ...displayFields].join(', '); // Combine with relation.field

        const query = `SELECT ${allFields} FROM ${relation.model}`;
        const [rows] = await db.query(query);
        relatedData[field] = rows;
      } catch (error) {
        console.error(`Error fetching related data for ${field} from ${relation.model}:`, error);
        relatedData[field] = [];
      }
    }
  }
  return relatedData;
};

const getAll = async (model, search = '', sortField = 'id', sortOrder = 'asc', limit = 10, offset = 0) => {
  let query = `SELECT ${Object.keys(model.fields).join(', ')} FROM ${model.tableName}`;
  let queryParams = [];

  if (search) {
    const searchFields = Object.keys(model.fields)
      .map(field => `${field} LIKE ?`)
      .join(' OR ');
    query += ` WHERE ${searchFields}`;
    queryParams = Object.keys(model.fields).map(() => `%${search}%`);
  }

  query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  const [rows] = await db.query(query, queryParams);
  const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM ${model.tableName}`);

  return { data: rows, total };
};

const getById = async (model, id) => {
  const [rows] = await db.query(`SELECT * FROM ${model.tableName} WHERE id = ?`, [id]);
  return rows[0];
};

const create = async (model, data) => {
  data = processTimestamps(model, data);
  await db.query(`INSERT INTO ${model.tableName} SET ?`, data);
};

const update = async (model, id, data) => {
   data = processTimestamps(model, data);
  await db.query(`UPDATE ${model.tableName} SET ? WHERE id = ?`, [data, id]);
};

const remove = async (model, id) => {
  await db.query(`DELETE FROM ${model.tableName} WHERE id = ?`, [id]);
};

module.exports = { getAll, getById, create, update, remove, getRelatedData };
