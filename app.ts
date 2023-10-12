// npx tsx app.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerConfig';
import apiController from './controllers/apiController';

const app = express();

// Agrega la documentación Swagger a tu API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Monta el controlador API en la aplicación
//app.use('/api', apiController);


const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
