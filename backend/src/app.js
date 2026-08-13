import express from 'express'
import cors from 'cors'
import banco from './config/database.js'
import './models/index.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import postRoutes from './routes/postRoutes.js'
import vagaRoutes from './routes/vagaRoutes.js'

const app = express()

function origensPermitidas() {
  const configuradas = process.env.FRONTEND_URL || 'http://localhost:3000'
  return configuradas
    .split(',')
    .map((origem) => origem.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

app.use(cors({
  origin(origem, callback) {
    if (!origem) {
      return callback(null, true)
    }

    const origemNormalizada = origem.replace(/\/$/, '')
    if (origensPermitidas().includes(origemNormalizada)) {
      return callback(null, true)
    }

    return callback(new Error('Origem não permitida pelo CORS.'))
  }
}))

app.use(express.json({ limit: '100kb' }))

app.get('/api', (req, res) => {
  return res.json({ mensagem: 'API da Starlink Conecta funcionando.' })
})

app.get('/api/health', async (req, res) => {
  try {
    await banco.authenticate()
    return res.json({ status: 'ok', banco: 'conectado' })
  } catch {
    return res.status(503).json({ status: 'erro', banco: 'indisponível' })
  }
})

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/vagas', vagaRoutes)

app.use((req, res) => {
  return res.status(404).json({ erro: 'Rota não encontrada.' })
})

app.use((erro, req, res, next) => {
  if (erro?.message === 'Origem não permitida pelo CORS.') {
    return res.status(403).json({ erro: erro.message })
  }

  console.error('Erro não tratado:', erro)
  return res.status(500).json({ erro: 'Erro interno do servidor.' })
})

export default app
