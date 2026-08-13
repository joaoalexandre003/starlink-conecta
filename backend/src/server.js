import 'dotenv/config'
import app from './app.js'
import banco from './config/database.js'
import { importarVagas } from './services/importarVagas.js'

const porta = Number(process.env.PORT || 5000)

function validarAmbiente() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    throw new Error('JWT_SECRET não configurado ou muito curto. Use pelo menos 16 caracteres.')
  }

  const temUrl = Boolean(process.env.DATABASE_URL)
  const temConfiguracaoLocal = Boolean(
    process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST
  )

  if (!temUrl && !temConfiguracaoLocal && process.env.USE_PG_MEM !== 'true') {
    throw new Error('Configure DATABASE_URL ou as variáveis DB_HOST, DB_NAME e DB_USER.')
  }
}

async function iniciar() {
  try {
    validarAmbiente()
    await banco.authenticate()
    await banco.sync()
    const vagasSincronizadas = await importarVagas()

    app.listen(porta, '0.0.0.0', () => {
      console.log(`API disponível na porta ${porta}.`)
      console.log(`${vagasSincronizadas} vaga(s) conferida(s) a partir do CSV.`)
    })
  } catch (erro) {
    console.error('Erro ao iniciar o servidor:', erro.message)
    process.exitCode = 1
  }
}

iniciar()
