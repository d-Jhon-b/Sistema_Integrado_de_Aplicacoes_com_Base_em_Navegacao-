import { DataBase } from "../database/database";
import * as sql from 'expo-sqlite';
import { Platform } from 'react-native';

const webMockStorage: Record<string, any[]> = {
    HISTORICO_IMC: [],
    HISTORICO_PEDIDOS: []
};

export class dbServices {
    private databaseManager = new DataBase();

    private async getDatabase(): Promise<sql.SQLiteDatabase> {
        return await this.databaseManager.connect();
    }

    async insert(tableName: string, data: Record<string, any>) {
        const table = tableName.toUpperCase();
        
        if (Platform.OS === 'web') {
            if (!webMockStorage[table]) webMockStorage[table] = [];
            const mockRow = { id: Date.now(), ...data };
            webMockStorage[table].push(mockRow);
            console.log(`[Web Mode] Inserido no mock da tabela ${table}:`, mockRow);
            return { lastInsertRowId: mockRow.id, changes: 1 };
        }

        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        try {
            const db = await this.getDatabase();
            const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`;
            const result = await db.runAsync(query, values);
            return result; 
        } catch (error) {
            console.error(`Erro ao inserir na tabela ${table}:`, error);
            throw error;
        }
    }

    async getAll<T>(tableName: string): Promise<T[]> {
        const table = tableName.toUpperCase();

        if (Platform.OS === 'web') {
            console.log(`[Web Mode] Buscando dados do mock da tabela ${table}`);
            return (webMockStorage[table] || []) as T[];
        }

        try {
            const db = await this.getDatabase();
            const query = `SELECT * FROM ${table};`;
            const result = await db.getAllAsync<T>(query);
            return result; 
        } catch (error) {
            console.error(`Erro ao buscar dados da tabela ${table}:`, error);
            throw error;
        }
    }

    async deleteById(tableName: string, id: number) {
        const table = tableName.toUpperCase();

        if (Platform.OS === 'web') {
            if (webMockStorage[table]) {
                webMockStorage[table] = webMockStorage[table].filter(item => item.id !== id);
            }
            console.log(`[Web Mode] Deletado id ${id} do mock da tabela ${table}`);
            return { changes: 1 };
        }
        
        try {
            const db = await this.getDatabase();
            const query = `DELETE FROM ${table} WHERE id = ?;`;
            const result = await db.runAsync(query, [id]);
            return result;
        } catch (error) {
            console.error(`Erro ao deletar id ${id} da tabela ${table}:`, error);
            throw error;
        }
    }
}