const { db } = require('../config/database');  // Ensure correct import

const processTimestamps = (model, data) => {
    Object.keys(model.fields).forEach((field) => {
      if (model.fields[field].type === 'timestamp' && data[field]) {
        data[field] = new Date(data[field]).toISOString().slice(0, 19).replace('T', ' ');
      }
    });
    return data;
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

module.exports = { getAll, getById, create, update, remove };
