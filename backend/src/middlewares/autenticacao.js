import jwt from 'jsonwebtoken'

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization

  if (!cabecalho) {
    return res.status(401).json({ erro: 'Token não informado.' })
  }

  const [tipo, token] = cabecalho.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Formato de token inválido.' })
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = { id: dados.id }
    return next()
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}
