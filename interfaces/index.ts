// Interfaz para el objeto JSON traducido
export interface TranslatedObject {
    [key: string]: any;
}

export interface Response {
    statusCode: number;
    body: string;
}