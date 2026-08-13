# Starlink Conecta

## Title and Description

**Starlink Conecta** é uma aplicação web acadêmica feita para simular uma rede interna de comunicação entre colaboradores. O sistema possui uma área pública, com apresentação do projeto e consulta de vagas, e uma área autenticada, onde o usuário acessa o mural, publica avisos, curte publicações e consulta os colaboradores cadastrados.

O projeto foi separado em frontend, backend e banco de dados. O frontend foi desenvolvido em React com Vite. O backend usa Node.js, Express e Sequelize. A persistência é feita em PostgreSQL. A autenticação usa JWT e as senhas são armazenadas com hash do bcrypt.

Nesta revisão também foram corrigidos os pontos que estavam causando falhas no cadastro e na página de usuários. A URL da API deixou de ficar fixa em `localhost`, o backend passou a aceitar `DATABASE_URL` para produção, foi criada a rota real de listagem de usuários, a sessão passou a ser validada no backend ao abrir o site e foi incluída uma configuração de SPA para evitar erro ao atualizar páginas internas na Vercel.

### Funções disponíveis

- cadastro de usuário;
- login com e-mail e senha;
- restauração e validação da sessão com JWT;
- listagem de usuários cadastrados;
- criação de posts no mural;
- listagem de posts com autor e quantidade de curtidas;
- uma curtida por usuário em cada post;
- listagem pública de vagas;
- consulta de uma vaga pelo ID;
- importação/sincronização das vagas a partir de CSV;
- rota de saúde da aplicação e do banco de dados.

## Tecnologias utilizadas

### Frontend

- React 18;
- React Router DOM;
- Axios;
- Vite;
- CSS próprio, sem biblioteca visual externa.

### Backend

- Node.js;
- Express;
- Sequelize;
- PostgreSQL (`pg`);
- JSON Web Token (`jsonwebtoken`);
- `bcryptjs`;
- `csv-parse`.

### Testes

- `node:test`, que já faz parte do Node.js;
- `pg-mem` somente como dependência de desenvolvimento para criar um PostgreSQL temporário durante os testes automatizados.

O `pg-mem` não substitui o PostgreSQL usado no projeto. Ele serve apenas para a suíte de testes conseguir criar tabelas, cadastrar registros e validar as rotas sem alterar o banco real do desenvolvedor.

## Estrutura do projeto

```text
starlink_conecta/
├── backend/
│   ├── data/
│   │   └── vagas.csv
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── postController.js
│   │   │   ├── usuarioController.js
│   │   │   └── vagaController.js
│   │   ├── middlewares/
│   │   │   └── autenticacao.js
│   │   ├── models/
│   │   │   ├── Curtida.js
│   │   │   ├── Post.js
│   │   │   ├── Usuario.js
│   │   │   ├── Vaga.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── postRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   └── vagaRoutes.js
│   │   ├── services/
│   │   │   └── importarVagas.js
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   │   └── api.test.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── RotaProtegida.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Cadastro.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NaoEncontrado.jsx
│   │   │   ├── Usuarios.jsx
│   │   │   └── Vagas.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── .env.example
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
├── banco/
│   ├── criar_banco.sql
│   └── estrutura.sql
├── docs/
├── scripts/
│   ├── verificar-projeto.ps1
│   └── verificar-projeto.sh
├── render.yaml
└── README.md
```

## Como o banco de dados foi implementado

A conexão fica em `backend/src/config/database.js`. Em ambiente local o arquivo lê `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`. Em produção, se existir a variável `DATABASE_URL`, o Sequelize usa essa string diretamente. Isso evita ter que desmontar a URL do PostgreSQL do Render em várias variáveis.

Os models do Sequelize representam as quatro tabelas do projeto:

### `usuarios`

- `id`: chave primária e auto incremento;
- `nome`: nome do colaborador;
- `idade`: idade informada no cadastro;
- `email`: único no banco;
- `senha`: hash gerado pelo bcrypt;
- `cargo`: cargo do colaborador;
- `criado_em`: data de criação.

### `posts`

- `id`: chave primária;
- `titulo`;
- `texto`;
- `usuario_id`: chave estrangeira para `usuarios`;
- `criado_em`.

### `curtidas`

- `id`: chave primária;
- `post_id`: chave estrangeira para `posts`;
- `usuario_id`: chave estrangeira para `usuarios`;
- restrição única em `post_id + usuario_id`.

A restrição composta é importante porque ela garante no próprio banco que o mesmo usuário não consiga inserir duas curtidas no mesmo post, mesmo se houver duas requisições quase ao mesmo tempo.

### `vagas`

- `id`;
- `titulo`;
- `descricao`;
- `salario`;
- `data_limite`.

