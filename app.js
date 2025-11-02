const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const loginRoutes = require('./routes/loginRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./service/swagger');

app.use(cors());
app.use(bodyParser.json());

app.use('/api', loginRoutes);
app.use('/api', clientRoutes);
app.use('/api', projectRoutes);
app.use('/api', userRoutes);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  module.exports = app;
});
