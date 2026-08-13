import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    idade: usuario.idade,
    email: usuario.email,
    cargo: usuario.cargo
  }
}

function normalizarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : ''
}

function normalizarEmail(valor) {
  return normalizarTexto(valor).toLowerCase()
}

export async function cadastrar(req, res) {
  try {
    const nome = normalizarTexto(req.body.nome)
    const idade = Number(req.body.idade)
    const email = normalizarEmail(req.body.email)
    const senha = String(req.body.senha || '')
    const cargo = normalizarTexto(req.body.cargo)

    if (!nome || !email || !senha || !cargo || !Number.isInteger(idade)) {
      return res.status(400).json({ erro: 'Preencha todos os campos corretamente para criar a conta.' })
    }

    if (idade < 16 || idade > 100) {
      return res.status(400).json({ erro: 'Informe uma idade entre 16 e 100 anos.' })
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } })

    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Já existe uma conta cadastrada com esse e-mail.' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await Usuario.create({
      nome,
      idade,
      email,
      cargo,
      senha: senhaCriptografada
    })

    const token = gerarToken(usuario)

    return res.status(201).json({
      token,
      usuario: formatarUsuario(usuario)
    })
  } catch (erro) {
    if (erro?.name === 'SequelizeValidationError') {
      return res.status(400).json({ erro: 'Os dados informados não são válidos.' })
    }

    if (erro?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ erro: 'Já existe uma conta cadastrada com esse e-mail.' })
    }

    console.error('Erro no cadastro:', erro)
    return res.status(500).json({ erro: 'Não foi possível concluir o cadastro.' })
  }
}

export async function login(req, res) {
  try {
    const email = normalizarEmail(req.body.email)
    const senha = String(req.body.senha || '')

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' })
    }

    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
    }

    const token = gerarToken(usuario)

    return res.json({
      token,
      usuario: formatarUsuario(usuario)
    })
  } catch (erro) {
    console.error('Erro no login:', erro)
    return res.status(500).json({ erro: 'Não foi possível fazer login.' })
  }
}

export async function buscarPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id)

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' })
    }

    return res.json(formatarUsuario(usuario))
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro)
    return res.status(500).json({ erro: 'Não foi possível buscar o perfil.' })
  }
}

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'idade', 'email', 'cargo', 'criado_em'],
      order: [['nome', 'ASC']]
    })

    return res.json(usuarios)
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro)
    return res.status(500).json({ erro: 'Não foi possível carregar os usuários.' })
  }
}
