import { Router } from 'express'
import { cadastrar, login, buscarPerfil, listarUsuarios } from '../controllers/usuarioController.js'
import { autenticar } from '../middlewares/autenticacao.js'

const router = Router()

router.post('/cadastro', cadastrar)
router.post('/login', login)
router.get('/perfil', autenticar, buscarPerfil)
router.get('/', autenticar, listarUsuarios)

export default router
