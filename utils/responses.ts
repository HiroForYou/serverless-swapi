import { APIGatewayProxyResult } from "aws-lambda";

export const createSuccessResponse = (data: any): APIGatewayProxyResult => ({
    statusCode: 200,
    body: JSON.stringify(data),
});

export const createErrorResponse = (statusCode: number, message: string): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify({ error: message }),
});
