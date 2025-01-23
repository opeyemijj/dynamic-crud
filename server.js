const express = require('express');
const bodyParser = require('body-parser');
const dynamicRoutes = require('./src/routes/dynamic.routes');
const initDB = require('./src/initDatabase');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use('/favicon.ico', (req, res) => res.status(204).end());


app.use('/', dynamicRoutes);

const PORT = process.env.PORT || 3000;

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
