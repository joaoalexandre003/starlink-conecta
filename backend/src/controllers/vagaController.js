import Vaga from '../models/Vaga.js'

export async function listarVagas(req, res) {
  try {
    const vagas = await Vaga.findAll({
      order: [['id', 'ASC']]
    })

    return res.json(vagas)
  } catch (erro) {
    return res.status(500).json({ erro: 'Não foi possível listar as vagas.' })
  }
}

export async function buscarVaga(req, res) {
  try {
    const vaga = await Vaga.findByPk(req.params.id)

    if (!vaga) {
      return res.status(404).json({ erro: 'Vaga não encontrada.' })
    }

    return res.json(vaga)
  } catch (erro) {
    return res.status(500).json({ erro: 'Não foi possível buscar a vaga.' })
  }
}
