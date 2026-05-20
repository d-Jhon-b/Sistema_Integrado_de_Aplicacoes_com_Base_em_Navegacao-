import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import React, { useState } from 'react';
import { catalogo } from '../../interfaces/Moedas';
// import { converter } from './src/services/converterValor';
import { converter } from '../../utils/converter';


export default function Moedas() {
  const [valorInserido, setValorInserido] = useState('');
  const [moedaOrigem, setMoedaOrigem] = useState('real');
  const [moedaDestino, setMoedaDestino] = useState('dolar');
  const [resultado, setResultado] = useState<string | null>(null);
  const [historico, setHistorico] = useState<string[]>([]);

  const handleConverter = () => {
    const num = parseFloat(valorInserido.replace(',', '.'));
    if (isNaN(num) || num <= 0) {
      Alert.alert("Erro", "Digite um valor válido.");
      return;
    }
    if (moedaOrigem === moedaDestino) {
      Alert.alert("Aviso", "As moedas são iguais.");
      return;
    }

    const valorFinal = converter(num, moedaOrigem, moedaDestino);
    setResultado(valorFinal);

    const log = `${valorInserido} ${moedaOrigem.toUpperCase()} ➔ ${valorFinal} ${moedaDestino.toUpperCase()}`;
    setHistorico([log, ...historico].slice(0, 5));
  };

  const handleSwap = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
    setResultado(null);
  };

  const renderIcon = (moedaChave: string) => {
    const Icone = catalogo[moedaChave]?.imagenMoeda;
    if (!Icone) return <View style={styles.placeholderIcon} />;

    if (typeof Icone === 'function') {
      return <Icone width={50} height={50} />;
    }
    return <Image source={Icone} style={{ width: 50, height: 50 }} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Global Currency</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            keyboardType="numeric"
            value={valorInserido}
            onChangeText={setValorInserido}
          />

          <View style={styles.selecaoRow}>
            <View style={styles.boxMoeda}>
              {renderIcon(moedaOrigem)}
              <Picker
                selectedValue={moedaOrigem}
                onValueChange={setMoedaOrigem}
                style={styles.picker}
              >
                {Object.keys(catalogo).map(m => (
                  <Picker.Item key={m} label={m.toUpperCase()} value={m} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
              <Text style={{ fontSize: 24 }}>⇄</Text>
            </TouchableOpacity>

            <View style={styles.boxMoeda}>
              {renderIcon(moedaDestino)}
              <Picker
                selectedValue={moedaDestino}
                onValueChange={setMoedaDestino}
                style={styles.picker}
              >
                {Object.keys(catalogo).map(m => (
                  <Picker.Item key={m} label={m.toUpperCase()} value={m} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.btnPrincipal} onPress={handleConverter}>
            <Text style={styles.btnText}>Converter</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={styles.cardResultado}>
            <Text style={styles.resTexto}>Total: {resultado}</Text>
          </View>
        )}

        <View style={styles.historico}>
          <Text style={styles.histTitulo}>Histórico:</Text>
          {historico.map((h, i) => (
            <Text key={i} style={styles.histItem}>{h}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', 
    paddingTop: 50 },
  titulo: { fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#1A1C1E' 
  },
  scroll: { 
    padding: 20 },
  card: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 20, 
    elevation: 5 },
  input: { 
    fontSize: 40, 
    textAlign: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#E0E0E0', 
    marginBottom: 25 },
    selecaoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around' 
  },
  boxMoeda: { 
    alignItems: 'center', 
    width: '40%' 
  },
  picker: { 
    width: '100%' 
  },
  swapBtn: { 
    backgroundColor: '#F0F0F0', 
    padding: 10, 
    borderRadius: 50 },
  btnPrincipal: { backgroundColor: '#0052CC', 
    padding: 18, 
    borderRadius: 12, 
    marginTop: 25 },
  btnText: { color: '#FFF', 
    textAlign: 'center', 
    fontWeight: 'bold', fontSize: 18 },
  cardResultado: { 
    marginTop: 20, 
    backgroundColor: '#D4EDDA', 
    padding: 20, 
    borderRadius: 12 },
  resTexto: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#155724', 
    textAlign: 'center' },
  placeholderIcon: { 
    width: 50, 
    height: 50, 
    backgroundColor: '#EEE', 
    borderRadius: 25 },
  historico: { 
    marginTop: 30 },
  histTitulo: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginBottom: 10 },
  histItem: { backgroundColor: '#FFF', 
    padding: 12,
     marginBottom: 8, 
    borderRadius: 8, color: '#444' }
});