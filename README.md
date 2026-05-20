## ⚙️ Como Instalar e Rodar o Projeto

Siga os passos abaixo para configurar o ambiente localmente e executar o aplicativo em seu emulador ou dispositivo físico.

### 1. Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
* **Node.js** (Versão LTS estável recomendada)
* **Git** (Para clonar o repositório)
* **Expo Go** instalado no seu celular (caso vá testar em um dispositivo físico) **ou** um emulador Android/iOS configurado no computador (como o Android Studio).

---

### 2. Clonar o Repositório
Abra o seu terminal, navegue até a pasta onde deseja salvar o projeto e execute o comando:
```bash
git clone [https://github.com/d-Jhon-b/Sistema_Integrado_de_Aplicacoes_com_Base_em_Navegacao-.git](https://github.com/d-Jhon-b/Sistema_Integrado_de_Aplicacoes_com_Base_em_Navegacao-.git)

# FATEC Hub - Sistema Integrado de Aplicações 🚀

O **FATEC Hub** é uma aplicação mobile multiplataforma desenvolvida como parte do curso de **Desenvolvimento de Software Multiplataforma (DSM)** na **Fatec Itaquera**. O projeto centraliza diversas ferramentas utilitárias e interativas em um único ecossistema fluido, utilizando uma arquitetura moderna e armazenamento local seguro.

---

## 📱 Funcionalidades Integradas

O ecossistema conta com as seguintes ferramentas internas, acessíveis tanto pelo menu lateral (Sidebar) quanto pelo painel de cards da Dashboard principal:

* **⚖️ Calculadora de IMC:** Permite calcular o Índice de Massa Corporal com base no peso e altura do usuário, exibindo classificações de saúde precisas.
* **🪙 Conversor de Moedas:** Integração de serviços para simulação e conversão de valores entre diferentes moedas estrangeiras.
* **🪐 Sistema Solar:** Catálogo astronômico interativo utilizando modais dinâmicos para explorar e exibir características detalhadas dos planetas.
* **🍔 Pedidos / Cardápio:** Interface para visualização de itens de cardápio e gerenciamento de simulação de pedidos locais.
* **👤 Minha Conta (Alterar Dados):** Módulo de gerenciamento de perfil que permite ao usuário alterar seu nome de exibição e credenciais diretamente no banco de dados local.

---

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído utilizando as melhores práticas de desenvolvimento com o ecossistema Expo e arquitetura baseada em serviços:

* **Frontend Mobile:** React Native, Expo (SDK atualizado), TypeScript.
* **Estilização:** StyleSheet nativo, com design adaptivo para acomodar barras de status (`StatusBar`), *notches* e recortes de câmera de dispositivos modernos.
* **Persistência de Dados:** Banco de dados local **SQLite** (via `expo-sqlite`), garantindo transações assíncronas rápidas e seguras.
* **Segurança:** Criptografia de senhas através de serviços dedicados de hashing (`hashToolsService`) antes do armazenamento no SQLite.
* **Multiplataforma:** Estrutura modular preparada com *fallbacks* específicos para execução em ambiente Web (`Platform.OS === 'web'`) e Nativo (Android/iOS).

---

## 🗄️ Estrutura do Banco de Dados Local (SQLite)

O aplicativo gerencia as seguintes tabelas estruturadas de forma automática na inicialização:

```sql
-- Tabela de Credenciais e Perfil de Usuários
CREATE TABLE IF NOT EXISTS LOGIN (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabela de Histórico de Pedidos Internos
CREATE TABLE IF NOT EXISTS HISTORICO_PEDIDOS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_email TEXT NOT NULL,
    itens TEXT NOT NULL,
    total REAL NOT NULL,
    data TEXT NOT NULL
);