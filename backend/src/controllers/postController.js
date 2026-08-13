import Post from '../models/Post.js'
import Usuario from '../models/Usuario.js'
import Curtida from '../models/Curtida.js'

function textoLimpo(valor) {
  return typeof valor === 'string' ? valor.trim() : ''
}

export async function listarPosts(req, res) {
  try {
    const posts = await Post.findAll({
      order: [['id', 'DESC']],
      include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nome', 'cargo'] }]
    })

    const curtidas = await Curtida.findAll({ attributes: ['postId', 'usuarioId'] })

    const postsFormatados = posts.map((post) => {
      const curtidasDoPost = curtidas.filter((curtida) => curtida.postId === post.id)
      const curtidaDoMeuId = curtidasDoPost.some((curtida) => curtida.usuarioId === req.usuario.id)

      return {
        id: post.id,
        titulo: post.titulo,
        texto: post.texto,
        criadoEm: post.criado_em,
        autor: post.autor,
        curtidas: curtidasDoPost.length,
        curtidaDoMeuId
      }
    })

    return res.json(postsFormatados)
  } catch (erro) {
    console.error('Erro ao listar posts:', erro)
    return res.status(500).json({ erro: 'Não foi possível listar os posts.' })
  }
}

export async function criarPost(req, res) {
  try {
    const titulo = textoLimpo(req.body.titulo)
    const texto = textoLimpo(req.body.texto)

    if (!titulo || !texto) {
      return res.status(400).json({ erro: 'Preencha o título e o texto do post.' })
    }

    if (titulo.length > 150) {
      return res.status(400).json({ erro: 'O título deve ter no máximo 150 caracteres.' })
    }

    const post = await Post.create({
      titulo,
      texto,
      usuarioId: req.usuario.id
    })

    const autor = await Usuario.findByPk(req.usuario.id, { attributes: ['id', 'nome', 'cargo'] })

    return res.status(201).json({
      id: post.id,
      titulo: post.titulo,
      texto: post.texto,
      criadoEm: post.criado_em,
      autor,
      curtidas: 0,
      curtidaDoMeuId: false
    })
  } catch (erro) {
    console.error('Erro ao criar post:', erro)
    return res.status(500).json({ erro: 'Não foi possível publicar o post.' })
  }
}

export async function curtirPost(req, res) {
  try {
    const post = await Post.findByPk(req.params.id)

    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado.' })
    }

    const curtidaExistente = await Curtida.findOne({
      where: { postId: post.id, usuarioId: req.usuario.id }
    })

    if (curtidaExistente) {
      return res.status(409).json({ erro: 'Você já curtiu esse post.' })
    }

    await Curtida.create({ postId: post.id, usuarioId: req.usuario.id })

    const totalCurtidas = await Curtida.count({ where: { postId: post.id } })

    return res.json({ curtidas: totalCurtidas, curtidaDoMeuId: true })
  } catch (erro) {
    if (erro?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ erro: 'Você já curtiu esse post.' })
    }

    console.error('Erro ao curtir post:', erro)
    return res.status(500).json({ erro: 'Não foi possível curtir o post.' })
  }
}
