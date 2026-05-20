import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar 
} from 'react-native';

interface Astro {
  nome: string;
  tipo: string;
  distancia: string;
  imagem: string;
  descricao: string;
}

export default function Planetas() {
  const [astroSelecionado, setAstroSelecionado] = useState<Astro | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const sistemaSolar: Astro[] = [
    {
      nome: "Sol",
      tipo: "Estrela",
      distancia: "Centro do Sistema",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
      descricao: "O Sol é a estrela central do Sistema Solar. Todos os outros corpos, como planetas, asteroides e cometas, giram ao seu redor. Ele é composto principalmente de Hidrogênio e Hélio."
    },
    {
      nome: "Mercúrio",
      tipo: "Planeta Rochoso",
      distancia: "57,9 milhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
      descricao: "O menor planeta do sistema solar e o mais próximo do Sol. Sua superfície é repleta de crateras, lembrando a nossa Lua."
    },
    {
      nome: "Vênus",
      tipo: "Planeta Rochoso",
      distancia: "108,2 milhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Venus_2_Approach_Image.jpg",
      descricao: "Possui uma atmosfera tão densa que retém o calor em um efeito estufa constante, tornando-o o planeta mais quente do sistema."
    },
    {
      nome: "Terra",
      tipo: "Planeta Rochoso",
      distancia: "149,6 milhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
      descricao: "O único planeta conhecido por abrigar vida. Cerca de 70% da sua superfície é coberta por oceanos de água líquida."
    },
    {
      nome: "Marte",
      tipo: "Planeta Rochoso",
      distancia: "227,9 milhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      descricao: "Chamado de Planeta Vermelho devido à ferrugem em seu solo. É o destino principal das futuras missões de exploração humana."
    },
    {
      nome: "Júpiter",
      tipo: "Gigante Gasoso",
      distancia: "778,5 milhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
      descricao: "O maior planeta do sistema solar. Sua Grande Mancha Vermelha é, na verdade, uma tempestade gigante que dura centenas de anos."
    },
    {
      nome: "Saturno",
      tipo: "Gigante Gasoso",
      distancia: "1,4 bilhão km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
      descricao: "Famoso por seus anéis deslumbrantes compostos de bilhões de pedaços de gelo, poeira e rochas."
    },
    {
      nome: "Urano",
      tipo: "Gigante de Gelo",
      distancia: "2,8 bilhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
      descricao: "Um planeta gelado que tem a característica única de girar de lado, quase como uma bola rolando em sua órbita."
    },
    {
      nome: "Netuno",
      tipo: "Gigante de Gelo",
      distancia: "4,5 bilhões km",
      imagem: "https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_Full.jpg",
      descricao: "O planeta mais distante do Sol. É um mundo gelado e azul, com ventos que podem atingir mais de 2.000 km/h."
    }
  ];

  const exibirDetalhes = (astro:any) => {
    setAstroSelecionado(astro);
    setModalVisivel(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Text style={styles.headerTitle}>SISTEMA SOLAR</Text>
      <Text style={styles.headerSubtitle}>Toque para explorar cada corpo celeste</Text>

      <ScrollView contentContainerStyle={styles.scrollList}>
        {sistemaSolar.map((astro, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.card, 
              astro.nome === "Sol" ? styles.cardSol : styles.cardPlaneta
            ]}
            onPress={() => exibirDetalhes(astro)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.cardTextNome}>{astro.nome}</Text>
              <Text style={styles.cardTextTipo}>{astro.tipo}</Text>
            </View>
            <Text style={styles.seta}>➔</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisivel}
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        {astroSelecionado && (
          <View style={styles.modalFull}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              
              <TouchableOpacity 
                style={styles.botaoFechar} 
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.textoBotaoFechar}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitulo}>{astroSelecionado.nome}</Text>
              
              <Image 
                source={{ uri: astroSelecionado.imagem }} 
                style={styles.modalImagem} 
                resizeMode="contain"
              />

              <View style={styles.modalInfoCard}>
                <Text style={styles.infoLabel}>Categoria:</Text>
                <Text style={styles.infoValor}>{astroSelecionado.tipo}</Text>

                <View style={styles.divisor} />

                <Text style={styles.infoLabel}>Distância média do Sol:</Text>
                <Text style={styles.infoValor}>{astroSelecionado.distancia}</Text>

                <View style={styles.divisor} />

                <Text style={styles.infoLabel}>Sobre:</Text>
                <Text style={styles.infoDescricao}>{astroSelecionado.descricao}</Text>
              </View>

            </ScrollView>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', 
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fbbf24', 
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollList: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 5,
  },
  cardSol: {
    backgroundColor: '#b45309',
    borderLeftWidth: 8,
    borderLeftColor: '#fbbf24',
  },
  cardPlaneta: {
    backgroundColor: '#1e293b',
    borderLeftWidth: 8,
    borderLeftColor: '#38bdf8',
  },
  cardTextNome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardTextTipo: {
    color: '#cbd5e1',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  seta: {
    color: '#fff',
    fontSize: 20,
  },
  modalFull: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  modalScroll: {
    alignItems: 'center',
    padding: 20,
  },
  botaoFechar: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e293b',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoFechar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  modalImagem: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  modalInfoCard: {
    backgroundColor: '#1e293b',
    width: '100%',
    padding: 25,
    borderRadius: 20,
  },
  infoLabel: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValor: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
  infoDescricao: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  divisor: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  }
});