Ao iniciar o backend, `server.js` executa `banco.sync()` para conferir/criar as tabelas e depois chama `importarVagas()`. O serviço lê `backend/data/vagas.csv`, converte a data do formato `dd/mm/aaaa` para o formato aceito pelo banco e usa `upsert` para manter os registros do CSV sincronizados pelo ID.

O arquivo `banco/estrutura.sql` contém o SQL equivalente à modelagem. Ele não precisa ser executado se o projeto estiver sendo iniciado pelo Sequelize, mas foi incluído para documentar a implantação do banco e facilitar a conferência pelo professor.

## Installation

### Pré-requisitos

- Node.js 18 ou superior. O projeto foi preparado para Node 22;
- npm;
- PostgreSQL 14 ou superior para o ambiente local;
- Git, caso o projeto seja enviado para GitHub e publicado na Vercel/Render.

### 1. Criar o banco local

No `psql` ou no pgAdmin, execute:

```sql
CREATE DATABASE starlink_conecta;
```

O comando também está no arquivo:

```text
banco/criar_banco.sql
```

### 2. Instalar o backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

**Linux/macOS:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Depois ajuste os dados do PostgreSQL:

```env
PORT=5000
JWT_SECRET=uma_chave_local_com_mais_de_16_caracteres
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starlink_conecta
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
```

### 3. Instalar o frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

A variável `VITE_API_URL` é usada em `frontend/src/api.js`. Em produção ela deve receber a URL pública do backend no Render terminando em `/api`.

## Run Locally

Abra dois terminais.

### Terminal 1 - backend

```bash
cd backend
npm run dev
```

A API ficará em:

```text
http://localhost:5000/api
```

Para conferir se a API e o banco estão respondendo:

```text
http://localhost:5000/api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "banco": "conectado"
}
```

### Terminal 2 - frontend

```bash
cd frontend
npm run dev
```

Abra:

```text
http://localhost:3000
```

### Fluxo manual para conferir o sistema

1. Acesse `/cadastro` e crie uma conta.
2. O cadastro salva o usuário no PostgreSQL, gera o token JWT e redireciona para o mural.
3. Publique um post.
4. Curta o post e confirme que o botão fica bloqueado para uma segunda curtida da mesma conta.
5. Abra `/usuarios` e confirme que a conta aparece na tabela.
6. Saia da conta e faça login novamente.
7. Abra `/vagas` sem login e confira os registros vindos do CSV.

## Testes automatizados

O backend possui uma suíte de integração em `backend/test/api.test.js`.

Ela valida em sequência:

- status da API;
- conexão com o banco;
- validação de idade no cadastro;
- cadastro válido;
- normalização de e-mail;
- bloqueio de e-mail duplicado;
- login inválido e válido;
- rota de perfil com e sem token;
- página/rota de usuários;
- lista e busca de vagas;
- bloqueio de posts sem autenticação;
- criação de post;
- listagem do mural;
- curtida;
- bloqueio de curtida duplicada;
- curtida do mesmo post por um segundo usuário;
- rota inexistente.

Para executar:

```bash
cd backend
npm install
npm test
```

Também existem dois scripts na raiz que executam os testes do backend e depois o build do frontend:

**Windows PowerShell:**

```powershell
.\scripts\verificar-projeto.ps1
```

**Linux/macOS:**

```bash
./scripts/verificar-projeto.sh
```

## API Reference

URL local base:

```text
http://localhost:5000/api
```

Em produção, substitua pelo domínio criado no Render.

### Status da API

```http
GET /api
```

Não exige autenticação.

### Health check

```http
GET /api/health
```

Não exige autenticação. Também verifica se o Sequelize consegue responder pelo PostgreSQL.

### Cadastrar usuário

```http
POST /api/usuarios/cadastro
```

Body:

```json
{
  "nome": "Ana Souza",
  "idade": 28,
  "email": "ana@empresa.com",
  "senha": "123456",
  "cargo": "Analista de Redes"
}
```

Regras aplicadas no backend:

- todos os campos são obrigatórios;
- idade entre 16 e 100 anos;
- senha com pelo menos 6 caracteres;
- o e-mail é convertido para minúsculas e não pode se repetir.

Resposta de sucesso (`201`):

```json
{
  "token": "JWT_GERADO_PELO_BACKEND",
  "usuario": {
    "id": 1,
    "nome": "Ana Souza",
    "idade": 28,
    "email": "ana@empresa.com",
    "cargo": "Analista de Redes"
  }
}
```

### Login

```http
POST /api/usuarios/login
```

Body:

```json
{
  "email": "ana@empresa.com",
  "senha": "123456"
}
```

