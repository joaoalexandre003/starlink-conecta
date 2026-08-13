# Roadmap de melhorias

## Melhoria já aplicada

**Autenticação com token (JWT) e senha criptografada.** O cadastro e o login não guardam a senha em
texto puro: ela é criptografada com `bcryptjs` antes de ser salva no banco. No login, o backend gera
um token JWT que o frontend armazena e envia em todas as requisições ao mural e à área protegida da
API, evitando que outras pessoas acessem posts ou publiquem em nome de alguém sem estar autenticadas.

## Próximas melhorias planejadas

1. **Sistema de comentários nos posts.** Permitir que colaboradores comentem nas publicações do
   mural, com uma nova tabela `comentarios` relacionada a `posts` e `usuarios`, seguindo o mesmo
   padrão de autenticação já usado nas curtidas.

2. **Perfil de usuário editável.** Criar uma página onde o colaborador possa atualizar seu cargo,
   trocar a senha e enviar uma foto de perfil, substituindo o avatar gerado apenas com a inicial do
   nome.

3. **Paginação e busca no mural.** Hoje o mural carrega todos os posts de uma vez. Com o crescimento
   da base de usuários, seria necessário paginar os resultados da rota `GET /api/posts` e permitir
   busca por título, evitando que a listagem fique lenta.
