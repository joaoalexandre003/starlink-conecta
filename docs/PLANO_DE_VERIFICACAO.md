# Plano de verificação

Este checklist foi atualizado para cobrir as funções que apresentavam erro e a integração completa entre frontend, backend e banco.

## Verificação automática

Executar na pasta `backend`:

```bash
npm install
npm test
```

A suíte `test/api.test.js` usa um PostgreSQL temporário em memória somente durante o teste e percorre cadastro, login, sessão, usuários, vagas, posts e curtidas.

Depois validar a compilação do frontend:

```bash
cd ../frontend
npm install
npm run build
```

Também é possível executar a verificação a partir da raiz:

```powershell
.\scripts\verificar-projeto.ps1
```

ou:

```bash
./scripts/verificar-projeto.sh
```

## Cadastro e login

- [ ] Cadastrar usuário com todos os campos.
- [ ] Confirmar que e-mail é salvo em minúsculas.
- [ ] Tentar repetir o mesmo e-mail e receber erro 409.
- [ ] Tentar idade menor que 16 e receber erro de validação.
- [ ] Tentar senha menor que 6 caracteres e receber erro.
- [ ] Fazer login com senha errada e receber 401.
- [ ] Fazer login correto e abrir o mural.
- [ ] Remover/alterar o token manualmente no navegador e atualizar a página; a sessão deve ser limpa.

## Página de usuários

- [ ] Sem login, acessar `/usuarios` e confirmar redirecionamento para `/login`.
- [ ] Com login, acessar `/usuarios` e confirmar que a tabela carrega.
- [ ] Confirmar que a senha não aparece na resposta nem na tela.
- [ ] Atualizar o navegador em `/usuarios` no deploy da Vercel e confirmar que a SPA continua abrindo.

## Mural

- [ ] Publicar título e mensagem válidos.
- [ ] Tentar publicar somente espaços e confirmar bloqueio.
- [ ] Confirmar que o post novo aparece no topo.
- [ ] Curtir um post e conferir contador.
- [ ] Tentar curtir novamente com a mesma conta e confirmar bloqueio.
- [ ] Entrar com uma segunda conta e confirmar que ela consegue curtir o mesmo post.

## Vagas

- [ ] Abrir `/vagas` sem login.
- [ ] Confirmar as cinco vagas do CSV.
- [ ] Consultar `GET /api/vagas/1`.
- [ ] Consultar ID inexistente e confirmar 404.
- [ ] Reiniciar backend e confirmar que os IDs não são duplicados; o serviço usa `upsert`.

## Banco de dados

- [ ] Abrir `GET /api/health` e conferir `banco: conectado`.
- [ ] Conferir tabela `usuarios` depois do cadastro.
- [ ] Conferir que `senha` contém hash e não o texto digitado.
- [ ] Conferir `posts.usuario_id`.
- [ ] Conferir `curtidas.post_id` e `curtidas.usuario_id`.
- [ ] Conferir a restrição única de `post_id + usuario_id`.
- [ ] Conferir a tabela `vagas` com os IDs do CSV.

## Produção

- [ ] Render usa Root Directory `backend`.
- [ ] Render usa `DATABASE_URL` do PostgreSQL.
- [ ] Render usa `FRONTEND_URL` com a URL da Vercel.
- [ ] Health Check Path é `/api/health`.
- [ ] Vercel usa Root Directory `frontend`.
- [ ] Vercel usa `VITE_API_URL=https://...onrender.com/api`.
- [ ] `frontend/vercel.json` está incluído no deploy.
- [ ] Cadastro funciona na URL pública.
- [ ] Página de usuários funciona na URL pública.
