/**
 * @swagger
 * /post-handler:
 *   post:
 *     summary: Guarda datos en la base de datos desde SWAPI.
 *     requestBody:
 *       description: Datos para guardar en la base de datos.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourModel'
 *     responses:
 *       200:
 *         description: Datos guardados exitosamente.
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Importa los módulos y servicios necesarios
import { translateKeysToSpanish } from '../utils';
import Database from '../services/Database';
import { createErrorResponse, createSuccessResponse } from '../utils/responses';
import { fetchSwapiData } from '../services/swapi';

// URL de la base de datos
const dbUrl = process.env.DATABASE_URL ?? "";

// Crea una instancia de la clase Database
const database = new Database(dbUrl);

// Modelos válidos
const models: string[] = ["people", "planets", "films", "species", "vehicles", "starships"];

export const getModelFromEvent = (event: string | APIGatewayProxyEvent): string => {
    // Si el evento es una cadena, conviértelo en un objeto
    if (typeof event === 'string') {
        event = JSON.parse(event) as APIGatewayProxyEvent;
    }

    // Extrae el cuerpo del evento
    const body = event.body || '{}';

    // Si el cuerpo es una cadena, conviértelo en un objeto
    const parsedBody = (typeof body === 'string') ? JSON.parse(body) : body;

    // Accede a la propiedad "model" y devuelve su valor
    const model = parsedBody.model || "";

    return model;
};

// Función para traducir y guardar los datos en la base de datos
const translateAndSaveData = async (model: string, data: any): Promise<void> => {
    const mappedData = await translateKeysToSpanish(data);
    // Puedes habilitar el registro de datos si es necesario
    // console.log("mappedData", mappedData);
    await database.insertData(model, mappedData);
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Obtiene el modelo desde el evento
    const model = getModelFromEvent(event);

    if (!model) {
        // Si falta el parámetro "model" en la solicitud, devuelve un error
        return createErrorResponse(400, 'Falta el parámetro "model" en el cuerpo de la solicitud.');
    }

    if (!models.includes(model)) {
        // Si el modelo no es válido, devuelve un error
        return createErrorResponse(400, `Modelo no válido. Debe usar uno de los siguientes: ${models.join(", ")}`);
    }

    try {
        // Crea la tabla en la base de datos si no existe
        await database.createTableIfNotExists(model);

        // Obtiene los datos de SWAPI
        const responseData = await fetchSwapiData(model);

        if (typeof responseData === 'object' && responseData !== null) {
            // Si la respuesta es un objeto JSON válido, traduce y guarda los datos
            await translateAndSaveData(model, responseData);

            return createSuccessResponse({ message: 'Datos guardados exitosamente.' });
        } else {
            // Si la respuesta no es válida, lanza un error
            throw new Error('La respuesta no es un objeto JSON válido.');
        }
    } catch (error) {
        // Maneja cualquier error que ocurra
        console.error('Error:', error);
        return createErrorResponse(500, `Hubo un error. ${error}`);
    }
};