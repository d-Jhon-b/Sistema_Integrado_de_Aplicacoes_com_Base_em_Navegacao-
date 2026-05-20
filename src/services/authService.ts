import { DataBase } from "../database/database";
import * as sql from 'expo-sqlite';
import { Platform } from 'react-native';
import { UtilsTools } from "../utils/hashCoontent"; 

const hashToolsService = new UtilsTools();

export class AuthService {
    private databaseManager: DataBase;

    constructor(dbInstance: DataBase) {
        this.databaseManager = dbInstance;
    }
    
    private async getDatabase(): Promise<sql.SQLiteDatabase> {
        return await this.databaseManager.connect();
    }
    
    async getUserByEmail(email: string) {
        console.log(`[AuthService] Buscando e-mail: "${email}"`);
        const adminEmail = process.env.EXPO_PUBLIC_WEB_ADMIN_EMAIL || "admin@fatec.com";
        const adminPasswordRaw = process.env.EXPO_PUBLIC_WEB_ADMIN_PASSWORD || "123456";

        const safeEmail = email ? email.trim().toLowerCase() : "";

        if (Platform.OS === 'web') {
            console.log(`[Web Mode] Buscando usuário mock para: ${safeEmail}`);
            if (safeEmail === adminEmail.toLowerCase()) {
                const payloadToHash = {
                    usuario: "Jhon Deyvid",
                    password: adminPasswordRaw
                };

                const hashes = await hashToolsService.hashContentValues(payloadToHash);
                return {
                    id: 1,
                    usuario: payloadToHash.usuario,
                    email: adminEmail,
                    password: hashes[1] 
                };
            }
            return null;
        }

        if (!safeEmail) return null; 

        try {
            console.log("[AuthService] Obtendo instância do banco...");
            const db = await this.getDatabase(); 
            
            console.log("[AuthService] Executando query no SQLite nativo...");
            
            const result = await db.getFirstAsync(
                'SELECT id, usuario, email, password FROM LOGIN WHERE email = ? LIMIT 1;', 
                [safeEmail]
            );
            
            console.log("[AuthService] Resultado retornado do banco:", result);
            return result as any; 
            
        } catch (error) {
            console.error("Erro crítico ao buscar usuário por e-mail no SQLite:", error);
            throw error;
        }
    }


    async registerUser(name: string, email: string, passwordRaw: string) {
        const safeEmail = email.trim().toLowerCase();
        const safeName = name.trim();

        if (Platform.OS === 'web') {
            console.log(`[Web Mode] Mock de cadastro para: ${safeEmail}`);
            return { success: true, message: "Usuário cadastrado com sucesso (Mock Web)!" };
        }

        try {
            const db = await this.getDatabase();

            const userExists = await this.getUserByEmail(safeEmail);
            if (userExists) {
                return { success: false, message: "Este e-mail já está cadastrado!" };
            }

            const payloadToHash = { usuario: safeName, password: passwordRaw };
            const hashes = await hashToolsService.hashContentValues(payloadToHash);
            const hashedPassword = hashes[1]; // Índice 1 é o hash da senha

            await db.runAsync(
                'INSERT INTO LOGIN (usuario, email, password) VALUES (?, ?, ?);',
                [safeName, safeEmail, hashedPassword]
            );

            return { success: true, message: "Conta criada com sucesso!" };
        } catch (error) {
            console.error(" Erro crítico ao registrar usuário no SQLite:", error);
            return { success: false, message: "Erro interno ao salvar no banco de dados." };
        }
    }


    async updateUser(email: string, newName: string, newPasswordRaw?: string) {
        const safeEmail = email.trim().toLowerCase();
        const safeName = newName.trim();

        if (Platform.OS === 'web') {
            console.log(`[Web Mode] Mock de atualização para: ${safeEmail}`);
            return { success: true, message: "Dados atualizados com sucesso (Mock Web)!" };
        }

        try {
            const db = await this.getDatabase();

            if (newPasswordRaw && newPasswordRaw.trim() !== '') {
                const payloadToHash = { usuario: safeName, password: newPasswordRaw };
                const hashes = await hashToolsService.hashContentValues(payloadToHash);
                const hashedPassword = hashes[1];

                await db.runAsync(
                    'UPDATE LOGIN SET usuario = ?, password = ? WHERE email = ?;',
                    [safeName, hashedPassword, safeEmail]
                );
            } else {
                await db.runAsync(
                    'UPDATE LOGIN SET usuario = ? WHERE email = ?;',
                    [safeName, safeEmail]
                );
            }

            return { success: true, message: "Dados atualizados com sucesso!" };
        } catch (error) {
            console.error("❌ Erro crítico ao atualizar usuário no SQLite:", error);
            return { success: false, message: "Erro interno ao atualizar os dados." };
        }
    }



}