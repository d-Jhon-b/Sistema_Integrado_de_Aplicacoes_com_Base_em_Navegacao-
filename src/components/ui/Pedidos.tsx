import { StyleSheet, Text, View, Image, Button, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { dbServices } from '../../services/dbServices'; 

interface PedidosProps {
  userEmail: string;
}

export default function Pedidos({ userEmail }: PedidosProps) {
  const cardapio: any = {
    lanche1: { nome: "Hambúrguer", price: 10, img: "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg" },
    lanche2: { nome: "Pizza", price: 30.30, img: "https://as1.ftcdn.net/jpg/18/20/85/16/1000_F_1820851634_DgmrTNgcIbCtiL2Hnw59SX7ajKstMSbz.jpg" },
    lanche3: { nome: "Hot Dog", price: 20.20, img: "https://as2.ftcdn.net/jpg/15/73/99/75/1000_F_1573997594_TW7NOST4FbeObHLOgj9IvNPbGobyT1xn.jpg" },
  };

  const linkbebida: any = {
    bebida1: { nome: "Cocaquina", img: "https://lacascada.com.bo/wp-content/uploads/2023/11/750.jpg", price: 10 },
    bebida2: { nome: "Tampico", img: "https://tampico.com/wp-content/uploads/2022/01/citrus-hero-img-min.png", price: 20 },
    bebida3: { nome: "Chá", img: "https://totalpass.com/wp-content/uploads/2025/08/cha.jpg", price: 25 },
    bebida4: { nome: "Suco", price: 30, img: "https://static.ndmais.com.br/2024/09/suco-laranja-freepik-800x533.jpg" }
  };

  const [selecionado, setSelecionado] = useState('');
  const [selecionadoBebida, setSelecionadoBebida] = useState('');
  const [visivel, setVisible] = useState(false);
  
  const [listaPedidos, setListaPedidos] = useState<any[]>([]);
  const [verHist, setVerHist] = useState(false);

  const databaseService = new dbServices();
  const combosSelecionado = selecionado !== '' && selecionadoBebida !== '';
  
  const totalPedido = (selecionado ? cardapio[selecionado].price : 0) + (selecionadoBebida ? linkbebida[selecionadoBebida].price : 0);

  async function finalizarPedido() {
    const stringItens = `${cardapio[selecionado].nome} + ${linkbebida[selecionadoBebida].nome}`;
    
    try {
      await databaseService.insert('HISTORICO_PEDIDOS', {
        usuario_email: userEmail,
        itens: stringItens,
        total: totalPedido,
        data: new Date().toLocaleDateString('pt-BR')
      });
      
      setVisible(false);
      setSelecionado('');
      setSelecionadoBebida('');
      alert('Pedido gravado com sucesso no seu Histórico!');
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
    }
  }

  async function carregarHistoricoPedidos() {
    try {
      const res = await databaseService.getAll<any>('HISTORICO_PEDIDOS');
      const filtrado = res.filter(item => item.usuario_email === userEmail);
      setListaPedidos(filtrado.reverse());
      setVerHist(true);
    } catch (err) {
      console.error("Erro ao ler pedidos:", err);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnVerHist} onPress={carregarHistoricoPedidos}>
        <Text style={styles.txtVerHist}>📋 Ver Meus Pedidos Anteriores</Text>
      </TouchableOpacity>

      {verHist ? (
        <ScrollView style={{width: '100%', marginTop: 10}}>
          <View style={styles.headerHist}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Histórico de Compras:</Text>
            <TouchableOpacity onPress={() => setVerHist(false)}>
              <Text style={{color: 'red'}}>Voltar</Text>
            </TouchableOpacity>
          </View>
          {listaPedidos.map((ped, i) => (
            <View key={i} style={styles.cardHistPed}>
              <Text style={styles.dateHistPed}>{ped.data}</Text>
              <Text style={styles.itemHistPed}>{ped.itens}</Text>
              <Text style={styles.totalHistPed}>Total: R$ {Number(ped.total).toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.tituloSecao}>Selecione seu Lanche</Text>
          {selecionado !== '' && (
            <View style={styles.resultado}>
              <Image source={{ uri: cardapio[selecionado].img }} style={styles.foto} resizeMode="contain" />
              <Text style={styles.textoPreco}>R$ {cardapio[selecionado].price.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.pickerBox}>
            <Picker selectedValue={selecionado} style={styles.pickerStyle} onValueChange={(v) => setSelecionado(v)}>
              <Picker.Item label="Escolha um lanche..." value="" />
              <Picker.Item label="Hambúrguer" value="lanche1" />
              <Picker.Item label="Pizza" value="lanche2" />
              <Picker.Item label="Hot Dog" value="lanche3" />
            </Picker>
          </View>

          <Text style={styles.tituloSecao}>Selecione sua Bebida</Text>
          {selecionadoBebida !== '' && (
            <View style={styles.resultado}>
              <Image source={{ uri: linkbebida[selecionadoBebida].img }} style={styles.foto} resizeMode="contain" />
              <Text style={styles.textoPreco}>R$ {linkbebida[selecionadoBebida].price.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.pickerBox}>
            <Picker selectedValue={selecionadoBebida} style={styles.pickerStyle} onValueChange={(v) => setSelecionadoBebida(v)}>
              <Picker.Item label="Escolha uma bebida..." value="" />
              <Picker.Item label="Cocaquina" value="bebida1" />
              <Picker.Item label="Tampico" value="bebida2" />
              <Picker.Item label="Chá" value="bebida3" />
              <Picker.Item label="Suco" value="bebida4" />
            </Picker>
          </View>
          
          <Button title='Consultar pedido' disabled={!combosSelecionado} onPress={() => setVisible(true)} color="#005088" />
        </ScrollView>
      )}

      <Modal visible={visivel} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitulo}>Resumo do Pedido</Text>
          <View style={styles.resumoItem}><Text style={styles.resumoLabel}>Lanche:</Text><Text>{selecionado ? cardapio[selecionado].nome : ""}</Text></View>
          <View style={styles.resumoItem}><Text style={styles.resumoLabel}>Bebida:</Text><Text>{selecionadoBebida ? linkbebida[selecionadoBebida].nome : ""}</Text></View>

          <View style={styles.totalBox}>
            <Text style={styles.totalTexto}>Total:</Text>
            <Text style={styles.totalValor}>R$ {totalPedido.toFixed(2)}</Text>
          </View>

          <View style={{gap: 12, width: '80%'}}>
            <Button title='✔️ Confirmar e Gravar no Banco' onPress={finalizarPedido} color="#16a34a"/>
            <Button title='Fechar e Editar' onPress={() => setVisible(false)} color="#d32f2f"/>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', width: '100%' },
  scrollContent: { alignItems: 'center', paddingTop: 10 },
  tituloSecao: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#475569' },
  resultado: { alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 10, width: '100%', backgroundColor: '#f8fafc' },
  foto: { width: 150, height: 100, borderRadius: 8 },
  textoPreco: { fontSize: 18, fontWeight: 'bold', marginTop: 5, color: '#16a34a' },
  pickerBox: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, backgroundColor: '#fff', marginBottom: 20, width: '100%', overflow: 'hidden' },
  pickerStyle: { width: '100%', height: 50 },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8fafc' },
  modalTitulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#1e293b' },
  resumoItem: { flexDirection: 'row', marginBottom: 12, width: '60%', justifyContent: 'space-between' },
  resumoLabel: { fontWeight: 'bold', color: '#475569' },
  totalBox: { marginTop: 20, marginBottom: 30, alignItems: 'center' },
  totalTexto: { fontSize: 16, color: '#64748b' },
  totalValor: { fontSize: 36, fontWeight: 'bold', color: '#16a34a' },
  btnVerHist: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#cbd5e1' },
  txtVerHist: { color: '#334155', fontWeight: 'bold' },
  headerHist: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 10 },
  cardHistPed: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  dateHistPed: { fontSize: 11, color: '#94a3b8', alignSelf: 'flex-end' },
  itemHistPed: { fontSize: 15, fontWeight: '500', color: '#1e293b' },
  totalHistPed: { fontSize: 14, color: '#16a34a', fontWeight: 'bold', marginTop: 4 }
});