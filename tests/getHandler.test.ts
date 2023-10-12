import { APIGatewayProxyEvent } from 'aws-lambda';
import { expect, it, describe } from '@jest/globals';

// Cargamos las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();

import { handler } from '../routes/getHandler';

describe('handler', () => {
    it('should return a success response with the correct data', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { model: 'films' },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const responseBody = JSON.parse(response.body);
        expect(responseBody.dbData).toBeDefined();
        expect(responseBody.swapiData).toBeDefined();
    });

    it('should return an error response for an invalid model', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { model: 'invalid' },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(response.body).toBeDefined();

        const responseBody = JSON.parse(response.body);
        expect(responseBody.error).toContain('Modelo no válido');
    });
});