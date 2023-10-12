/**
 * @swagger
 * /get-handler:
 *   get:
 *     summary: Obtiene datos de SWAPI.
 *     responses:
 *       200:
 *         description: Respuesta exitosa.
 */

// Importa las dependencias necesarias
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Database from '../services/Database';
import { createErrorResponse, createSuccessResponse } from '../utils/responses';
import { fetchSwapiData } from '../services/swapi';

// URL de la base de datos
const dbUrl = process.env.DATABASE_URL ?? "";
// Crea una instancia de la clase Database
const database = new Database(dbUrl);

// Modelos permitidos
const models = ["people", "planets", "films", "species", "vehicles", "starships"];

// Controlador de la API
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Obtiene el modelo desde los parámetros de la solicitud, si no se proporciona, usa "films" por defecto
    const model = event.pathParameters?.model ?? "films";

    // Verifica si el modelo es válido
    if (!models.includes(model)) {
        return createErrorResponse(400, `Modelo no válido. Debe usar uno de los siguientes: ${models.join(", ")}`);
    }

    try {
        // Crea la tabla en la base de datos si no existe
        await database.createTableIfNotExists(model);

        // Obtiene datos de SWAPI
        const swapiData = await fetchSwapiData(model);
        // Obtiene datos de la base de datos
        const dbData = await database.queryData(model);

        // Prepara la respuesta exitosa con los datos obtenidos
        const responseBody = { dbData, swapiData };
        return createSuccessResponse(responseBody);
    } catch (error) {
        // En caso de error, registra el error y devuelve una respuesta de error
        console.error('Error:', error);
        return createErrorResponse(500, 'Hubo un error');
    }
};