A senha é comparada com o hash armazenado no banco usando `bcrypt.compare()`.

### Perfil logado

```http
GET /api/usuarios/perfil
Authorization: Bearer <token>
```

Essa rota também é usada pelo `AuthContext` quando a aplicação abre. Assim, o frontend não confia somente no conteúdo antigo do `localStorage`: ele confirma com o backend se o token ainda é válido.

### Listar usuários

```http
GET /api/usuarios
Authorization: Bearer <token>
```

A rota retorna somente dados de apresentação. A coluna `senha` nunca é enviada para o frontend.

### Listar posts

```http
GET /api/posts
Authorization: Bearer <token>
```

Cada item retorna os dados do autor, total de curtidas e `curtidaDoMeuId`, usado pelo React para saber se deve bloquear o botão de curtida.

### Criar post

```http
POST /api/posts
Authorization: Bearer <token>
```

Body:

```json
{
  "titulo": "Aviso interno",
  "texto": "Reunião às 14h na sala de projetos."
}
```

### Curtir post

```http
POST /api/posts/:id/curtir
Authorization: Bearer <token>
```

Se o mesmo usuário tentar curtir o mesmo post novamente, a API retorna `409`.

### Listar vagas

```http
GET /api/vagas
```

Rota pública.

### Buscar vaga

```http
GET /api/vagas/:id
```

Rota pública. Retorna `404` quando o ID não existe.

## Integração frontend e backend

O frontend não possui mais a URL `http://localhost:5000/api` fixa para todos os ambientes. O arquivo `frontend/src/api.js` lê:

```text
VITE_API_URL
```

Se a variável não existir, apenas no desenvolvimento ele usa `http://localhost:5000/api` como padrão.

O Axios também insere o token automaticamente nas chamadas autenticadas:

```text
Authorization: Bearer <token>
```

No backend, o middleware `autenticacao.js` valida o token antes de liberar mural, perfil e lista de usuários.

## Implantação no Render - backend e PostgreSQL

O repositório é um monorepo. Por isso, no Render o backend precisa ter `backend` definido como **Root Directory**. Dessa forma os comandos `npm install` e `npm start` são executados na pasta correta.

### 1. Enviar o projeto para o GitHub

Na raiz `starlink_conecta`:

```bash
git init
git add .
git commit -m "Projeto Starlink Conecta"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

### 2. Criar o PostgreSQL no Render

No painel do Render:

1. clique em **New**;
2. escolha **Postgres**;
3. use um nome como `starlink-conecta-db`;
4. escolha a mesma região que será usada pelo backend;
5. crie o banco;
6. depois de criado, copie a **Internal Database URL**.

A URL tem este formato:

```text
postgresql://usuario:senha@host:5432/banco
```

No código, essa URL será recebida na variável `DATABASE_URL`.

### 3. Criar o Web Service do backend

No Render:

1. clique em **New > Web Service**;
2. conecte o mesmo repositório do GitHub;
3. Branch: `main`;
4. Root Directory: `backend`;
5. Runtime/Language: `Node`;
6. Build Command: `npm install`;
7. Start Command: `npm start`;
8. Health Check Path: `/api/health`.

Variáveis de ambiente do backend:

```text
NODE_ENV=production
NODE_VERSION=22
DATABASE_URL=<Internal Database URL do PostgreSQL>
JWT_SECRET=<chave longa e aleatória>
FRONTEND_URL=<URL final do frontend na Vercel>
```

O `server.js` usa a porta enviada pelo próprio Render através de `process.env.PORT` e o servidor escuta em `0.0.0.0`, o que permite que o serviço receba as requisições externas da plataforma.

Na primeira inicialização bem-sucedida, a sequência é:

1. `banco.authenticate()` testa a conexão;
2. `banco.sync()` cria as tabelas que ainda não existem;
3. `importarVagas()` lê o CSV e executa `upsert` das vagas;
4. o Express começa a escutar a porta do Render.

Depois do deploy, teste no navegador:

```text
https://SEU-BACKEND.onrender.com/api/health
```

O retorno deve informar `status: ok` e `banco: conectado`.

### Arquivo `render.yaml`

Na raiz do projeto existe um `render.yaml`. Ele deixa documentados os mesmos parâmetros do deploy: serviço Node com `rootDir: backend`, health check, banco PostgreSQL, `DATABASE_URL` ligada ao banco e geração automática do `JWT_SECRET`.

O deploy também pode ser feito manualmente pelo painel. O arquivo foi mantido porque demonstra de forma objetiva como a infraestrutura foi configurada.

## Implantação na Vercel - frontend

### 1. Importar o repositório

No painel da Vercel:

1. clique em **Add New > Project**;
2. importe o repositório do GitHub;
3. em **Root Directory**, selecione `frontend`;
4. use o preset do Vite;
5. Build Command: `npm run build`;
6. Output Directory: `dist`.

### 2. Configurar a API do Render

Antes do primeiro deploy, adicione a variável:

```text
VITE_API_URL=https://SEU-BACKEND.onrender.com/api
```

Essa variável é incorporada ao build do Vite e usada pelo Axios em `src/api.js`.

### 3. Publicar

Clique em **Deploy**. Quando a Vercel terminar, ela fornecerá uma URL parecida com:

```text
https://starlink-conecta.vercel.app
```

O arquivo `frontend/vercel.json` contém a regra de reescrita para a SPA. Ela é necessária para páginas do React Router como `/usuarios`, `/login` e `/vagas` continuarem abrindo quando o endereço é digitado diretamente ou quando o navegador é atualizado.

### 4. Voltar ao Render e liberar a origem correta

Depois de obter a URL final da Vercel, volte às variáveis do backend no Render e defina:

```text
FRONTEND_URL=https://starlink-conecta.vercel.app
```

Salve a alteração e faça um novo deploy/restart do backend. O CORS do Express compara a origem da requisição com essa variável. Se ela ficar com uma URL antiga, o navegador bloqueia cadastro, login, mural e usuários mesmo que a API esteja online.

## Checklist depois do deploy

- abrir a URL do frontend;
- abrir `/vagas` sem login;
- criar uma conta nova;
- confirmar o redirecionamento para o mural;
- publicar um post;
- curtir o post;
- abrir `/usuarios`;
- atualizar o navegador ainda em `/usuarios` e confirmar que não aparece 404;
- sair e entrar novamente;
- abrir a URL `/api/health` do Render;
- conferir os logs do backend para garantir que não existem erros de banco ou CORS.

## Problemas que foram tratados nesta revisão

### Cadastro dava erro

Havia três pontos que podiam causar esse comportamento:

1. o frontend sempre chamava `http://localhost:5000/api`, inclusive quando publicado;
2. o backend dependia apenas das variáveis separadas do PostgreSQL e não aceitava `DATABASE_URL` diretamente;
3. a aplicação não validava de forma clara configuração ausente de JWT/banco.

