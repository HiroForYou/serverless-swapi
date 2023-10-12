// Database.ts
import * as mysql from 'mysql2/promise';

class Database {
    private pool: mysql.Pool;

    constructor(private dbUrl: string) {
        this.pool = mysql.createPool(this.dbUrl);
    }

    // Obtiene una conexión de la piscina de conexiones.
    async getConnection() {
        return this.pool.getConnection();
    }

    // Crea una tabla si no existe en la base de datos.
    async createTableIfNotExists(model: string) {
        const connection = await this.getConnection();
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS ${model} (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    content LONGTEXT
                )
            `);
        } finally {
            connection.release(); // Libera la conexión después de su uso.
        }
    }

    // Realiza una consulta en la base de datos y devuelve los datos.
    async queryData(model: string) {
        const connection = await this.getConnection();
        try {
            const [dbData] = await connection.query('SELECT * FROM ??', [model]);
            return dbData;
        } finally {
            connection.release(); // Libera la conexión después de su uso.
        }
    }

    // Inserta datos en la base de datos eliminando el contenido anterior.
    async insertData(model: string, data: any) {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction(); // Inicia una transacción

            // Elimina todos los registros de la tabla
            const deleteQuery = `DELETE FROM ${model}`;
            await connection.execute(deleteQuery);

            // Inserta los nuevos datos
            const insertQuery = `INSERT INTO ${model} (content) VALUES (?)`;
            const insertValues = [JSON.stringify(data)];
            await connection.execute(insertQuery, insertValues);

            await connection.commit(); // Confirma la transacción
        } catch (error) {
            await connection.rollback(); // En caso de error, revierte la transacción
            throw error;
        } finally {
            connection.release(); // Libera la conexión después de su uso.
        }
    }
}

export default Database;
