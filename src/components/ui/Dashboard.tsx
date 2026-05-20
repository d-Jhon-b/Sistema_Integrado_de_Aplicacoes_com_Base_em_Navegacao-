import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';

interface DashboardProps {
  userEmail: string;
  activeSubScreen: string | null;
  onChangeSubScreen: (sub: string | null) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Dashboard({ userEmail, activeSubScreen, onChangeSubScreen, onLogout, children }: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Início', target: null, icon: '🏠' },
    { label: 'Calculadora IMC', target: 'IMC', icon: '⚖️' },
    { label: 'Conversor de Moedas', target: 'Moedas', icon: '🪙' },
    { label: 'Sistema Solar', target: 'Planetas', icon: '🪐' },
    { label: 'Pedidos / Cardápio', target: 'Pedidos', icon: '🍔' },
    { label: 'Minha Conta', target: 'Perfil', icon: '👤' }, 
  ];

  const handleMenuClick = (target: string | null) => {
    onChangeSubScreen(target);
    setMobileMenuOpen(false); 
  };

  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isWeb && (
            <TouchableOpacity style={styles.menuToggleButton} onPress={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Text style={styles.menuToggleText}>{mobileMenuOpen ? '✕' : '☰'}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>FATEC <Text style={{ fontWeight: '300' }}>Hub</Text></Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userBadge}>{userEmail.split('@')[0]}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutBtnText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {(isWeb || mobileMenuOpen) && (
          <View style={[styles.sidebar, !isWeb && styles.sidebarMobile]}>
            <Text style={styles.sidebarSectionTitle}>Aplicações</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.sidebarItem, activeSubScreen === item.target && styles.sidebarItemActive]}
                onPress={() => handleMenuClick(item.target)}
              >
                <Text style={styles.sidebarItemText}>{item.icon}  {item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView contentContainerStyle={styles.mainContent}>
          {activeSubScreen ? (
            <View style={styles.cardContainer}>
              <TouchableOpacity style={styles.backToHomeBtn} onPress={() => onChangeSubScreen(null)}>
                <Text style={styles.backToHomeText}>← Voltar para a Home</Text>
              </TouchableOpacity>
              {children}
            </View>
          ) : (
            <View>
              <Text style={styles.welcomeText}>Olá! O que vamos fazer hoje?</Text>
              <Text style={styles.subWelcomeText}>Selecione uma das suas ferramentas integradas:</Text>
              
              <View style={styles.gridContainer}>
                {menuItems.filter(i => i.target !== null).map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.appCard} onPress={() => onChangeSubScreen(item.target)}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                    <Text style={styles.cardActionText}>Abrir Ferramenta →</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  
  header: { 
    backgroundColor: '#005088', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3,
    paddingTop: Platform.OS === 'ios' ? 25 : (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    height: Platform.OS === 'ios' ? 75 : (Platform.OS === 'android' ? 65 + (StatusBar.currentHeight ?? 0) : 65)
  },
  
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuToggleButton: { marginRight: 15, padding: 5 },
  menuToggleText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userBadge: { color: '#005088', backgroundColor: '#e1f0fa', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontSize: 13, fontWeight: 'bold', marginRight: 10 },
  logoutBtn: { padding: 5 },
  logoutBtnText: { color: '#ffbcbc', fontSize: 14, fontWeight: '500' },
  body: { flex: 1, flexDirection: Platform.OS === 'web' ? 'row' : 'column' },
  sidebar: { width: 260, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#dbe3ec', padding: 15 },
  
  sidebarMobile: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, width: '100%', height: '100%' },
  
  sidebarSectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 10 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 5 },
  sidebarItemActive: { backgroundColor: '#e1f0fa' },
  sidebarItemText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  mainContent: { flexGrow: 1, padding: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  subWelcomeText: { fontSize: 15, color: '#64748b', marginBottom: 25 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'flex-start' },
  appCard: { width: Platform.OS === 'web' ? '48%' : '100%', minWidth: 280, backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardIcon: { fontSize: 32, marginBottom: 12 },
  cardLabel: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
  cardActionText: { fontSize: 13, color: '#005088', fontWeight: '600', marginTop: 10 },
  cardContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  backToHomeBtn: { alignSelf: 'flex-start', marginBottom: 20, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#f1f5f9' },
  backToHomeText: { color: '#475569', fontSize: 13, fontWeight: '600' }
});