A configuração foi alterada para separar ambiente local e produção e retornar erros de validação mais claros.

### Página de usuários dava erro

No projeto anterior não existia uma página de usuários funcional nem uma rota `GET /api/usuarios`. A funcionalidade foi implementada nos dois lados:

- backend: `listarUsuarios()` em `usuarioController.js` e rota autenticada em `usuarioRoutes.js`;
- frontend: `pages/Usuarios.jsx`, rota `/usuarios` e link no cabeçalho quando existe sessão.

Além disso, foi incluído `vercel.json` para que atualizar `/usuarios` na Vercel não gere uma página 404 da hospedagem.

### Sessão antiga parecia estar logada, mas as chamadas falhavam

O frontend guardava o usuário no `localStorage` e aceitava esse conteúdo sem conferir o token. Agora, ao abrir a aplicação, o `AuthContext` chama `/api/usuarios/perfil`. Se o token estiver inválido ou expirado, a sessão local é removida.

## Support

Se alguma função falhar, faça as verificações abaixo antes de alterar código.

### Erro de rede no cadastro/login

Confira `frontend/.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

Em produção, a URL deve ser a do Render e deve terminar em `/api`.

### Backend não inicia

Confira `backend/.env`, principalmente:

```text
JWT_SECRET
DB_HOST / DB_NAME / DB_USER / DB_PASSWORD
```

ou `DATABASE_URL` em produção.

### `/api/health` retorna 503

O Express está respondendo, mas a conexão com o PostgreSQL falhou. Confira credenciais, host, porta, disponibilidade do banco e a variável `DATABASE_URL`.

### O navegador mostra erro de CORS

Confira se `FRONTEND_URL` no backend é exatamente a origem usada no navegador, sem caminho adicional. Exemplo correto:

```text
https://starlink-conecta.vercel.app
```

Exemplo incorreto:

```text
https://starlink-conecta.vercel.app/usuarios
```

### Atualizar `/usuarios` na Vercel mostra 404

Confira se `frontend/vercel.json` está dentro da pasta definida como Root Directory da Vercel e faça um novo deploy.

## Observação para entrega acadêmica

Os passos de Vercel e Render acima estão documentados de acordo com a configuração real preparada no código. Para comprovar a implantação no relatório final, depois de fazer o deploy inclua as URLs reais geradas pelas plataformas e prints do painel/logs. Não use URLs de exemplo como se fossem o endereço final do trabalho.
