import { APIGatewayProxyEvent } from 'aws-lambda';
import { expect, describe, jest, beforeEach, afterEach, test } from '@jest/globals';

// Cargamos las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();


import { createErrorResponse } from '../utils/responses';
import { getModelFromEvent, handler } from '../routes/postHandler';


// Mock the behavior of external dependencies
jest.mock('../services/swapi');
jest.mock('../services/Database');

describe('handler', () => {
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    // Create a mock event object with a default model
    event = {
      body: JSON.stringify({ model: 'films' }),
    } as APIGatewayProxyEvent;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getModelFromEvent', () => {
    test('should return the default model if no model is provided in the event body', () => {
      const result = getModelFromEvent({} as APIGatewayProxyEvent);
      expect(result).toEqual('');
    });

    test('should return the model provided in the event body', () => {
      const result = getModelFromEvent(event);
      expect(result).toEqual('films');
    });
  });

  describe('handler', () => {
    test('should return an error response if no model is provided in the event body', async () => {
      event.body = JSON.stringify({});
      const result = await handler(event);
      expect(result).toEqual(createErrorResponse(400, 'Falta el parámetro "model" en el cuerpo de la solicitud.'));
    });

    test('should return an error response if an invalid model is provided in the event body', async () => {
      event.body = JSON.stringify({ model: 'invalid' });
      const result = await handler(event);
      expect(result).toEqual(createErrorResponse(400, 'Modelo no válido. Debe usar uno de los siguientes: people, planets, films, species, vehicles, starships'));
    });
  });
});
