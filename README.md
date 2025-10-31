# Sereni API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/NestJS-Framework-red?style=for-the-badge&logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-Language-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-ORM-darkgreen?style=for-the-badge&logo=prisma" alt="Prisma">
</p>

## 📝 Descrição

**Sereni API** é um serviço de backend para o aplicativo de saúde mental "Sereni". Este projeto, desenvolvido como parte da matéria de Projeto Integrador 2, tem como objetivo fornecer uma API robusta, segura e escalável para gerenciar usuários, seus registros de diário e o conteúdo educacional da plataforma.

A aplicação se divide em duas frentes:

1.  **Apoio ao Usuário:** Fornece ferramentas para que o usuário possa gerenciar sua ansiedade através de um diário de emoções e lições interativas (`FOR_USER`).
2.  **Rede de Apoio:** Oferece conteúdo educacional para amigos e familiares (`FOR_SUPPORTER`) sobre como lidar e ajudar pessoas em crise.

O sistema conta com autenticação baseada em JWT e um sistema de papéis (RBAC) para diferenciar usuários comuns de administradores de conteúdo.

## ✨ Principais Funcionalidades

  * **Autenticação Segura:** Sistema completo de registro (`POST /auth/register`) e login (`POST /auth/login`) com senhas criptografadas (bcrypt) e tokens de acesso (JWT).
  * **Controle de Acesso (RBAC):** Sistema de papéis (`USER` e `ADMIN`) que protege endpoints sensíveis, garantindo que apenas administradores possam criar conteúdo.
  * **Módulo de Diário:** Endpoints para que usuários criem (`POST /journal`) e listem (`GET /journal`) suas entradas de diário de forma privada e segura.
  * **Módulo de Conteúdo (Admin):** Endpoint de administração (`POST /content/modules`) para criar novos módulos de aprendizado.
  * **Módulo de Conteúdo (Usuário):** Endpoint para o aplicativo consumir os módulos de conteúdo (`GET /content/modules`), com filtros por tipo.
  * **Health Check:** Endpoints de monitoramento (`/health/live` e `/health/ready`) para verificar o status do serviço e sua conexão com o banco de dados.

## 🛠️ Stack de Tecnologias

  * **Framework:** **NestJS**
  * **Linguagem:** **TypeScript**
  * **Banco de Dados:** **PostgreSQL**
  * **ORM:** **Prisma**
  * **Autenticação:** **Passport** com estratégia **JWT**
  * **Validação:** **class-validator** e **class-transformer**

## 🚀 Setup

Para rodar este projeto localmente, você precisará ter o [Node.js (\>= 18)](https://nodejs.org/), `npm` (ou `yarn`) e uma instância do **PostgreSQL** rodando na sua máquina.

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/sereni-api.git

# 2. Entre na pasta do projeto
cd sereni-api

# 3. Instale as dependências
npm install

# 4. (Recomendado) Instale o módulo de configuração do NestJS
npm install @nestjs/config
```

### Configuração do Ambiente

O projeto usa variáveis de ambiente para configurar o banco de dados e a segurança.

1.  Crie um arquivo `.env` na raiz do projeto.

2.  Copie e cole o conteúdo abaixo, substituindo com suas credenciais:

    ```.env
    # URL de conexão do seu banco de dados PostgreSQL
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/sereni_db?schema=public"

    # Chave secreta longa e aleatória para assinar os tokens JWT
    JWT_SECRET="COLOQUE_UM_SEGREDO_FORTE_AQUI"

    # Porta em que o servidor irá rodar
    PORT=3000
    ```
    
### Sobre o Banco de Dados

Com seu arquivo `.env` configurado, aplique o schema do Prisma no seu banco de dados PostgreSQL.

```bash
# Este comando irá ler o schema.prisma e criar todas as tabelas e tipos
npx prisma migrate dev
```

### Criar um Usuário Admin

O sistema de RBAC requer um usuário `ADMIN` para criar conteúdo.

1.  Cadastre um novo usuário normalmente via `POST /auth/register`.
2.  Abra seu cliente de banco de dados (DBeaver, Postico, etc.).
3.  Execute o seguinte comando SQL para promover seu usuário:
    ```sql
    UPDATE "users"
    SET "role" = 'ADMIN'
    WHERE "email" = 'seu-email-de-admin@exemplo.com';
    ```

## 🏃‍♀️ Rodando a Aplicação

```bash
# Modo de desenvolvimento (com hot-reload)
npm run start:dev

# Modo de produção
npm run build
npm run start:prod
```

Seu servidor estará disponível em `http://localhost:3000`.

## 🧱 Endpoints da API

Aqui está um resumo das rotas disponíveis na API.

| Rota | Método HTTP | Protegido? | Role | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `/health/live` | `GET` | Não | - | Verifica se o serviço está rodando. |
| `/health/ready` | `GET` | Não | - | Verifica a conexão com o banco de dados. |
| `/auth/register` | `POST` | Não | - | Registra um novo usuário (padrão: `USER`). |
| `/auth/login` | `POST` | Não | - | Autentica um usuário e retorna um JWT. |
| `/journal` | `POST` | **Sim** | `USER` | Cria uma nova entrada no diário para o usuário logado. |
| `/journal` | `GET` | **Sim** | `USER` | Lista todas as entradas do diário do usuário logado (Query: `?sort=asc|desc`). |
| `/content/modules` | `GET` | **Sim** | `USER`/`ADMIN` | Lista os módulos de conteúdo (Query: `?type=FOR_USER|FOR_SUPPORTER`). |
| `/content/modules` | `POST` | **Sim** | `ADMIN` | **[ADMIN]** Cria um novo módulo de conteúdo. |

## 📜 Licença

Este projeto possui a licença MIT.
