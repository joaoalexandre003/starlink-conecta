import { Sequelize } from 'sequelize'
import 'dotenv/config'

function configuracaoComum() {
  const usarSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true'

  return {
    dialect: 'postgres',
    logging: process.env.DB_LOG === 'true' ? console.log : false,
    dialectOptions: usarSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : undefined
  }
}

async function criarBanco() {
  if (process.env.USE_PG_MEM === 'true') {
    const { newDb, DataType } = await import('pg-mem')
    const memoria = newDb({ autoCreateForeignKeyIndices: true })

    memoria.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'starlink_conecta_test'
    })

    memoria.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 14 (pg-mem)'
    })

    const adaptador = memoria.adapters.createPg()

    return new Sequelize('postgres://postgres:postgres@localhost:5432/starlink_conecta_test', {
      ...configuracaoComum(),
      dialectModule: adaptador
    })
  }

  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, configuracaoComum())
  }

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      ...configuracaoComum(),
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432)
    }
  )
}

const banco = await criarBanco()

export default banco
