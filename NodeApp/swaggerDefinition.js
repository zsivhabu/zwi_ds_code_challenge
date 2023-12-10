require('dotenv').config()

console.log(process.env.API_BASE_UR)

const swaggerDefinition = {
    info: {
        title: 'Service Request API Server',
        version: '1.0.0',
        description: 'API server for the Service Request application',
    },
    host: process.env.API_BASE_URL,
    basePath: '/',
};

module.exports = swaggerDefinition;
