import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DataBase } from '../../database/database';
import { UtilsTools } from '../../utils/hashCoontent';
import { AuthService } from '../../services/authService';

const hashToolsService = new UtilsTools();

export function Login({ onNavigate }: { onNavigate: (screen: string, email?: string) => void }) {
  const [isRegistering, setIsRegistering] = useState(false); // Controla se exibe Login ou Cadastro
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, message: string) => {
    Platform.OS === 'web' ? alert(`${title}: ${message}`) : Alert.alert(title, message);
  };

  const handleAuthAction = async () => {
    // Validação comum de campos
    if (!emailInput || !passwordInput || (isRegistering && !nameInput)) {
      showAlert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    const dbManager = new DataBase();
    const authService = new AuthService(dbManager);
    const targetEmail = emailInput.trim().toLowerCase();

    try {
      if (isRegistering) {
        // --- FLUXO DE CADASTRO ---
        const registration = await authService.registerUser(nameInput, targetEmail, passwordInput);
        
        if (registration.success) {
          showAlert("Sucesso!", registration.message);
          setIsRegistering(false); // Volta para a tela de login com os dados preenchidos
          setNameInput('');
        } else {
          showAlert("Erro no Cadastro", registration.message);
        }
      } else {
        // --- FLUXO DE LOGIN ---
        const user = await authService.getUserByEmail(targetEmail);
        console.log("[LoginUI] Dados retornados para validação:", user);
        
        if (!user) {
          showAlert("Login Falhou", "Usuário não encontrado.");
          setLoading(false);
          return;
        }

        // Bypass/Validação híbrida para a conta admin padrão
        const adminEmail = process.env.EXPO_PUBLIC_WEB_ADMIN_EMAIL || "admin@fatec.com";
        const adminPasswordRaw = process.env.EXPO_PUBLIC_WEB_ADMIN_PASSWORD || "123456";
        
        let isPasswordValid = false;
        if (targetEmail === adminEmail.toLowerCase() && passwordInput === adminPasswordRaw) {
          isPasswordValid = true;
        } else {
          isPasswordValid = await hashToolsService.compareHash(passwordInput, user.password);
        }

        if (isPasswordValid) {
          onNavigate('Dashboard', targetEmail);
        } else {
          showAlert("Login Falhou", "Senha incorreta.");
        }
      }
    } catch (error) {
      showAlert("Erro", "Falha crítica ao processar a requisição.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>FATEC</Text>
        <Text style={styles.subtitle}>Sistema Integrado de Aplicações</Text>
        
        {Platform.OS === 'web' && <Text style={styles.webBadge}>Ambiente Web Ativo</Text>}

        <Text style={styles.formTitle}>
          {isRegistering ? "Crie sua Conta Local" : "Acesse suas Funcionalidades"}
        </Text>

        {/* Campo de nome visível apenas no modo Cadastro */}
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#888"
            value={nameInput}
            onChangeText={setNameInput}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#888"
          value={emailInput}
          onChangeText={setEmailInput}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#888"
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry={true}
        />

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabledButton]} 
          onPress={handleAuthAction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isRegistering ? "Cadastrar Conta" : "Entrar no Sistema"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => {
            setIsRegistering(!isRegistering);
            setNameInput('');
          }}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            {isRegistering ? "Já tem uma conta? Faça Login" : "Não tem conta? Toque aqui para Criar"}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#002f55', // Azul FATEC institucional de fundo
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center'
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#005088',
    letterSpacing: 2
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#005088',
    paddingLeft: 8
  },
  webBadge: { 
    fontSize: 11, 
    color: '#2e7d32', 
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15, 
    fontWeight: 'bold' 
  },
  input: { 
    width: '100%', 
    height: 52, 
    borderWidth: 1.5, 
    borderColor: '#e2e8f0', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    fontSize: 15,
    color: '#333'
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#005088',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#005088',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  disabledButton: {
    backgroundColor: '#a0aec0'
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryButton: {
    marginTop: 20,
    padding: 5
  },
  secondaryButtonText: {
    color: '#005088',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});