// import bcrypt from 'bcrypt'
import bcrypt from 'bcryptjs'
import { isHashposible } from '../interfaces/user';

import * as Crypto from 'expo-crypto' 

bcrypt.setRandomFallback((len) => {
  try {
    const randomBytes = Crypto.getRandomBytes(len);
    return Array.from(randomBytes);
  } catch (e) {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr);
  }
});

export class UtilsTools{
    private saltPassword = 12;
    private saltRounds = 8;

    async hashContentValues(data: isHashposible) {
        try {
            const saltUser = await bcrypt.genSalt(this.saltRounds);
            const saltPassword = await bcrypt.genSalt(this.saltPassword);
            
            const hashValues: string[] = await Promise.all([
                bcrypt.hash(data.usuario, saltUser),
                bcrypt.hash(data.password, saltPassword)
            ]);
            return hashValues;
        } catch (error: any) {
            console.error("Erro ao gerar hashes:", error);
            throw error;
        }
    }

    async compareHash(pureText: string, hashedText: string): Promise<boolean> {
        try {
            return new Promise((resolve, reject) => {
                bcrypt.compare(pureText, hashedText, (err, success:any) => {
                if (err) {
                    console.error("Erro interno do Bcrypt no callback:", err);
                    reject(err);
                } else {
                    resolve(success);
                }
                });
            });
        } catch (error) {
            console.error("Erro ao comparar hash:", error);
            return false;
        }
    }

}