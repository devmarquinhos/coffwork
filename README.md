# Coffwork

Coffwork é um aplicativo focado em ajudar apreciadores de café a encontrar, avaliar e salvar cafeterias com base em suas experiências.

Em vez de avaliações genéricas de 1 a 5 estrelas, o app avalia o que realmente importa: a internet é boa para trabalhar? O ambiente é silencioso para estudar? O café especial vale o preço?

# Principais Funcionalidades

### 📱 Para os Usuários (Coffwork)

Review Progressivo: Uma experiência de avaliação fluida em 3 etapas com animações nativas, revelando critérios mais específicos com base no contexto da visita.

Detalhes da Cafeteria: Visualização de tags rápidas (Wi-Fi, Tomadas), métricas calculadas em tempo real e os destaques da casa.

Favoritos: Salve suas cafeterias preferidas.

### 🏢 Para os Proprietários (Painel Owner)

Gestão de Destaques: Faça upload de até 3 fotos diretamente da galeria para definir os destaques do estabelecimento.

Interação com Clientes: Visualize avaliações e responda aos comentários dos clientes diretamente pelo app.

# Stack Tecnológica

### Back-end (Beanio)

- Linguagem & Framework: Java 17+ com Spring Boot
- Dados & ORM: Spring Data JPA, Hibernate, PostgreSQL
- Segurança: Spring Security
- Arquitetura: RESTful API

### Front-end (Coffwork)

- Framework: React Native com Expo
- Linguagem: TypeScript
- Roteamento: Expo Router
- Estilização & UI: Wizard Design Pattern, Lucide Icons e Animated nativa do React Native.
- Gerenciamento de Estado: Zustand

# Arquitetura e Regras de Negócio Core

- Modelagem em volta de Contexto:
As avaliações são ligadas ao motivo da visita. Um usuário avaliando como Trabalho Remoto (REMOTE_WORK) dará notas para Velocidade do Wi-Fi e Disponibilidade de Tomadas, enquanto COFFEE_TASTING focará na Qualidade do Grão e Técnica do Barista.

- Cálculo de Média: O backend utiliza um bloco @Transactional no serviço de Review que recalcula a média e o total de avaliações da tabela CoffeeShop de forma segura e sempre que uma nova avaliação é criada.

- Prevenção de Spam (Regra de 1 Review/Dia):
A API bloqueia a submissão de múltiplas avaliações para a mesma cafeteria, sob o mesmo contexto, pelo mesmo usuário, no mesmo dia corrido.

# Como rodar o projeto localmente

### 1. Configurando o Back-end (Beanio)

```
# Clone o repositório
git clone https://github.com/seu-usuario/coffwork-beanio.git

# Entre na pasta do backend
cd coffwork-beanio/backend

# Configure as variáveis de ambiente no application.properties ou .env (Banco de dados, JWT Secret)
# Rode a aplicação com o Maven
./mvnw spring-boot:run
```

### 2. Configurando o Front-end (Coffwork)

```
# Entre na pasta do frontend
cd ../frontend

# Instale as dependências
npm install
# ou
yarn install

# Inicie o Expo
npx expo start
````

Lembre-se de apontar a `baseURL` do `api.ts` para o IP da sua máquina local rodando o Spring Boot. Configurando no `.env` como `EXPO_PUBLIC_API_URL`.
