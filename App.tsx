import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { DataBase } from './src/database/database';
import Perfil from './src/components/ui/Perfil';

import * as SQLite from 'expo-sqlite';


import { Login } from './src/components/ui/Login';
import { Dashboard } from './src/components/ui/Dashboard';

import Imc from './src/components/ui/Imc';
import Moedas from './src/components/ui/Moedas';
import Pedidos from './src/components/ui/Pedidos';
import Planetas from './src/components/ui/planetasPage';

export default function App() {

  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Home'>('Login');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function initAppDatabase() {
      try {
        const dbManager = new DataBase();

        // 1. Criação das tabelas usando sua estrutura original
        await dbManager.createTable(
          [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "usuario TEXT NOT NULL",
            "email TEXT UNIQUE NOT NULL",
            "password TEXT NOT NULL"
          ],
          "LOGIN"
        );

        await dbManager.createTable(
          [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "usuario_email TEXT NOT NULL",
            "peso REAL NOT NULL",
            "altura REAL NOT NULL",
            "resultado REAL NOT NULL",
            "classificacao TEXT NOT NULL",
            "data TEXT NOT NULL"
          ],
          "HISTORICO_IMC"
        );

        await dbManager.createTable(
          [
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "usuario_email TEXT NOT NULL",
            "itens TEXT NOT NULL",
            "total REAL NOT NULL",
            "data TEXT NOT NULL"
          ],
          "HISTORICO_PEDIDOS"
        );

        const nativeDb = await dbManager.connect(); 

        const adminEmail = process.env.EXPO_PUBLIC_WEB_ADMIN_EMAIL || "admin@fatec.com";

        const userCheck = await nativeDb.getFirstAsync('SELECT id FROM LOGIN LIMIT 1;');
        
        if (!userCheck) {
          console.log("⚡ Banco de dados mobile vazio. Criando usuário admin padrão...");
          
          await nativeDb.runAsync(
            `INSERT INTO LOGIN (usuario, email, password) VALUES (?, ?, ?);`,
            [
              "Jhon Deyvid", 
              adminEmail.trim().toLowerCase(), 
              "$2a$10$R9hZ6vdfgZ67B1V12.uBOO9P7P6HqA5E7/r4mRk1M4mE9Gg.tY21y" // Hash de '123456'
            ]
          );
          console.log("✅ Usuário admin padrão inserido no SQLite com sucesso!");
        }

        setDbReady(true);
      } catch (error) {
        console.error("Falha ao inicializar tabelas ou sementes no App.tsx:", error);
        setDbReady(true);
      }
    }

    initAppDatabase();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005088" />
      </View>
    );
  }

  const handleNavigation = (screen: 'Login' | 'Home', subScreen: string | null = null, email: string = '') => {
    if (email) setUserEmail(email);
    setActiveSubScreen(subScreen);
    setCurrentScreen(screen);
  };

  const renderSubScreen = () => {
    switch (activeSubScreen) {
      case 'IMC': return <Imc userEmail={userEmail} />;
      case 'Moedas': return <Moedas />;
      case 'Pedidos': return <Pedidos userEmail={userEmail} />;
      case 'Planetas': return <Planetas />;
      case 'Perfil': return <Perfil userEmail={userEmail} />; 
      default: return null; 
    }
  };

  if (currentScreen === 'Login') {
    return (
      <Login 
        onNavigate={(screen: string, email?: string) => {
          const targetScreen = screen === 'Dashboard' ? 'Home' : 'Login';
          handleNavigation(targetScreen, null, email || '');
        }} 
      />
    );
  }

  return (
    <Dashboard 
      userEmail={userEmail} 
      activeSubScreen={activeSubScreen}
      onChangeSubScreen={(sub) => setActiveSubScreen(sub)}
      onLogout={() => handleNavigation('Login', null, '')}
    >
      {renderSubScreen()}
    </Dashboard>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
});