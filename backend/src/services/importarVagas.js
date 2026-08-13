import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import Vaga from '../models/Vaga.js'

const arquivoAtual = fileURLToPath(import.meta.url)
const pastaAtual = path.dirname(arquivoAtual)
const caminhoCsv = path.resolve(pastaAtual, '../../data/vagas.csv')

function converterData(data) {
  const partes = String(data || '').split('/')
  if (partes.length !== 3) {
    throw new Error(`Data inválida no CSV: ${data}`)
  }

  const [dia, mes, ano] = partes
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

export async function importarVagas() {
  const conteudo = await fs.readFile(caminhoCsv, 'utf8')
  const registros = parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  })

  const vagas = registros.map((item) => {
    const id = Number(item.ID)
    const salario = Number(item.Salario)

    if (!Number.isInteger(id) || !item.Titulo || !item['Descrição'] || !Number.isFinite(salario)) {
      throw new Error(`Registro de vaga inválido no CSV (ID: ${item.ID || 'não informado'}).`)
    }

    return {
      id,
      titulo: item.Titulo.trim(),
      descricao: item['Descrição'].trim(),
      salario,
      dataLimite: converterData(item.DataLimite)
    }
  })

  for (const vaga of vagas) {
    await Vaga.upsert(vaga)
  }

  return vagas.length
}
