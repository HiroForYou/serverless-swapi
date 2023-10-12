// swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Serverless Swapi',
      version: '1.0.0',
      description: 'Documentación de mi API',
    },
  },
  apis: ['./routes/*.ts'], // Reemplaza por la ubicación real de tus controladores
};

export const swaggerSpec = swaggerJSDoc(options);