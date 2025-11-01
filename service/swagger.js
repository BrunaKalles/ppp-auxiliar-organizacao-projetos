const swaggerUi = require('swagger-ui-express');
const path = require('path');
const swaggerDocument = require(path.join(__dirname, '../resources/swagger.json'));

module.exports = function(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
