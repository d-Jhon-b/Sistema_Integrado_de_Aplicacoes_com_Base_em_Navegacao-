import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { DataBase } from '../../database/database';
import { AuthService } from '../../services/authService';

export default function Perfil({ userEmail }: { userEmail: string }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const dbManager = new DataBase();
  const authService = new AuthService(dbManager);

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await authService.getUserByEmail(userEmail);
        if (user) {
          setName(user.usuario);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setFetching(false);
      }
    }
    loadUserData();
  }, [userEmail]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Platform.OS === 'web' ? alert("O nome não pode ficar vazio!") : Alert.alert("Erro", "O nome não pode ficar vazio!");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.updateUser(userEmail, name, password);
      
      if (result.success) {
        Platform.OS === 'web' ? alert(result.message) : Alert.alert("Sucesso!", result.message);
      } else {
        Platform.OS === 'web' ? alert(result.message) : Alert.alert("Erro", result.message);
      }
    } catch (error) {
      console.error(error);
      Platform.OS === 'web' ? alert("Erro ao atualizar") : Alert.alert("Erro", "Falha ao salvar dados.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#005088" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados da Conta</Text>
      <Text style={styles.subtitle}>Email: {userEmail}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Atualize seu nome"
        />

        <Text style={styles.label}>Nova Senha (Deixe em branco para manter a atual)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Digite a nova senha se desejar alterar"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#005088', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { height: 48, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, marginBottom: 20, backgroundColor: '#f8fafc', fontSize: 15 },
  button: { height: 48, backgroundColor: '#005088', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});