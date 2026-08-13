# Plano de implantação

## Arquitetura adotada

- Frontend React/Vite: Vercel.
- Backend Node/Express: Render Web Service.
- Banco: Render PostgreSQL.
- Repositório: GitHub com frontend e backend no mesmo repositório.

## Configuração de produção preparada no código

### Backend

A conexão de produção usa `DATABASE_URL` quando essa variável existe. O servidor lê `PORT` da plataforma, escuta em `0.0.0.0` e expõe `/api/health` para o health check.

Variáveis:

```text
NODE_ENV=production
NODE_VERSION=22
DATABASE_URL=<internal database URL>
JWT_SECRET=<segredo>
FRONTEND_URL=<origem da Vercel>
```

### Frontend

A URL do backend é definida no momento do build:

```text
VITE_API_URL=https://SEU-BACKEND.onrender.com/api
```

O arquivo `frontend/vercel.json` reescreve rotas do React Router para `index.html`, evitando 404 ao atualizar páginas internas.

## Ordem recomendada

1. Subir código no GitHub.
2. Criar PostgreSQL no Render.
3. Criar Web Service do backend com Root Directory `backend`.
4. Confirmar `/api/health`.
5. Criar projeto Vercel com Root Directory `frontend`.
6. Configurar `VITE_API_URL` e publicar.
7. Copiar URL final da Vercel.
8. Atualizar `FRONTEND_URL` no Render.
9. Refazer testes de cadastro, login, mural, usuários e vagas.

## Evidências para anexar na entrega

- print do PostgreSQL criado no Render sem expor senha;
- print do backend com status Live;
- print de `/api/health`;
- print das variáveis mostrando apenas os nomes, escondendo segredos;
- print da configuração Vercel com Root Directory e variável `VITE_API_URL`;
- print da aplicação publicada;
- URLs finais do frontend e backend.
