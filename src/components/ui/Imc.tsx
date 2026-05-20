import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import { dbServices } from '../../services/dbServices'

interface ImcProps {
  userEmail: string;
}

export default function Imc({ userEmail }: ImcProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imcValue, setImcValue] = useState<string | number>(0);
  const [description, setDescription] = useState('');
  const [listaHistorico, setListaHistorico] = useState<any[]>([]);
  const [exibindoHistorico, setExibindoHistorico] = useState(false);

  const databaseService = new dbServices();

  async function calculateImc() {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));

    if (isNaN(w) || isNaN(h) || h === 0) {
      Alert.alert('Erro', 'Por favor, insira valores válidos.');
      return;
    }

    const imc = w / (h * h);
    const resultadoCalculado = imc.toFixed(2);
    setImcValue(resultadoCalculado);

    let desc = '';
    if (imc < 18.5) desc = 'Abaixo do peso';
    else if (imc < 24.9) desc = 'Peso normal';
    else if (imc < 29.9) desc = 'Sobrepeso';
    else desc = 'Obesidade';

    setDescription(desc);
    Keyboard.dismiss();

    try {
      await databaseService.insert('HISTORICO_IMC', {
        usuario_email: userEmail,
        peso: w,
        altura: h,
        resultado: parseFloat(resultadoCalculado),
        classificacao: desc,
        data: new Date().toLocaleDateString('pt-BR')
      });
      console.log("IMC salvo no banco com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar IMC no banco:", err);
    }
  }

  async function carregarHistorico() {
    try {
      const dados = await databaseService.getAll<any>('HISTORICO_IMC');
      // Filtra apenas os registros do usuário atual
      const filtrado = dados.filter(item => item.usuario_email === userEmail);
      setListaHistorico(filtrado.reverse()); // Mais recentes primeiro
      setExibindoHistorico(true);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CONSULTE SEU IMC</Text>
      <Text style={styles.userLabel}>Usuário: {userEmail}</Text>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Peso (ex: 75.5)"
          keyboardType="numeric"
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          placeholder="Altura (ex: 1.80)"
          keyboardType="numeric"
          style={styles.input}
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonStyles} onPress={calculateImc}>
          <Text style={styles.btnText}>Consultar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonStyles, styles.btnHist]} onPress={carregarHistorico}>
          <Text style={styles.btnTextHist}>📜 Histórico</Text>
        </TouchableOpacity>
      </View>

      {imcValue !== 0 && !exibindoHistorico && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Seu IMC é:</Text>
          <Text style={styles.resultValue}>{imcValue}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}

      {exibindoHistorico && (
        <View style={styles.historicoContainer}>
          <View style={styles.histHeader}>
            <Text style={styles.histTitle}>Seu Histórico Local:</Text>
            <TouchableOpacity onPress={() => setExibindoHistorico(false)}>
              <Text style={{color: '#d32f2f', fontWeight: 'bold'}}>Fechar</Text>
            </TouchableOpacity>
          </View>
          {listaHistorico.length === 0 ? (
            <Text style={styles.txtVazio}>Nenhum cálculo salvo ainda.</Text>
          ) : (
            listaHistorico.map((item, idx) => (
              <View key={idx} style={styles.histItemCard}>
                <Text style={styles.histItemData}>{item.data}</Text>
                <Text style={styles.histItemTxt}>
                  {item.peso}kg / {item.altura}m ➔ <Text style={{fontWeight: 'bold'}}>{item.resultado}</Text>
                </Text>
                <Text style={styles.histItemClass}>{item.classificacao}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 5, color: '#1e293b' },
  userLabel: { fontSize: 13, color: '#64748b', marginBottom: 25 },
  inputGroup: { width: '100%', gap: 15, marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f8fafc' },
  buttonRow: { flexDirection: 'row', gap: 15, width: '100%', justifyContent: 'center' },
  buttonStyles: { flex: 1, backgroundColor: '#005088', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnHist: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  btnTextHist: { color: '#334155', fontWeight: '600' },
  resultContainer: { marginTop: 30, alignItems: 'center', backgroundColor: '#f8fafc', padding: 20, borderRadius: 12, width: '100%', borderWidth: 1, borderColor: '#e2e8f0' },
  resultLabel: { fontSize: 16, color: '#64748b' },
  resultValue: { fontSize: 44, fontWeight: 'bold', color: '#005088', marginVertical: 5 },
  description: { fontSize: 18, color: '#16a34a', fontWeight: '600' },
  historicoContainer: { marginTop: 30, width: '100%' },
  histHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 },
  histTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  txtVazio: { color: '#94a3b8', textAlign: 'center', marginTop: 10 },
  histItemCard: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  histItemData: { fontSize: 11, color: '#94a3b8', position: 'absolute', top: 12, right: 15 },
  histItemTxt: { fontSize: 15, color: '#334155' },
  histItemClass: { fontSize: 13, color: '#005088', fontWeight: '600', marginTop: 4 }
});