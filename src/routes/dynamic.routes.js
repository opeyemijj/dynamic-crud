const express = require('express');
const crudController = require('../controllers/crud.controller');
const router = express.Router();

const loadModel = (modelPath) => {
  try {
    return require(`../models/${modelPath}.model`);
  } catch (error) {
    console.error(`Model not found: ${modelPath}`);
    return null;
  }
};

// Route to render listing view
router.get('/:model', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  
  // Get query params
  const search = req.query.search || '';
  const sortField = req.query.sort || 'id';
  const sortOrder = req.query.order || 'asc';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { data, total } = await crudController.getAll(model, search, sortField, sortOrder, limit, offset);
  const relatedData = await crudController.getRelatedData(model);

  res.render('listing', { 
    title: `List of ${model.tableName}`, 
    model, 
    data, 
    total, 
    currentPage: page, 
    limit, 
    search, 
    sortField, 
    sortOrder, 
    relatedData
  });
});

// Route to render form for creating a new record
router.get('/:model/create', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  const relatedData = await crudController.getRelatedData(model);
  res.render('dynamic', { title: `Create ${model.tableName}`, model, record: {}, relatedData });
});

// Handle form submission for creating a new record
router.post('/:model/create', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  await crudController.create(model, req.body);
  res.redirect(`/${req.params.model}`);
});

// Route to delete a record
router.get('/:model/delete/:id', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  await crudController.remove(model, req.params.id);
  res.redirect(`/${req.params.model}`);
});

// Edit record route
router.get('/:model/edit/:id', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  
  const record = await crudController.getById(model, req.params.id);
  if (!record) {
    return res.status(404).send('Record not found');
  }
  const relatedData = await crudController.getRelatedData(model);
  res.render('dynamic', { title: `Edit ${model.tableName}`, model, record, relatedData });
});

// Handle form submission for updating a record
router.post('/:model/update/:id', async (req, res) => {
  const model = loadModel(req.params.model);
  if (!model) {
    return res.status(404).send('Model not found');
  }
  await crudController.update(model, req.params.id, req.body);
  res.redirect(`/${req.params.model}`);
});

module.exports = router;
