import express from 'express';
import * as getHandler from '../routes/getHandler';
import * as postHandler from '../routes/postHandler';

const router = express.Router();

// Ruta para obtener datos utilizando getHandler
router.get('/get-handler', getHandler.handler);

// Ruta para guardar datos utilizando postHandler
router.post('/post-handler', postHandler.handler);

export default router;
