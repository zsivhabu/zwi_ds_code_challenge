const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = require('./swaggerDefinition');

const options = {
    swaggerDefinition,
    apis: ['services/apiService.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
