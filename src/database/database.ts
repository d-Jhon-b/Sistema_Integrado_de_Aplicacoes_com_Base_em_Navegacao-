import * as sql from 'expo-sqlite'
import { Platform } from 'react-native';

export class DataBase {
    private static banco: sql.SQLiteDatabase | null = null;

    constructor() {}

    async connect() {
        if (Platform.OS === 'web') {
            return null as any;
        }
        
        if (!DataBase.banco) {
            try {
                const instance = await sql.openDatabaseAsync('tarefas.db');
                await instance.execAsync('PRAGMA journal_mode = WAL;');
                DataBase.banco = instance;
            } catch (error) {
                console.error("Erro fatal ao abrir o arquivo tarefas.db:", error);
                throw error;
            }
        }
        return DataBase.banco;
    }

    async createTable(params: string[], name?: string, seedQuery?: string) {
        const db = await this.connect();
        if (!name || name.trim() === '') {
            throw new Error("Necessário o nome de uma tabela");
        }
        const tableName: string = name;
        const columnsQuery = params.join(',\n');
        try {
            const res = await db.execAsync(`
                CREATE TABLE IF NOT EXISTS ${tableName}(
                    ${columnsQuery}
                );    
            `);
            console.log(`Tabela ${tableName} verificada/criada com sucesso!`);
            if (seedQuery) {
                await db.execAsync(seedQuery);
                console.log(`Seed aplicada com sucesso na tabela ${tableName}!`);
            }
            return res;
        } catch (error: any) {
            console.error(`Erro ao criar tabela ${tableName}:`, error);
            throw error;
        }
    }
}