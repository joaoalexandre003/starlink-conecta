import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.USE_PG_MEM = 'true'
process.env.JWT_SECRET = 'segredo_de_teste_com_mais_de_16_caracteres'
process.env.FRONTEND_URL = 'http://localhost:3000'

const { default: banco } = await import('../src/config/database.js')
await import('../src/models/index.js')
const { default: app } = await import('../src/app.js')
const { importarVagas } = await import('../src/services/importarVagas.js')

let servidor
let baseUrl

before(async () => {
  await banco.sync({ force: true })
  await importarVagas()

  await new Promise((resolve) => {
    servidor = app.listen(0, '127.0.0.1', () => {
      const endereco = servidor.address()
      baseUrl = `http://127.0.0.1:${endereco.port}/api`
      resolve()
    })
  })
})

after(async () => {
  if (servidor) {
    await new Promise((resolve) => servidor.close(resolve))
  }
  await banco.close()
})

async function requisitar(caminho, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const dados = await resposta.json()
  return { status: resposta.status, dados }
}

test('fluxo completo da API, autenticação e banco', async () => {
  const statusApi = await requisitar('')
  assert.equal(statusApi.status, 200)

  const health = await requisitar('/health')
  assert.equal(health.status, 200)
  assert.equal(health.dados.banco, 'conectado')

  const cadastroInvalido = await requisitar('/usuarios/cadastro', {
    method: 'POST',
    body: { nome: 'Teste', idade: 12, email: 'teste@empresa.com', senha: '123456', cargo: 'TI' }
  })
  assert.equal(cadastroInvalido.status, 400)

  const cadastro = await requisitar('/usuarios/cadastro', {
    method: 'POST',
    body: {
      nome: 'Ana Souza',
      idade: 28,
      email: 'ANA@EMPRESA.COM ',
      senha: '123456',
      cargo: 'Analista de Redes'
    }
  })
  assert.equal(cadastro.status, 201)
  assert.equal(cadastro.dados.usuario.email, 'ana@empresa.com')
  assert.ok(cadastro.dados.token)
  const tokenAna = cadastro.dados.token

  const duplicado = await requisitar('/usuarios/cadastro', {
    method: 'POST',
    body: {
      nome: 'Outra Ana',
      idade: 29,
      email: 'ana@empresa.com',
      senha: '123456',
      cargo: 'Suporte'
    }
  })
  assert.equal(duplicado.status, 409)

  const loginErrado = await requisitar('/usuarios/login', {
    method: 'POST',
    body: { email: 'ana@empresa.com', senha: 'senha-errada' }
  })
  assert.equal(loginErrado.status, 401)

  const login = await requisitar('/usuarios/login', {
    method: 'POST',
    body: { email: ' ANA@EMPRESA.COM ', senha: '123456' }
  })
  assert.equal(login.status, 200)

  const perfilSemToken = await requisitar('/usuarios/perfil')
  assert.equal(perfilSemToken.status, 401)

  const perfil = await requisitar('/usuarios/perfil', { token: tokenAna })
  assert.equal(perfil.status, 200)
  assert.equal(perfil.dados.nome, 'Ana Souza')

  const usuarios = await requisitar('/usuarios', { token: tokenAna })
  assert.equal(usuarios.status, 200)
  assert.equal(usuarios.dados.length, 1)

  const vagas = await requisitar('/vagas')
  assert.equal(vagas.status, 200)
  assert.equal(vagas.dados.length, 5)

  const vaga = await requisitar('/vagas/1')
  assert.equal(vaga.status, 200)
  assert.equal(vaga.dados.id, 1)

  const vagaInexistente = await requisitar('/vagas/999')
  assert.equal(vagaInexistente.status, 404)

  const postsSemToken = await requisitar('/posts')
  assert.equal(postsSemToken.status, 401)

  const postInvalido = await requisitar('/posts', {
    method: 'POST',
    token: tokenAna,
    body: { titulo: '   ', texto: '   ' }
  })
  assert.equal(postInvalido.status, 400)

  const post = await requisitar('/posts', {
    method: 'POST',
    token: tokenAna,
    body: { titulo: 'Aviso interno', texto: 'Reunião às 14h na sala de projetos.' }
  })
  assert.equal(post.status, 201)
  assert.equal(post.dados.curtidas, 0)

  const listaPosts = await requisitar('/posts', { token: tokenAna })
  assert.equal(listaPosts.status, 200)
  assert.equal(listaPosts.dados.length, 1)
  assert.equal(listaPosts.dados[0].autor.nome, 'Ana Souza')

  const curtida = await requisitar(`/posts/${post.dados.id}/curtir`, {
    method: 'POST',
    token: tokenAna
  })
  assert.equal(curtida.status, 200)
  assert.equal(curtida.dados.curtidas, 1)

  const curtidaDuplicada = await requisitar(`/posts/${post.dados.id}/curtir`, {
    method: 'POST',
    token: tokenAna
  })
  assert.equal(curtidaDuplicada.status, 409)

  const cadastroBruno = await requisitar('/usuarios/cadastro', {
    method: 'POST',
    body: {
      nome: 'Bruno Lima',
      idade: 31,
      email: 'bruno@empresa.com',
      senha: 'abcdef',
      cargo: 'Desenvolvedor'
    }
  })
  assert.equal(cadastroBruno.status, 201)

  const curtidaBruno = await requisitar(`/posts/${post.dados.id}/curtir`, {
    method: 'POST',
    token: cadastroBruno.dados.token
  })
  assert.equal(curtidaBruno.status, 200)
  assert.equal(curtidaBruno.dados.curtidas, 2)

  const usuariosDepois = await requisitar('/usuarios', { token: tokenAna })
  assert.equal(usuariosDepois.status, 200)
  assert.equal(usuariosDepois.dados.length, 2)

  const rotaInexistente = await requisitar('/nao-existe')
  assert.equal(rotaInexistente.status, 404)
})
