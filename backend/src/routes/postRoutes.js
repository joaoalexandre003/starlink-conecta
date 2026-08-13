import { Router } from 'express'
import { listarPosts, criarPost, curtirPost } from '../controllers/postController.js'
import { autenticar } from '../middlewares/autenticacao.js'

const router = Router()

router.use(autenticar)

router.get('/', listarPosts)
router.post('/', criarPost)
router.post('/:id/curtir', curtirPost)

export default router
